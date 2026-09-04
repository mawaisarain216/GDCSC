"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/admin/(dashboard)/actions";
import { inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import { CheckCircle2, XCircle } from "lucide-react";

type State = { error?: string; success?: string };

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState<State, FormData>(changePasswordAction, {});

  return (
    <form action={formAction} className="space-y-4" key={state?.success ? "reset" : "form"}>
      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          <XCircle size={16} className="shrink-0" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
          <CheckCircle2 size={16} className="shrink-0" /> {state.success}
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Current Password</label>
          <input type="password" name="currentPassword" required autoComplete="current-password" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>New Password</label>
          <input type="password" name="newPassword" required autoComplete="new-password" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input type="password" name="confirmPassword" required autoComplete="new-password" className={inputClass} />
        </div>
      </div>
      <p className="text-xs text-gray-500">At least 8 characters, including one uppercase letter and one number.</p>
      <SubmitButton>Update Password</SubmitButton>
    </form>
  );
}
