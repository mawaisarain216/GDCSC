import { AdminCard, fileInputClass, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import type { Notice } from "@/lib/types";

const CATEGORIES = ["General", "Admission", "Exam", "Result", "Academic"];

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
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" defaultValue={notice?.category || "General"} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Published Date</label>
            <input type="date" name="publishedAt" defaultValue={publishedAt} className={inputClass} />
          </div>
          <div className="flex items-end pb-2.5">
            <ToggleField name="isPinned" label="Pin to top" defaultChecked={notice?.isPinned === 1} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Details (optional)</label>
          <textarea name="body" defaultValue={notice?.body} rows={4} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Attachment (PDF)</label>
          <input type="file" name="file" accept="application/pdf,image/*" className={fileInputClass} />
          {notice?.fileUrl && <p className="text-xs text-gray-400 mt-1">Current: {notice.fileUrl}</p>}
        </div>
      </AdminCard>
      <SubmitButton>{notice ? "Update Notice" : "Publish Notice"}</SubmitButton>
    </form>
  );
}
