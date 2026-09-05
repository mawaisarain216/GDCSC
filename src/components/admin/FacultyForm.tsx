import { AdminCard, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Department, FacultyMember } from "@/lib/types";

export default function FacultyForm({
  member,
  departments,
  action,
}: {
  member?: FacultyMember;
  departments: Department[];
  action: (formData: FormData) => void;
}) {
  const selectedDepartment = member?.departmentId
    ? departments.find((department) => department.id === member.departmentId)
    : undefined;

  const isHead = selectedDepartment?.headFacultyId === member?.id;

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
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              This determines which department page lists this staff member.
            </p>
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

        <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
          <ToggleField
            name="isHeadOfDepartment"
            label="Head of Department"
            defaultChecked={isHead}
          />
          <p className="text-xs text-gray-400 mt-1 ml-14">
            Only one staff member can be HOD for a department. Selecting a new HOD automatically replaces the previous one.
          </p>
        </div>

        <ImageUploadField
          name="photoUrl"
          folder="faculty"
          currentUrl={member?.photoUrl}
          label="Staff photo"
          description="Recommended square portrait: 400 × 400 px."
        />
      </AdminCard>

      <SubmitButton>{member ? "Update Faculty Member" : "Add Faculty Member"}</SubmitButton>
    </form>
  );
}
