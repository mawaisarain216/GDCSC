import { AdminCard, fileInputClass, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import type { Department } from "@/lib/types";
import Image from "next/image";

export default function DepartmentForm({ department, action }: { department?: Department; action: (formData: FormData) => void }) {
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
            <input name="headName" defaultValue={department?.headName} className={inputClass} />
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
        <div>
          <label className={labelClass}>Image</label>
          {department?.imageUrl && <Image src={department.imageUrl} alt="" width={100} height={60} className="rounded object-cover bg-gray-100 mb-2" />}
          <input type="file" name="image" accept="image/*" className={fileInputClass} />
        </div>
      </AdminCard>
      <SubmitButton>{department ? "Update Department" : "Add Department"}</SubmitButton>
    </form>
  );
}
