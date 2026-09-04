"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { GraduationCap, XCircle } from "lucide-react";

type State = { error?: string };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(login, {});

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B5D46] p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="w-14 h-14 rounded-full bg-[#0B5D46]/10 text-[#0B5D46] flex items-center justify-center mb-3">
            <GraduationCap size={28} />
          </span>
          <h1 className="font-bold text-lg text-center">GBDC Shahpur Chakar — Admin Panel</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Sign in to manage the website</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              <XCircle size={16} /> {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              defaultValue="admin@gbdcshahpurchakar.edu.pk"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/40"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#0B5D46] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Default: admin@gbdcshahpurchakar.edu.pk / ShahpurChakar@2026 — change this after first login.
        </p>
      </div>
    </div>
  );
}
