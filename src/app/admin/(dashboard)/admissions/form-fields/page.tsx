import Link from "next/link";
import { getAdmissionFormFields } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteAdmissionFieldAction, toggleAdmissionFieldAction } from "../../actions";
import { CheckCircle2, Pencil, Plus } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  FACULTY: "Choice of Faculty",
  EDUCATIONAL: "Educational Details",
  PERSONAL: "Personal Details",
  DOCUMENTS: "Documents & Declaration",
};

export default async function AdmissionFieldsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const fields = await getAdmissionFormFields();
  const sections = ["FACULTY", "EDUCATIONAL", "PERSONAL", "DOCUMENTS"];

  return (
    <div>
      <AdminPageHeader
        title="Admission Form Fields"
        description="Controls exactly what appears on the public online admission form — add, remove, reorder or mark fields required."
        action={
          <Link href="/admin/admissions/form-fields/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Field
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => {
          const items = fields.filter((f) => f.section === section);
          if (!items.length) return null;
          return (
            <AdminCard key={section}>
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">{SECTION_LABELS[section]}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((f) => (
                  <div key={f.id} className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {f.label} {f.required === 1 && <span className="text-red-500">*</span>}
                      </p>
                      <p className="text-xs text-gray-400">{f.fieldKey} · {f.fieldType}</p>
                    </div>
                    <form action={toggleAdmissionFieldAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <input type="hidden" name="enabled" value={f.enabled === 1 ? "0" : "1"} />
                      <button
                        type="submit"
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.enabled === 1 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {f.enabled === 1 ? "Enabled" : "Disabled"}
                      </button>
                    </form>
                    <Link href={`/admin/admissions/form-fields/${f.id}/edit`} aria-label={`Edit ${f.label}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                      <Pencil size={15} />
                    </Link>
                    <DeleteButton action={deleteAdmissionFieldAction} id={f.id} confirmText={`Remove "${f.label}" from the form?`} />
                  </div>
                ))}
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
