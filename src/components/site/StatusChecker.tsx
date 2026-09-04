"use client";

import { useActionState } from "react";
import { checkStatus } from "@/app/(site)/admissions/status/actions";
import { formatDate } from "@/lib/format";
import { CheckCircle2, CircleDashed, Printer, Search, UserRound, XCircle } from "lucide-react";

const STATUS_STEPS = ["RECEIVED", "UNDER_REVIEW", "DOCS_VERIFIED", "SELECTED"];

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Application Received",
  UNDER_REVIEW: "Under Review",
  DOCS_VERIFIED: "Documents Verified",
  SELECTED: "Selected — Merit List",
  WAITLISTED: "Waitlisted",
  REJECTED: "Not Selected",
};

type State = {
  error?: string;
  result?: {
    applicationNo: string;
    status: string;
    programChoice: string;
    submittedAt: string;
    rejectionReason: string;
    photoUrl: string;
    fullName: string;
    fatherName: string;
  };
};

export default function StatusChecker() {
  const [state, formAction, pending] = useActionState<State, FormData>(checkStatus, {});

  return (
    <div className="max-w-xl mx-auto">
      <form action={formAction} className="flex flex-col gap-3">
        {/* Honeypot — hidden from real visitors via CSS, left empty by humans, often auto-filled by bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px opacity-0"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            name="applicationNo"
            placeholder="Application No. — e.g. GBDCSC-2026-0001"
            required
            className="rounded-theme border border-black/10 bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            type="text"
            name="cnic"
            placeholder="CNIC / B-Form No. (as entered on your form)"
            required
            className="rounded-theme border border-black/10 bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <p className="text-xs text-text-muted">
          For your privacy, both your application number and your CNIC / B-Form number are required to view a status.
        </p>
        <button type="submit" disabled={pending} className="btn btn-solid justify-center gap-2 disabled:opacity-60 self-start">
          <Search size={16} /> {pending ? "Checking..." : "Check Status"}
        </button>
      </form>

      {state?.error && (
        <div className="mt-5 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-theme p-4">
          <XCircle size={18} /> {state.error}
        </div>
      )}

      {state?.result && (
        <div className="mt-8 card-surface border border-black/5 p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-text-muted uppercase tracking-wide">Application No.</p>
            <p className="text-xs text-text-muted">{formatDate(state.result.submittedAt)}</p>
          </div>
          <p className="font-heading font-bold text-lg text-primary mb-5">{state.result.applicationNo}</p>

          {["WAITLISTED", "REJECTED"].includes(state.result.status) ? (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-text">
                {state.result.status === "REJECTED" ? (
                  <XCircle className="text-red-500" size={18} />
                ) : (
                  <CircleDashed className="text-accent" size={18} />
                )}
                {STATUS_LABELS[state.result.status]}
              </div>
              {state.result.status === "REJECTED" && state.result.rejectionReason && (
                <p className="mt-3 text-sm text-text-muted bg-red-50 border border-red-100 rounded-theme p-3">
                  <span className="font-medium text-red-600">Reason: </span>
                  {state.result.rejectionReason}
                </p>
              )}
            </div>
          ) : (
            <ol className="space-y-3">
              {STATUS_STEPS.map((step) => {
                const currentIndex = STATUS_STEPS.indexOf(state.result!.status);
                const stepIndex = STATUS_STEPS.indexOf(step);
                const done = stepIndex <= currentIndex;
                return (
                  <li key={step} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 size={18} className="text-secondary shrink-0" />
                    ) : (
                      <CircleDashed size={18} className="text-black/20 shrink-0" />
                    )}
                    <span className={done ? "text-text font-medium" : "text-text-muted"}>
                      {STATUS_LABELS[step]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {state.result.status === "SELECTED" && (
            <div className="mt-6 pt-5 border-t border-black/5">
              <div id="gate-pass-print" className="border-2 border-primary/20 rounded-theme p-5 print:border-black">
                <div className="text-center mb-4 pb-3 border-b border-dashed border-black/10">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Admission Gate Pass</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-20 rounded bg-bg border border-black/10 flex items-center justify-center overflow-hidden shrink-0">
                    {state.result.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={state.result.photoUrl} alt="Applicant" className="w-full h-full object-cover" />
                    ) : (
                      <UserRound className="text-black/20" size={22} />
                    )}
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-sm text-text">{state.result.fullName || "—"}</p>
                    <p className="text-text-muted">S/o {state.result.fatherName || "—"}</p>
                    <p className="text-text-muted">App. No.: {state.result.applicationNo}</p>
                    <p className="text-text-muted">Program: {state.result.programChoice}</p>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-4">
                  Carry original CNIC/B-Form and educational documents along with this pass for verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.body.classList.add("printing-gate-pass");
                  window.print();
                  document.body.classList.remove("printing-gate-pass");
                }}
                className="btn btn-outline mt-3 gap-2 print:hidden"
              >
                <Printer size={16} /> Print Gate Pass
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
