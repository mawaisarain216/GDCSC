import { notFound } from "next/navigation";
import { getDepartments, getFacultyById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import FacultyForm from "@/components/admin/FacultyForm";
import { updateFacultyAction } from "../../../../actions";

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getFacultyById(id);
  if (!member) notFound();
  const departments = await getDepartments();

  return (
    <div>
      <AdminPageHeader title="Edit Faculty Member" />
      <FacultyForm member={member} departments={departments} action={updateFacultyAction.bind(null, id)} />
    </div>
  );
}
