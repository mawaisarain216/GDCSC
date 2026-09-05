import { AdminCard, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Department, FacultyMember } from "@/lib/types";

export default function DepartmentForm({
  department,
  faculty,
  action,
}: {
  department?: Department;
  faculty: FacultyMember[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Department Name</label>
            <input name="name" required defaultValue={department?.name} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL Slug</label>
            <input name="slug" required defaultValue={department?.slug} className={inputClass} placeholder="science" />
          </div>
          <div>
            <label className={labelClass}>Head of Department</label>
            <select
              name="headFacultyId"
              defaultValue={department?.headFacultyId || ""}
              className={inputClass}
              disabled={!department}
            >
              <option value="">— No HOD —</option>
              {faculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}{member.designation ? ` · ${member.designation}` : ""}
                </option>
              ))}
            </select>
            {!department ? (
              <p className="text-xs text-gray-400 mt-1">
                Save the department first, then assign its HOD from the faculty list.
              </p>
            ) : faculty.length === 0 ? (
              <p className="text-xs text-gray-400 mt-1">
                Add faculty to this department first. Only staff belonging to this department can be selected.
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                This list is linked to the staff assigned to this department.
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" name="order_num" defaultValue={department?.order_num ?? 0} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" defaultValue={department?.description} rows={4} className={inputClass} />
        </div>

        <ImageUploadField
          name="imageUrl"
          folder="departments"
          currentUrl={department?.imageUrl}
          label="Department image"
          description="Recommended square image: 800 × 800 px."
        />
      </AdminCard>

      <SubmitButton>{department ? "Update Department" : "Add Department"}</SubmitButton>
    </form>
  );
}
