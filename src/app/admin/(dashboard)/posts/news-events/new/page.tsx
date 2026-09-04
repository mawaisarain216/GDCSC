import { AdminPageHeader } from "@/components/admin/ui";
import NewsEventForm from "@/components/admin/NewsEventForm";
import { createNewsEventAction } from "../../../actions";

export default function NewNewsEventPage() {
  return (
    <div>
      <AdminPageHeader title="New News / Event" />
      <NewsEventForm action={createNewsEventAction} />
    </div>
  );
}
