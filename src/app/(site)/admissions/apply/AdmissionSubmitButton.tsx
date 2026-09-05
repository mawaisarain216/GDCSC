"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export default function AdmissionSubmitButton() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      type="submit"
      disabled={submitting}
      onClick={(event) => {
        const form = event.currentTarget.form;
        if (!form) return;
        const uploading = form.querySelector('[data-admission-uploading="true"]');
        if (uploading) {
          event.preventDefault();
          window.alert("Please wait for all document uploads to finish before submitting the application.");
          return;
        }
        setSubmitting(true);
      }}
      className="btn btn-solid w-full sm:w-auto justify-center px-10 disabled:opacity-60 print:hidden gap-2"
    >
      <Send size={16} /> {submitting ? "Submitting..." : "Submit Application"}
    </button>
  );
}
