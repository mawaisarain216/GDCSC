import { notFound } from "next/navigation";
import { getDepartmentById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import DepartmentForm from "@/components/admin/DepartmentForm";
import { updateDepartmentAction } from "../../../../actions";

export default async function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = await getDepartmentById(id);
  if (!department) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Department" />
      <DepartmentForm department={department} action={updateDepartmentAction.bind(null, id)} />
    </div>
  );
}
