import { getDepartments } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import ProgramForm from "@/components/admin/ProgramForm";
import { createProgramAction } from "../../../actions";

export default async function NewProgramPage() {
  const departments = await getDepartments();
  return (
    <div>
      <AdminPageHeader title="New Program" />
      <ProgramForm departments={departments} action={createProgramAction} />
    </div>
  );
}
