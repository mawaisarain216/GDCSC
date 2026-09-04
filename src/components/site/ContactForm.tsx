"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/(site)/contact/actions";
import { CheckCircle2, XCircle } from "lucide-react";

type State = { error?: string; success?: boolean };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(sendContactMessage, {});

  if (state?.success) {
    return (
      <div className="card-surface border border-black/5 p-8 text-center">
        <CheckCircle2 className="text-secondary mx-auto mb-3" size={36} />
        <p className="font-heading font-semibold text-lg">Message sent — thank you!</p>
        <p className="text-sm text-text-muted mt-1">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-theme p-3">
          <XCircle size={16} /> {state.error}
        </div>
      )}
      {/* Honeypot — hidden from real visitors via CSS; bots that auto-fill every field trip this. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name *</label>
          <input name="name" required className="w-full rounded-theme border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email *</label>
          <input type="email" name="email" required className="w-full rounded-theme border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <input name="phone" className="w-full rounded-theme border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Subject</label>
          <input name="subject" className="w-full rounded-theme border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Message *</label>
        <textarea name="message" required rows={5} className="w-full rounded-theme border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-solid disabled:opacity-60">
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
