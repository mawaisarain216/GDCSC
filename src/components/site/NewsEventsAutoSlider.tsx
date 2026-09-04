"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsEvent } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function NewsEventsAutoSlider({ items }: { items: NewsEvent[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (items.length === 0) {
    return (
      <div className="card-surface border border-black/5 p-6 h-full flex items-center justify-center">
        <p className="text-sm text-text-muted">No news or events published yet.</p>
      </div>
    );
  }

  const item = items[index];

  return (
    <div
      className="card-surface border border-black/5 overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link href={`/news-events/${item.slug}`} className="block group">
        <div className="aspect-[16/9] bg-primary/10 relative overflow-hidden">
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/30">
              <Calendar size={40} />
            </div>
          )}
          <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide bg-accent text-[#2b2205] px-2.5 py-1 rounded-full">
            {item.type === "EVENT" ? "Event" : "News"}
          </span>
        </div>
        <div className="p-5 sm:p-6 flex-1">
          <p className="text-xs text-text-muted mb-1.5">{formatDate(item.eventDate || item.publishedAt)}</p>
          <h3 className="font-heading font-semibold text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
        </div>
      </Link>

      <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-black/5 bg-bg/40 mt-auto">
        <div className="flex items-center gap-1.5">
          {items.map((n, i) => (
            <button
              key={n.id}
              type="button"
              aria-label={`Show item ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-1.5 bg-black/15 hover:bg-black/25"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous item"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="p-1.5 rounded-theme hover:bg-black/5 text-text-muted"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next item"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="p-1.5 rounded-theme hover:bg-black/5 text-text-muted"
          >
            <ChevronRight size={16} />
          </button>
          <Link href="/news-events" className="text-xs font-semibold text-primary ml-2 hover:underline whitespace-nowrap">
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}
