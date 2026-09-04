import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { getNewsEvents } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "News & Events" };

export default async function NewsEventsPage() {
  const items = await getNewsEvents();

  return (
    <>
      <PageHero title="News & Events" subtitle="Stay updated with campus activities, events and announcements." />
      <section className="section-y">
        <div className="container-site grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && <p className="text-text-muted">No news or events published yet.</p>}
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/news-events/${item.slug}`}
              className="card-surface border border-black/5 shadow-sm hover:shadow-lg transition-all overflow-hidden group flex flex-col"
            >
              <div className="aspect-[16/10] bg-primary/10 relative overflow-hidden">
                {item.coverImageUrl ? (
                  <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30">
                    <Calendar size={40} />
                  </div>
                )}
                <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide bg-accent text-[#2b2205] px-2.5 py-1 rounded-full">
                  {item.type === "EVENT" ? "Event" : "News"}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-text-muted mb-1.5">{formatDate(item.eventDate || item.publishedAt)}</p>
                <h3 className="font-heading font-semibold text-text line-clamp-2">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
