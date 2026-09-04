import { AdminCard, fileInputClass, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import type { Department, FacultyMember } from "@/lib/types";
import Image from "next/image";

export default function FacultyForm({
  member,
  departments,
  action,
}: {
  member?: FacultyMember;
  departments: Department[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input name="name" required defaultValue={member?.name} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Designation</label>
            <input name="designation" defaultValue={member?.designation || "Lecturer"} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <select name="departmentId" defaultValue={member?.departmentId || ""} className={inputClass}>
              <option value="">— None —</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Qualification</label>
            <input name="qualification" defaultValue={member?.qualification} className={inputClass} placeholder="M.Phil, M.Sc." />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" defaultValue={member?.email} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" name="order_num" defaultValue={member?.order_num ?? 0} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Photo</label>
          {member?.photoUrl && <Image src={member.photoUrl} alt="" width={60} height={60} className="rounded-full object-cover bg-gray-100 mb-2" />}
          <input type="file" name="photo" accept="image/*" className={fileInputClass} />
        </div>
      </AdminCard>
      <SubmitButton>{member ? "Update Faculty Member" : "Add Faculty Member"}</SubmitButton>
    </form>
  );
}
