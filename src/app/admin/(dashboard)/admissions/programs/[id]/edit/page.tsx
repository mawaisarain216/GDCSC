import { notFound } from "next/navigation";
import { getAdmissionProgramById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import AdmissionProgramForm from "@/components/admin/AdmissionProgramForm";
import { updateAdmissionProgramAction } from "../../../../actions";

export default async function EditAdmissionProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await getAdmissionProgramById(id);
  if (!program) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Admission Program" />
      <AdmissionProgramForm program={program} action={updateAdmissionProgramAction.bind(null, id)} />
    </div>
  );
}
