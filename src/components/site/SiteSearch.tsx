"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, FileText, Newspaper, Building2, GraduationCap, Users, File } from "lucide-react";

export interface SearchItem {
  title: string;
  url: string;
  type: "Page" | "Notice" | "News & Events" | "Department" | "Program" | "Faculty";
  meta?: string;
}

const TYPE_ICON: Record<SearchItem["type"], React.ElementType> = {
  Page: File,
  Notice: FileText,
  "News & Events": Newspaper,
  Department: Building2,
  Program: GraduationCap,
  Faculty: Users,
};

export default function SiteSearch({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // slight delay so the panel is mounted before we try to focus it
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((i) => i.title.toLowerCase().includes(q) || i.meta?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [items, query]);

  return (
    <>
      <button
        type="button"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
        className="p-2 rounded-theme hover:bg-white/10 transition-colors"
      >
        <Search size={19} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg bg-surface text-text rounded-theme shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/10">
              <Search size={18} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notices, programs, departments, faculty…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-black/5 text-text-muted">
                <X size={17} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {query.trim() === "" && (
                <p className="px-4 py-6 text-sm text-text-muted text-center">
                  Start typing to search the whole website.
                </p>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <p className="px-4 py-6 text-sm text-text-muted text-center">No results for &ldquo;{query}&rdquo;.</p>
              )}
              {results.map((r) => {
                const Icon = TYPE_ICON[r.type];
                return (
                  <Link
                    key={`${r.type}-${r.url}-${r.title}`}
                    href={r.url}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-bg transition-colors border-b border-black/5 last:border-0"
                  >
                    <span className="w-8 h-8 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium truncate">{r.title}</span>
                      <span className="block text-xs text-text-muted">{r.type}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
