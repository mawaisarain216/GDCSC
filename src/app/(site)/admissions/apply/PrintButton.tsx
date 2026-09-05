"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print Blank Form" }: { label?: string }) {
  return (
    <button type="button" onClick={() => { document.body.classList.add("printing-admission-form"); window.print(); window.setTimeout(() => document.body.classList.remove("printing-admission-form"), 500); }} className="btn btn-outline gap-2 print:hidden">
      <Printer size={16} /> {label}
    </button>
  );
}
