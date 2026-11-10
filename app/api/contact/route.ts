import { contactBodyMaxBytes, validateContact } from "@/lib/contact-validation";

/*
 * Contact form handler. Sends mail through Resend's HTTP API.
 * Required environment variables (set in .env.local or the host dashboard, never in client code):
 *   RESEND_API_KEY      API key for Resend
 *   CONTACT_TO_EMAIL    Inbox that receives messages (Saif's address; not hard-coded)
 *   CONTACT_FROM_EMAIL  Sender on a domain verified in Resend, e.g. "Portfolio <contact@your-domain.com>"
 *
 * Rate limiting is in-memory and per server instance. It slows down bursts from one client
 * but is not a durable limit across serverless instances. Use a shared store for stronger limits.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const windowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const hits = new Map<string, number[]>();

function clientKey(request: Request) {
  // The rightmost entry is the one the nearest proxy saw; the leftmost can be set by the client.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= maxRequestsPerWindow) {
    hits.set(key, recent);
    return Math.ceil((windowMs - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [name, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(name);
    }
  }
  return 0;
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Unsupported request." }, 415);
  }

  const retryAfter = rateLimited(clientKey(request));
  if (retryAfter) {
    return json({ error: "Too many messages. Please try again later." }, 429, { "Retry-After": String(retryAfter) });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > contactBodyMaxBytes) {
    return json({ error: "Message is too large." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Refuse without saying why.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ error: "Message could not be sent." }, 400);
  }

  const { values, errors } = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return json({ error: "Check the highlighted fields.", errors }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.");
    return json({ error: "The contact form is not available right now." }, 503);
  }

  const idempotencyKey = typeof body.submissionId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(body.submissionId)
    ? body.submissionId
    : undefined;

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": `contact-${idempotencyKey}` } : {}),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `Portfolio contact: ${values.subject}`,
        text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("Contact provider request failed before a response.");
    return json({ error: "Message could not be sent. Please try again." }, 502);
  }

  if (!response.ok) {
    console.error(`Contact provider rejected the message with status ${response.status}.`);
    return json({ error: "Message could not be sent. Please try again." }, 502);
  }

  return json({ ok: true }, 200);
}
