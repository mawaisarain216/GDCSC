import Link from "next/link";
import Image from "next/image";
import { getDepartments, getFaculty } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteFacultyAction } from "../../actions";
import { CheckCircle2, Pencil, Plus, User } from "lucide-react";

export default async function FacultyAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const faculty = await getFaculty();
  const departments = await getDepartments();
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <div>
      <AdminPageHeader
        title="Faculty & Staff"
        description="Teaching staff shown on the Faculty page and department pages."
        action={
          <Link href="/admin/academics/faculty/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Faculty
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <AdminCard>
        {faculty.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No faculty members yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {faculty.map((f) => (
              <div key={f.id} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                  {f.photoUrl ? <Image src={f.photoUrl} alt={f.name} fill className="object-cover" sizes="48px" /> : <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-400">
                    {f.designation}{f.departmentId && ` · ${deptMap.get(f.departmentId) || ""}`}
                    {f.departmentId && departments.some((d) => d.id === f.departmentId && d.headFacultyId === f.id) && (
                      <span className="ml-2 text-[#0B5D46] font-medium">· HOD</span>
                    )}
                  </p>
                </div>
                <Link href={`/admin/academics/faculty/${f.id}/edit`} aria-label={`Edit ${f.name}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteFacultyAction} id={f.id} confirmText={`Delete "${f.name}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
