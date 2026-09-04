import Link from "next/link";
import { getNewsEvents } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteNewsEventAction } from "../../actions";
import { formatDate } from "@/lib/format";
import { CheckCircle2, Pencil, Plus } from "lucide-react";

export default async function NewsEventsListPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const items = await getNewsEvents();

  return (
    <div>
      <AdminPageHeader
        title="News & Events"
        description="Campus news, achievements and upcoming events."
        action={
          <Link href="/admin/posts/news-events/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Post
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <AdminCard>
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No posts yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((n) => (
              <div key={n.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#116A55] uppercase">{n.type}</span>
                  <span className="text-xs text-gray-400 ml-2">{formatDate(n.eventDate || n.publishedAt)}</span>
                  <p className="font-medium text-gray-900 truncate">{n.title}</p>
                </div>
                <Link href={`/admin/posts/news-events/${n.id}/edit`} aria-label={`Edit ${n.title}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteNewsEventAction} id={n.id} confirmText={`Delete "${n.title}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
