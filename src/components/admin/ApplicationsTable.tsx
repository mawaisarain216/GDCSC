"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Eye, Search } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  DOCS_VERIFIED: "bg-purple-50 text-purple-700",
  SELECTED: "bg-green-50 text-green-700",
  WAITLISTED: "bg-orange-50 text-orange-700",
  REJECTED: "bg-red-50 text-red-700",
};

export interface ApplicationRow {
  id: string;
  applicationNo: string;
  programChoice: string;
  submittedAt: string;
  status: string;
  fullName: string;
}

export default function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        a.applicationNo.toLowerCase().includes(q) ||
        a.programChoice.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q)
    );
  }, [applications, query]);

  return (
    <div>
      <div className="relative mb-3 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, application no. or program..."
          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/30 focus:border-[#0B5D46] bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 p-6 bg-white rounded-xl border border-gray-200">No applications match.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="p-3">Application No.</th>
                <th className="p-3">Applicant</th>
                <th className="p-3">Program</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="p-3 font-medium text-gray-900">{a.applicationNo}</td>
                  <td className="p-3 text-gray-600">{a.fullName || "—"}</td>
                  <td className="p-3 text-gray-600">{a.programChoice || "—"}</td>
                  <td className="p-3 text-gray-500">{formatDate(a.submittedAt)}</td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status]}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/admissions/applications/${a.id}`} className="inline-flex items-center gap-1.5 text-[#0B5D46] text-xs font-semibold hover:underline">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
