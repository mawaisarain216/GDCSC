import Link from "next/link";
import { getDepartments, getPrograms } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteProgramAction } from "../../actions";
import { CheckCircle2, Pencil, Plus } from "lucide-react";

export default async function ProgramsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const programs = await getPrograms();
  const departments = await getDepartments();
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <div>
      <AdminPageHeader
        title="Programs"
        description="Intermediate and Degree programs offered under each department."
        action={
          <Link href="/admin/academics/programs/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Program
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
          <p className="text-sm text-gray-400 p-6">No programs yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {programs.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    {p.level} · {p.duration}{p.departmentId && ` · ${deptMap.get(p.departmentId) || ""}`}
                  </p>
                </div>
                <Link href={`/admin/academics/programs/${p.id}/edit`} aria-label={`Edit ${p.title}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteProgramAction} id={p.id} confirmText={`Delete "${p.title}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
