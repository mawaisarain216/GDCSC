"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Loader2, Trash2 } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/30 focus:border-[#0B5D46] bg-white";

export const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

/**
 * Styled file input — the raw browser default ("Choose File — No file
 * chosen") reads as plain text, not an interactive control. This uses
 * Tailwind's file: variant to render a clearly-clickable upload button
 * with the current filename beside it, consistent everywhere a file is
 * uploaded in the admin panel.
 */
export const fileInputClass =
  "block w-full text-sm text-gray-600 cursor-pointer file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#0B5D46] file:text-white file:text-sm file:font-medium file:px-4 file:py-2.5 hover:file:opacity-90 file:transition-opacity";

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}

export function SubmitButton({ children = "Save Changes", className = "" }: { children?: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 ${className}`}
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

/**
 * A clearly-clickable on/off toggle switch for boolean form fields (Required,
 * Enabled, Active, Pin to top, etc). Renders as a real switch — not plain
 * text — so it's obvious it's an interactive control, while still posting a
 * normal checkbox value via the surrounding <form action={...}>.
 */
export function ToggleField({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
      <span className="relative inline-block w-11 h-6 shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-[#0B5D46] transition-colors" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

export function DeleteButton({
  action,
  id,
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: (formData: FormData) => void;
  id: string;
  confirmText?: string;
}) {
  const router = useRouter();
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        } else {
          router.refresh();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-red-600 hover:bg-red-50 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Trash2 size={14} /> Delete
      </button>
    </form>
  );
}
