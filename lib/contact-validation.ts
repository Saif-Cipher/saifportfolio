/** Shared by the contact form (client checks) and the route handler (authoritative checks). */

export const contactLimits = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 2000 },
} as const;

export const contactBodyMaxBytes = 8_000;

export type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function clean(value: unknown) {
  return typeof value === "string" ? value.replace(controlCharacters, "").trim() : "";
}

/** Trims input, removes control characters and checks every field against the limits. */
export function validateContact(input: unknown): { values: ContactFields; errors: ContactErrors } {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const values: ContactFields = {
    name: clean(source.name).replace(/[\r\n\t]+/g, " "),
    email: clean(source.email),
    subject: clean(source.subject).replace(/[\r\n\t]+/g, " "),
    message: clean(source.message).replace(/\r\n/g, "\n"),
  };
  const errors: ContactErrors = {};

  if (values.name.length < contactLimits.name.min) errors.name = `Enter your name (at least ${contactLimits.name.min} characters).`;
  else if (values.name.length > contactLimits.name.max) errors.name = `Keep your name under ${contactLimits.name.max} characters.`;

  if (!values.email) errors.email = "Enter your email address.";
  else if (values.email.length > contactLimits.email.max || !emailPattern.test(values.email)) errors.email = "Enter a valid email address.";

  if (values.subject.length < contactLimits.subject.min) errors.subject = `Enter a subject (at least ${contactLimits.subject.min} characters).`;
  else if (values.subject.length > contactLimits.subject.max) errors.subject = `Keep the subject under ${contactLimits.subject.max} characters.`;

  if (values.message.length < contactLimits.message.min) errors.message = `Write a little more (at least ${contactLimits.message.min} characters).`;
  else if (values.message.length > contactLimits.message.max) errors.message = `Keep the message under ${contactLimits.message.max} characters.`;

  return { values, errors };
}
