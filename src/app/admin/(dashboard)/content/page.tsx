import { getAllContentBlocks } from "@/lib/repo";
import { AdminCard, AdminPageHeader, labelClass, SubmitButton } from "@/components/admin/ui";
import { saveContentBlocks } from "../actions";
import PrincipalPhotoUpload from "./PrincipalPhotoUpload";
import { CheckCircle2 } from "lucide-react";

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const blocks = await getAllContentBlocks();

  return (
    <div>
      <AdminPageHeader
        title="Website Content"
        description="Edit the homepage hero, about text, principal's message and contact intro — shown live on the public site."
      />

      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Content updated successfully.
        </div>
      )}

      <form action={saveContentBlocks} className="space-y-5">
        {blocks.map((b) => (
          <AdminCard key={b.id} className="p-5">
            <label className={labelClass}>{b.label}</label>

            {b.type === "IMAGE" ? (
              <PrincipalPhotoUpload initialUrl={b.value} />
            ) : b.type === "HTML" ? (
              <textarea
                name={b.key}
                defaultValue={b.value}
                rows={5}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/30 focus:border-[#0B5D46] bg-white"
              />
            ) : (
              <textarea
                name={b.key}
                defaultValue={b.value}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/30 focus:border-[#0B5D46] bg-white"
              />
            )}

            {b.type !== "IMAGE" && (
              <p className="text-xs text-gray-400 mt-1">
                Key: {b.key}
                {b.type === "HTML"
                  ? " — supports basic HTML tags like <p>, <strong>, <br>"
                  : ""}
              </p>
            )}
          </AdminCard>
        ))}

        <SubmitButton>Save All Content</SubmitButton>
      </form>
    </div>
  );
}
