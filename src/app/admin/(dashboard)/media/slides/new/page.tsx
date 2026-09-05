import { AdminPageHeader } from "@/components/admin/ui";
import SlideForm from "@/components/admin/SlideForm";
import { createSlideAction } from "../../../actions";

export default async function NewSlidePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <AdminPageHeader title="Add Slide" />
      {error && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          Please upload a slide image before saving.
        </div>
      )}
      <SlideForm action={createSlideAction} />
    </div>
  );
}
