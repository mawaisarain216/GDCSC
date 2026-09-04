import { notFound } from "next/navigation";
import { getAdmissionFormFieldById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import AdmissionFieldForm from "@/components/admin/AdmissionFieldForm";
import { updateAdmissionFieldAction } from "../../../../actions";

export default async function EditAdmissionFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await getAdmissionFormFieldById(id);
  if (!field) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Admission Form Field" />
      <AdmissionFieldForm field={field} action={updateAdmissionFieldAction.bind(null, id)} />
    </div>
  );
}
