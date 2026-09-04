import Link from "next/link";
import { getNotices } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import NoticesListClient from "@/components/admin/NoticesListClient";
import { CheckCircle2, Plus } from "lucide-react";

export default async function NoticesListPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const notices = await getNotices();

  return (
    <div>
      <AdminPageHeader
        title="Notices"
        description="General, admission, exam and result announcements shown on the public site."
        action={
          <Link href="/admin/posts/notices/new" className="inline-flex items-center gap-1.5 bg-[#0B5D46] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
            <Plus size={16} /> New Notice
          </Link>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <NoticesListClient notices={notices} />
    </div>
  );
}
