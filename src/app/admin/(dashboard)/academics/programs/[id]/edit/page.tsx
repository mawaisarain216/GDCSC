import { notFound } from "next/navigation";
import { getDepartments, getProgramById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import ProgramForm from "@/components/admin/ProgramForm";
import { updateProgramAction } from "../../../../actions";

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await getProgramById(id);
  if (!program) notFound();
  const departments = await getDepartments();

  return (
    <div>
      <AdminPageHeader title="Edit Program" />
      <ProgramForm program={program} departments={departments} action={updateProgramAction.bind(null, id)} />
    </div>
  );
}
