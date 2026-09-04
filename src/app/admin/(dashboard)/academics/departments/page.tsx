import Link from "next/link";
import { getDepartments } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteDepartmentAction } from "../../actions";
import { CheckCircle2, Pencil, Plus } from "lucide-react";

export default async function DepartmentsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const departments = await getDepartments();

  return (
    <div>
      <AdminPageHeader
        title="Departments"
        description="The four faculties/departments shown across the website."
        action={
          <Link href="/admin/academics/departments/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Department
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <AdminCard>
        {departments.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No departments yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {departments.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-400 truncate">/{d.slug} {d.headName && `· Head: ${d.headName}`}</p>
                </div>
                <Link href={`/admin/academics/departments/${d.id}/edit`} aria-label={`Edit ${d.name}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteDepartmentAction} id={d.id} confirmText={`Delete "${d.name}"? Related programs/faculty will remain but lose department link.`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
