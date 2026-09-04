"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Pin, ChevronLeft, ChevronRight } from "lucide-react";
import type { Notice } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function NoticesAutoSlider({ notices }: { notices: Notice[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || notices.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, notices.length]);

  if (notices.length === 0) {
    return (
      <div className="card-surface border border-black/5 p-6 h-full flex items-center justify-center">
        <p className="text-sm text-text-muted">No notices published yet.</p>
      </div>
    );
  }

  const notice = notices[index];

  return (
    <div
      className="card-surface border border-black/5 overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="p-5 sm:p-6 flex-1">
        <div className="flex items-start gap-4">
          <span className="w-11 h-11 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText size={19} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {notice.isPinned === 1 && <Pin size={13} className="text-accent" />}
              <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{notice.category}</span>
              <span className="text-xs text-text-muted">{formatDate(notice.publishedAt)}</span>
            </div>
            <p className="font-medium text-text leading-snug">{notice.title}</p>
            {notice.fileUrl && (
              <a
                href={notice.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary mt-2 inline-block hover:underline"
              >
                Download attachment →
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-black/5 bg-bg/40">
        <div className="flex items-center gap-1.5">
          {notices.map((n, i) => (
            <button
              key={n.id}
              type="button"
              aria-label={`Show notice ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-1.5 bg-black/15 hover:bg-black/25"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous notice"
            onClick={() => setIndex((i) => (i - 1 + notices.length) % notices.length)}
            className="p-1.5 rounded-theme hover:bg-black/5 text-text-muted"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next notice"
            onClick={() => setIndex((i) => (i + 1) % notices.length)}
            className="p-1.5 rounded-theme hover:bg-black/5 text-text-muted"
          >
            <ChevronRight size={16} />
          </button>
          <Link href="/notices" className="text-xs font-semibold text-primary ml-2 hover:underline whitespace-nowrap">
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}
