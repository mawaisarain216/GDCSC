"use client";

import { useState } from "react";
import Link from "next/link";
import { updateApplicationStatusAction } from "@/app/admin/(dashboard)/actions";
import type { AdmissionStatus } from "@/lib/types";
import { CheckCircle2, Circle, Printer, XCircle } from "lucide-react";

const STEP_ORDER: { key: AdmissionStatus; label: string }[] = [
  { key: "RECEIVED", label: "Received" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "DOCS_VERIFIED", label: "Documents Verified" },
  { key: "SELECTED", label: "Selected" },
];

const ACTION_LABELS: Partial<Record<AdmissionStatus, string>> = {
  UNDER_REVIEW: "Start Review",
  DOCS_VERIFIED: "Confirm Documents Verified",
  SELECTED: "Select / Accept Applicant",
  WAITLISTED: "Move to Waitlist",
};

export default function ApplicationStatusPanel({
  applicationId,
  status,
  rejectionReason,
  allowedNext,
}: {
  applicationId: string;
  status: AdmissionStatus;
  rejectionReason: string;
  allowedNext: AdmissionStatus[];
}) {
  const [showReject, setShowReject] = useState(false);
  const forwardSteps = allowedNext.filter((s) => s !== "REJECTED");
  const canReject = allowedNext.includes("REJECTED");

  const currentIndex = status === "WAITLISTED" ? STEP_ORDER.findIndex((s) => s.key === "DOCS_VERIFIED") : STEP_ORDER.findIndex((s) => s.key === status);

  return (
    <div className="space-y-5">
      {status !== "REJECTED" && (
        <ol className="space-y-2.5">
          {STEP_ORDER.map((step, i) => (
            <li key={step.key} className="flex items-center gap-2.5 text-sm">
              {i <= currentIndex ? (
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
              ) : (
                <Circle size={16} className="text-gray-300 shrink-0" />
              )}
              <span className={i <= currentIndex ? "font-medium text-gray-900" : "text-gray-400"}>{step.label}</span>
            </li>
          ))}
          {status === "WAITLISTED" && (
            <li className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
              <span className="font-medium text-gray-900">Waitlisted</span>
            </li>
          )}
        </ol>
      )}

      {status === "REJECTED" && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Application Rejected</p>
            {rejectionReason && <p className="text-red-600 mt-0.5">{rejectionReason}</p>}
          </div>
        </div>
      )}

      {(forwardSteps.length > 0 || canReject) && (
        <div className="space-y-2">
          {forwardSteps.map((s) => (
            <form key={s} action={updateApplicationStatusAction}>
              <input type="hidden" name="id" value={applicationId} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                {ACTION_LABELS[s] || `Mark as ${s}`}
              </button>
            </form>
          ))}

          {canReject && !showReject && (
            <button
              type="button"
              onClick={() => setShowReject(true)}
              className="w-full text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors"
            >
              Reject Application
            </button>
          )}

          {canReject && showReject && (
            <form action={updateApplicationStatusAction} className="space-y-2 border border-red-100 bg-red-50/50 rounded-lg p-3">
              <input type="hidden" name="id" value={applicationId} />
              <input type="hidden" name="status" value="REJECTED" />
              <label className="block text-xs font-medium text-gray-700">
                Reason for rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                required
                rows={3}
                placeholder="e.g. Documents not attached properly, 10th certificate missing..."
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-red-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="text-sm text-gray-500 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="pt-1 border-t border-gray-100 space-y-2">
        <Link
          href={`/admin/print/applications/${applicationId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Printer size={15} /> Print Full Application
        </Link>
        {status === "SELECTED" && (
          <Link
            href={`/admin/print/applications/${applicationId}?type=gate-pass`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-[#2b2205] font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Printer size={15} /> Print Gate Pass
          </Link>
        )}
      </div>
    </div>
  );
}
