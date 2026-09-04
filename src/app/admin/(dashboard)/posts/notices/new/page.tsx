import { AdminPageHeader } from "@/components/admin/ui";
import NoticeForm from "@/components/admin/NoticeForm";
import { createNoticeAction } from "../../../actions";

export default function NewNoticePage() {
  return (
    <div>
      <AdminPageHeader title="New Notice" />
      <NoticeForm action={createNoticeAction} />
    </div>
  );
}
