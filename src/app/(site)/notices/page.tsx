import type { Metadata } from "next";
import { FileText, Pin } from "lucide-react";
import { getNotices } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Notices" };

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <PageHero title="Notices & Announcements" subtitle="All official notices, exam schedules and academic announcements." />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          {notices.length === 0 ? (
            <p className="text-text-muted">No notices published yet.</p>
          ) : (
            <div className="divide-y divide-black/5 border border-black/5 rounded-theme overflow-hidden">
              {notices.map((n) => (
                <div key={n.id} className="flex items-start gap-4 p-5 bg-surface hover:bg-bg/60 transition-colors">
                  <span className="w-11 h-11 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {n.isPinned === 1 && <Pin size={13} className="text-accent" />}
                      <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{n.category}</span>
                      <span className="text-xs text-text-muted">{formatDate(n.publishedAt)}</span>
                    </div>
                    <p className="font-medium text-text">{n.title}</p>
                    {n.body && <p className="text-sm text-text-muted mt-1">{n.body}</p>}
                  </div>
                  {n.fileUrl && (
                    <a
                      href={n.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary shrink-0 hover:underline"
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
