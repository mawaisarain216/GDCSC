import Link from "next/link";
import { getAdmissionPrograms } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteAdmissionProgramAction } from "../../actions";
import { CheckCircle2, Pencil, Plus } from "lucide-react";

export default async function AdmissionProgramsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const programs = await getAdmissionPrograms();

  return (
    <div>
      <AdminPageHeader
        title="Admission Programs & Seats"
        description="Faculties, seat counts and open/closed status shown on the Admissions page."
        action={
          <Link href="/admin/admissions/programs/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Entry
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <AdminCard>
        {programs.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No admission programs configured yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {programs.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.faculty} · {p.seats} seats</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.isOpen ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.isOpen ? "Open" : "Closed"}
                </span>
                <Link href={`/admin/admissions/programs/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteAdmissionProgramAction} id={p.id} confirmText={`Delete "${p.name}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
