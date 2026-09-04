import { notFound } from "next/navigation";
import { getNewsEventById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import NewsEventForm from "@/components/admin/NewsEventForm";
import { updateNewsEventAction } from "../../../../actions";

export default async function EditNewsEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsEventById(id);
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit News / Event" />
      <NewsEventForm item={item} action={updateNewsEventAction.bind(null, id)} />
    </div>
  );
}
