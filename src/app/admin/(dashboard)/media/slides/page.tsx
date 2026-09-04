import Link from "next/link";
import Image from "next/image";
import { getSlides } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteSlideAction } from "../../actions";
import { CheckCircle2, ImageIcon, Pencil, Plus } from "lucide-react";

export default async function SlidesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const slides = await getSlides();

  return (
    <div>
      <AdminPageHeader
        title="Homepage Slider"
        description="Manage the rotating hero banner images shown at the top of the homepage."
        action={
          <Link href="/admin/media/slides/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> Add Slide
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {slides.map((s) => (
          <AdminCard key={s.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {s.imageUrl ? (
                <Image src={s.imageUrl} alt={s.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={30} /></div>
              )}
              {!s.isActive && <span className="absolute top-2 left-2 bg-gray-900/70 text-white text-xs px-2 py-0.5 rounded">Inactive</span>}
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{s.title || "(no title)"}</p>
                <p className="text-xs text-gray-400 truncate">{s.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/media/slides/${s.id}/edit`} aria-label={`Edit ${s.title || 'slide'}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteSlideAction} id={s.id} confirmText="Delete this slide?" />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
