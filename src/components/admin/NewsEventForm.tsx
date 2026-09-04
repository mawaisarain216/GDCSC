import { AdminCard, fileInputClass, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import type { NewsEvent } from "@/lib/types";
import Image from "next/image";

export default function NewsEventForm({
  item,
  action,
}: {
  item?: NewsEvent;
  action: (formData: FormData) => void;
}) {
  const publishedAt = item?.publishedAt ? item.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
  const eventDate = item?.eventDate ? item.eventDate.slice(0, 10) : "";

  return (
    <form action={action} className="space-y-5">
      <AdminCard className="p-5 space-y-5">
        <div>
          <label className={labelClass}>Title</label>
          <input name="title" required defaultValue={item?.title} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" defaultValue={item?.type || "NEWS"} className={inputClass}>
              <option value="NEWS">News</option>
              <option value="EVENT">Event</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Published Date</label>
            <input type="date" name="publishedAt" defaultValue={publishedAt} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Event Date (if applicable)</label>
            <input type="date" name="eventDate" defaultValue={eventDate} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Content</label>
          <textarea name="body" defaultValue={item?.body} rows={6} className={inputClass} placeholder="Supports basic HTML, e.g. <p>...</p>" />
        </div>
        <div>
          <label className={labelClass}>Cover Image</label>
          <div className="flex items-center gap-3">
            {item?.coverImageUrl && <Image src={item.coverImageUrl} alt="" width={60} height={40} className="rounded object-cover bg-gray-100" />}
            <input type="file" name="coverImage" accept="image/*" className={fileInputClass} />
          </div>
        </div>
      </AdminCard>
      <SubmitButton>{item ? "Update Post" : "Publish Post"}</SubmitButton>
    </form>
  );
}
