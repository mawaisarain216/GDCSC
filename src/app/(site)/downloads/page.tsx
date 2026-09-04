import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getDocuments } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Downloads" };

export default async function DownloadsPage() {
  const documents = await getDocuments();
  const categories = Array.from(new Set(documents.map((d) => d.category)));

  return (
    <>
      <PageHero title="Downloads" subtitle="Prospectus, forms, syllabi and important documents." />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-10">
          {documents.length === 0 && <p className="text-text-muted">No documents uploaded yet.</p>}
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="font-heading font-bold text-lg mb-4">{cat}</h2>
              <div className="divide-y divide-black/5 border border-black/5 rounded-theme overflow-hidden">
                {documents
                  .filter((d) => d.category === cat)
                  .map((d) => (
                    <a
                      key={d.id}
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-surface hover:bg-bg/60 transition-colors"
                    >
                      <span className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text truncate">{d.title}</p>
                        <p className="text-xs text-text-muted">{formatDate(d.uploadedAt)}</p>
                      </div>
                      <Download size={17} className="text-primary shrink-0" />
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
