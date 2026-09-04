import { AdminPageHeader } from "@/components/admin/ui";
import DepartmentForm from "@/components/admin/DepartmentForm";
import { createDepartmentAction } from "../../../actions";

export default function NewDepartmentPage() {
  return (
    <div>
      <AdminPageHeader title="New Department" />
      <DepartmentForm action={createDepartmentAction} />
    </div>
  );
}
