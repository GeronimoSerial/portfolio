import type { APIRoute } from 'astro';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } from 'astro:env/server';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

type Fields = Record<string, unknown>;

async function readFields(request: Request): Promise<Fields | null> {
  const contentType = request.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      const body: unknown = await request.json();
      return body && typeof body === 'object' ? (body as Fields) : null;
    }
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return null;
  }
  return null;
}

function text(fields: Fields, key: string): string {
  const value = fields[key];
  return typeof value === 'string' ? value.trim() : '';
}

function json(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status });
}

export const POST: APIRoute = async ({ request }) => {
  const fields = await readFields(request);
  if (!fields) {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Bots get a success
  // answer and nothing is sent.
  if (text(fields, 'website')) {
    return json({ ok: true }, 200);
  }

  const name = text(fields, 'name');
  const email = text(fields, 'email');
  const message = text(fields, 'message');

  if (!name || !email || !message) {
    return json({ error: 'missing_fields' }, 400);
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return json({ error: 'message_too_short' }, 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: 'message_too_long' }, 400);
  }

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !RESEND_TO_EMAIL) {
    console.error('Contact form is not configured: set RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL.');
    return json({ error: 'not_configured' }, 500);
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [RESEND_TO_EMAIL],
      subject: `New contact message from ${name.replace(/[\r\n]+/g, ' ')}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      replyTo: email,
    });

    if (error) {
      console.error('Resend rejected the contact email:', error.name);
      return json({ error: 'send_failed' }, 500);
    }
  } catch (error) {
    console.error('Contact email failed:', error instanceof Error ? error.name : 'unknown');
    return json({ error: 'send_failed' }, 500);
  }

  return json({ ok: true }, 200);
};
