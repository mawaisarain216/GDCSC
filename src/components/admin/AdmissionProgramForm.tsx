import { AdminCard, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import type { AdmissionProgram } from "@/lib/types";

const FACULTIES = ["Pre-Medical", "Pre-Engineering", "Arts", "Computer Science"];

export default function AdmissionProgramForm({
  program,
  action,
}: {
  program?: AdmissionProgram;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Program / Class Name</label>
          <input name="name" required defaultValue={program?.name} className={inputClass} placeholder="Intermediate Part-I" />
        </div>
        <div>
          <label className={labelClass}>Faculty</label>
          <select name="faculty" defaultValue={program?.faculty || "Arts"} className={inputClass}>
            {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Seats</label>
          <input type="number" name="seats" defaultValue={program?.seats ?? 0} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input type="number" name="order_num" defaultValue={program?.order_num ?? 0} className={inputClass} />
        </div>
        <div className="flex items-center pt-6">
          <ToggleField name="isOpen" label="Admissions Open" defaultChecked={program ? program.isOpen === 1 : true} />
        </div>
        <p className="sm:col-span-2 text-xs text-gray-500 -mt-2">
          The public "Apply Online" form only accepts applications while at least one program here is Open with Seats
          greater than 0. Set Seats to 0 or switch this Off once a program's seats are filled.
        </p>
      </AdminCard>
      <SubmitButton>{program ? "Update" : "Add"}</SubmitButton>
    </form>
  );
}
