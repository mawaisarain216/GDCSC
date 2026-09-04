"use server";

import { z } from "zod";
import { createContactMessage } from "@/lib/repo";
import { nowIso } from "@/lib/db";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Please enter a message.").max(5000),
});

export async function sendContactMessage(_prevState: unknown, formData: FormData) {
  // Honeypot — hidden field real visitors never fill; bots that auto-fill
  // every input trip this and get a generic success (so they don't retry).
  if (((formData.get("website") as string) || "").trim()) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { limited, minutesRemaining } = await checkFormRateLimit("contact", ip);
  if (limited) {
    return { error: `Too many messages sent from this connection. Please try again in about ${minutesRemaining} minute(s).` };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    await recordFormAttempt("contact", ip);
    return { error: parsed.error.issues[0]?.message || "Please check the form and try again." };
  }

  await recordFormAttempt("contact", ip);
  const { name, email, phone, subject, message } = parsed.data;
  await createContactMessage({ name, email, phone: phone || "", subject: subject || "", message, submittedAt: nowIso() });
  return { success: true };
}
