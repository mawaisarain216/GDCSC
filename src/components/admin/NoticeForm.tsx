import { AdminCard, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Notice } from "@/lib/types";

export default function NoticeForm({
  notice,
  action,
}: {
  notice?: Notice;
  action: (formData: FormData) => void;
}) {
  const publishedAt = notice?.publishedAt ? notice.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div>
          <label className={labelClass}>Title</label>
          <input name="title" required defaultValue={notice?.title} className={inputClass} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Category</label>
            <input name="category" defaultValue={notice?.category || "General"} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Published Date</label>
            <input type="date" name="publishedAt" defaultValue={publishedAt} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Body</label>
          <textarea name="body" defaultValue={notice?.body} rows={6} className={inputClass} placeholder="Supports basic HTML, e.g. <p>...</p>" />
        </div>

        <ToggleField name="isPinned" label="Pin to top" defaultChecked={notice?.isPinned === 1} />

        <ImageUploadField
          name="fileUrl"
          folder="notices"
          currentUrl={notice?.fileUrl}
          label="Attachment"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
          kind="file"
          description="Optional PDF or image attachment."
        />
      </AdminCard>

      <SubmitButton>{notice ? "Update Notice" : "Publish Notice"}</SubmitButton>
    </form>
  );
}
