import { AdminPageHeader } from "@/components/admin/ui";
import AdmissionProgramForm from "@/components/admin/AdmissionProgramForm";
import { createAdmissionProgramAction } from "../../../actions";

export default function NewAdmissionProgramPage() {
  return (
    <div>
      <AdminPageHeader title="New Admission Program" />
      <AdmissionProgramForm action={createAdmissionProgramAction} />
    </div>
  );
}
