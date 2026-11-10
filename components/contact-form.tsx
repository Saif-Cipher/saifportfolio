"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { contactLimits, validateContact, type ContactErrors, type ContactFields } from "@/lib/contact-validation";
import styles from "./contact-form.module.css";

type Status = "idle" | "sending" | "success" | "error";

const empty: ContactFields = { name: "", email: "", subject: "", message: "" };

function newSubmissionId() {
  // randomUUID is only available in secure contexts; getRandomValues works everywhere.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const sending = useRef(false);
  const submissionId = useRef<string | null>(null);
  const formId = useId();

  function update(field: keyof ContactFields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "");
    const checked = validateContact(values);
    setErrors(checked.errors);
    if (Object.keys(checked.errors).length > 0) {
      setStatus("error");
      setNotice("Check the highlighted fields and try again.");
      const firstInvalid = (Object.keys(checked.errors)[0] as keyof ContactFields);
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    sending.current = true;
    setStatus("sending");
    setNotice("");
    submissionId.current ??= newSubmissionId();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checked.values, website: honeypot, submissionId: submissionId.current }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string; errors?: ContactErrors };

      if (response.ok) {
        submissionId.current = null;
        setValues(empty);
        setErrors({});
        setStatus("success");
        setNotice("Message sent. I will reply to the email address you gave.");
        return;
      }

      if (data.errors) setErrors(data.errors);
      setStatus("error");
      setNotice(data.error ?? "Message could not be sent. Please try again.");
    } catch {
      setStatus("error");
      setNotice("Message could not be sent. Check your connection and try again.");
    } finally {
      sending.current = false;
    }
  }

  const busy = status === "sending";
  const messageCount = values.message.length;

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={busy}>
      <div className={styles.row}>
        <Field id={`${formId}-name`} label="Name" error={errors.name}>
          <input id={`${formId}-name`} name="name" type="text" autoComplete="name" maxLength={contactLimits.name.max}
            value={values.name} onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${formId}-name-error` : undefined} disabled={busy} />
        </Field>
        <Field id={`${formId}-email`} label="Email" error={errors.email}>
          <input id={`${formId}-email`} name="email" type="email" autoComplete="email" maxLength={contactLimits.email.max}
            value={values.email} onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : undefined} disabled={busy} />
        </Field>
      </div>
      <Field id={`${formId}-subject`} label="Subject" error={errors.subject}>
        <input id={`${formId}-subject`} name="subject" type="text" maxLength={contactLimits.subject.max}
          value={values.subject} onChange={(event) => update("subject", event.target.value)}
          aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? `${formId}-subject-error` : undefined} disabled={busy} />
      </Field>
      <Field id={`${formId}-message`} label="Message" error={errors.message}
        hint={`${messageCount} / ${contactLimits.message.max}`}>
        <textarea id={`${formId}-message`} name="message" rows={6} maxLength={contactLimits.message.max}
          value={values.message} onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${formId}-message-error` : undefined} disabled={busy} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy ? "SENDING…" : "SEND MESSAGE"}
        </button>
        <p className={styles.notice} role="status" aria-live="polite" data-status={status}>{notice}</p>
      </div>
    </form>
  );
}

function Field({ id, label, error, hint, children }: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id}>{label}</label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      {children}
      {error && <p className={styles.error} id={`${id}-error`}>{error}</p>}
    </div>
  );
}
