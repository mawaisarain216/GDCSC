import { AdminCard, fileInputClass, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import type { Slide } from "@/lib/types";
import Image from "next/image";

export default function SlideForm({ slide, action }: { slide?: Slide; action: (formData: FormData) => void }) {
  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div>
          <label className={labelClass}>Slide Image {slide ? "(leave blank to keep current)" : ""}</label>
          {slide?.imageUrl && <Image src={slide.imageUrl} alt="" width={160} height={90} className="rounded object-cover bg-gray-100 mb-2" />}
          <input type="file" name="image" accept="image/*" required={!slide} className={fileInputClass} />
        </div>
        <div>
          <label className={labelClass}>Title</label>
          <input name="title" defaultValue={slide?.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <textarea name="subtitle" defaultValue={slide?.subtitle} rows={2} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Button Text</label>
            <input name="buttonText" defaultValue={slide?.buttonText || "Apply for Admission"} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Button URL</label>
            <input name="buttonUrl" defaultValue={slide?.buttonUrl || "/admissions/apply"} className={inputClass} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" name="order_num" defaultValue={slide?.order_num ?? 0} className={`${inputClass} w-24`} />
          </div>
          <div className="pt-6">
            <ToggleField name="isActive" label="Active" defaultChecked={slide ? slide.isActive === 1 : true} />
          </div>
        </div>
      </AdminCard>
      <SubmitButton>{slide ? "Update Slide" : "Add Slide"}</SubmitButton>
    </form>
  );
}
