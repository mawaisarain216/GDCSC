"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <div className="max-w-3xl mx-auto mb-4 print:hidden flex justify-end px-4 sm:px-0">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow"
      >
        <Printer size={16} /> Print
      </button>
    </div>
  );
}
