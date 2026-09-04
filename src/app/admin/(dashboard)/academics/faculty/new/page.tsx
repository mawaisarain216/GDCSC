import { getDepartments } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import FacultyForm from "@/components/admin/FacultyForm";
import { createFacultyAction } from "../../../actions";

export default async function NewFacultyPage() {
  const departments = await getDepartments();
  return (
    <div>
      <AdminPageHeader title="New Faculty Member" />
      <FacultyForm departments={departments} action={createFacultyAction} />
    </div>
  );
}
