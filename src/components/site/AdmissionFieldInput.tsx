import type { AdmissionFormField } from "@/lib/types";
import AdmissionFileUploadField from "./AdmissionFileUploadField";

export default function AdmissionFieldInput({
  field,
  optionsOverride,
}: {
  field: AdmissionFormField;
  /** When set, replaces the field's stored options — used for the "faculty"
   * choice field so it only lists faculties that currently have open seats. */
  optionsOverride?: string[];
}) {
  const required = field.required === 1;
  let options: string[] = [];
  try {
    options = JSON.parse(field.options || "[]");
  } catch {
    options = [];
  }
  if (optionsOverride) options = optionsOverride;

  const label = (
    <label htmlFor={field.fieldKey} className="block text-sm font-medium text-text mb-1.5">
      {field.label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const baseInputClass =
    "w-full rounded-theme border border-black/10 bg-surface px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

  switch (field.fieldType) {
    case "select":
      return (
        <div>
          {label}
          <select id={field.fieldKey} name={field.fieldKey} required={required} className={baseInputClass} defaultValue="">
            <option value="" disabled>
              Select {field.label}
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div>
          <span className="block text-sm font-medium text-text mb-1.5">
            {field.label} {required && <span className="text-red-500">*</span>}
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {options.map((o) => (
              <label key={o} className="inline-flex items-center gap-2 text-sm text-text">
                <input type="radio" name={field.fieldKey} value={o} required={required} className="accent-[var(--primary)]" />
                {o}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <label className="inline-flex items-start gap-2.5 text-sm text-text">
          <input type="checkbox" name={field.fieldKey} required={required} className="mt-0.5 accent-[var(--primary)]" />
          <span>
            {field.label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      );

    case "textarea":
      return (
        <div>
          {label}
          <textarea id={field.fieldKey} name={field.fieldKey} required={required} rows={3} className={baseInputClass} />
        </div>
      );

    case "date":
      return (
        <div>
          {label}
          <input type="date" id={field.fieldKey} name={field.fieldKey} required={required} className={baseInputClass} />
        </div>
      );

    case "file":
      return <AdmissionFileUploadField field={field} />;

    default:
      return (
        <div>
          {label}
          <input
            type={field.fieldKey.toLowerCase().includes("email") ? "email" : "text"}
            id={field.fieldKey}
            name={field.fieldKey}
            required={required}
            className={baseInputClass}
          />
        </div>
      );
  }
}
