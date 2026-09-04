import { AdminCard, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import type { Department, Program } from "@/lib/types";

export default function ProgramForm({
  program,
  departments,
  action,
}: {
  program?: Program;
  departments: Department[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div>
          <label className={labelClass}>Program Title</label>
          <input name="title" required defaultValue={program?.title} className={inputClass} placeholder="BS Computer Science" />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Department</label>
            <select name="departmentId" defaultValue={program?.departmentId || ""} className={inputClass}>
              <option value="">— None —</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select name="level" defaultValue={program?.level || "Intermediate"} className={inputClass}>
              <option value="Intermediate">Intermediate</option>
              <option value="BS (Hons)">BS (Hons)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <input name="duration" defaultValue={program?.duration || "2 Years"} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" defaultValue={program?.description} rows={3} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input type="number" name="order_num" defaultValue={program?.order_num ?? 0} className={`${inputClass} w-24`} />
        </div>
      </AdminCard>
      <SubmitButton>{program ? "Update Program" : "Add Program"}</SubmitButton>
    </form>
  );
}
