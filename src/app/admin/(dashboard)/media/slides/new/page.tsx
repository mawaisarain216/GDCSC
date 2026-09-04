import { AdminPageHeader } from "@/components/admin/ui";
import SlideForm from "@/components/admin/SlideForm";
import { createSlideAction } from "../../../actions";

export default function NewSlidePage() {
  return (
    <div>
      <AdminPageHeader title="Add Slide" />
      <SlideForm action={createSlideAction} />
    </div>
  );
}
