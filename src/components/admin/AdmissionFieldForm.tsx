import { AdminCard, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import type { AdmissionFormField } from "@/lib/types";

const SECTIONS = [
  { value: "FACULTY", label: "Choice of Faculty" },
  { value: "EDUCATIONAL", label: "Educational Details" },
  { value: "PERSONAL", label: "Personal Details" },
  { value: "DOCUMENTS", label: "Documents & Declaration" },
];

const TYPES = ["text", "select", "radio", "checkbox", "date", "textarea", "file"];

export default function AdmissionFieldForm({
  field,
  action,
}: {
  field?: AdmissionFormField;
  action: (formData: FormData) => void;
}) {
  let optionsStr = "";
  try {
    optionsStr = field ? (JSON.parse(field.options || "[]") as string[]).join(", ") : "";
  } catch {
    optionsStr = "";
  }

  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Field Label</label>
            <input name="label" required defaultValue={field?.label} className={inputClass} placeholder="Father's Occupation" />
          </div>
          {!field && (
            <div>
              <label className={labelClass}>Field Key (internal, optional)</label>
              <input name="fieldKey" className={inputClass} placeholder="auto-generated from label if left blank" />
            </div>
          )}
          <div>
            <label className={labelClass}>Section</label>
            <select name="section" defaultValue={field?.section || "PERSONAL"} className={inputClass}>
              {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Input Type</label>
            <select name="fieldType" defaultValue={field?.fieldType || "text"} className={inputClass}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" name="order_num" defaultValue={field?.order_num ?? 0} className={inputClass} />
          </div>
          <div className="flex items-center gap-6 pt-6">
            <ToggleField name="required" label="Required" defaultChecked={field ? field.required === 1 : true} />
            <ToggleField name="enabled" label="Enabled" defaultChecked={field ? field.enabled === 1 : true} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Options (comma-separated — for Select / Radio only)</label>
          <input name="options" defaultValue={optionsStr} className={inputClass} placeholder="Sindhi, Urdu" />
        </div>
      </AdminCard>
      <SubmitButton>{field ? "Update Field" : "Add Field"}</SubmitButton>
    </form>
  );
}
