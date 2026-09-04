import { AdminPageHeader } from "@/components/admin/ui";
import AdmissionFieldForm from "@/components/admin/AdmissionFieldForm";
import { createAdmissionFieldAction } from "../../../actions";

export default function NewAdmissionFieldPage() {
  return (
    <div>
      <AdminPageHeader title="New Admission Form Field" />
      <AdmissionFieldForm action={createAdmissionFieldAction} />
    </div>
  );
}
