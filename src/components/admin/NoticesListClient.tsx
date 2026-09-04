"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminCard, DeleteButton } from "@/components/admin/ui";
import { deleteNoticeAction } from "@/app/admin/(dashboard)/actions";
import { formatDate } from "@/lib/format";
import { Pencil, Pin, Search } from "lucide-react";
import type { Notice } from "@/lib/types";

export default function NoticesListClient({ notices }: { notices: Notice[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter((n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q));
  }, [notices, query]);

  return (
    <div>
      <div className="relative mb-3 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notices by title or category..."
          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5D46]/30 focus:border-[#0B5D46] bg-white"
        />
      </div>

      <AdminCard>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No notices match.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((n) => (
              <div key={n.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {n.isPinned === 1 && <Pin size={13} className="text-amber-500" />}
                    <span className="text-xs font-semibold text-[#116A55] uppercase">{n.category}</span>
                    <span className="text-xs text-gray-400">{formatDate(n.publishedAt)}</span>
                  </div>
                  <p className="font-medium text-gray-900 truncate">{n.title}</p>
                </div>
                <Link
                  href={`/admin/posts/notices/${n.id}/edit`}
                  aria-label={`Edit notice "${n.title}"`}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteNoticeAction} id={n.id} confirmText={`Delete notice "${n.title}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
