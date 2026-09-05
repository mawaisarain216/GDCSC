"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print", printClass }: { label?: string; printClass?: string }) {
  return (
    <div className="max-w-3xl mx-auto mb-4 print:hidden flex justify-end px-4 sm:px-0">
      <button
        type="button"
        onClick={() => {
          if (printClass) document.body.classList.add(printClass);
          window.print();
          window.setTimeout(() => {
            if (printClass) document.body.classList.remove(printClass);
          }, 500);
        }}
        className="inline-flex items-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow"
      >
        <Printer size={16} /> {label}
      </button>
    </div>
  );
}
