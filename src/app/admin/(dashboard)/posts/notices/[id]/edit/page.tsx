import { notFound } from "next/navigation";
import { getNotice } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import NoticeForm from "@/components/admin/NoticeForm";
import { updateNoticeAction } from "../../../../actions";

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Notice" />
      <NoticeForm notice={notice} action={updateNoticeAction.bind(null, id)} />
    </div>
  );
}
