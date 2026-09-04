import { notFound } from "next/navigation";
import { getSlideById } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import SlideForm from "@/components/admin/SlideForm";
import { updateSlideAction } from "../../../../actions";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await getSlideById(id);
  if (!slide) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Slide" />
      <SlideForm slide={slide} action={updateSlideAction.bind(null, id)} />
    </div>
  );
}
