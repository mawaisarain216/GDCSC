"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ClipboardCheck } from "lucide-react";
import type { MenuNode } from "@/lib/menuTree";
import SiteSearch, { type SearchItem } from "./SiteSearch";

export default function HeaderNav({ tree, searchIndex }: { tree: MenuNode[]; searchIndex: SearchItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden lg:flex items-center gap-0.5">
        {tree.map((item) => (
          <div key={item.id} className="relative group">
            <Link
              href={item.url}
              target={item.openInNewTab ? "_blank" : undefined}
              className="flex items-center gap-1 px-3 py-2 rounded-theme text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {item.label}
              {item.children.length > 0 && (
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              )}
            </Link>
            {item.children.length > 0 && (
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block min-w-[240px] z-40">
                <div className="bg-surface text-text rounded-theme shadow-2xl border border-black/5 overflow-hidden py-1.5 animate-[fadeIn_0.15s_ease-out]">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      target={child.openInNewTab ? "_blank" : undefined}
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary hover:pl-5 transition-all"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/15">
          <SiteSearch items={searchIndex} />
          <Link
            href="/admissions/status"
            title="Check Application Status"
            className="p-2 rounded-theme hover:bg-white/10 transition-colors"
          >
            <ClipboardCheck size={19} />
          </Link>
          <Link href="/admissions/apply" className="btn btn-accent ml-1 !py-2 !px-4 text-sm">
            Apply Now
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-1 lg:hidden shrink-0">
        <SiteSearch items={searchIndex} />
        <button
          aria-label="Toggle menu"
          className="p-2 rounded-theme hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-surface text-text shadow-xl border-t border-black/5 max-h-[80vh] overflow-y-auto">
          <div className="container-site py-3 flex flex-col">
            {tree.map((item) => (
              <div key={item.id} className="border-b border-black/5 last:border-0">
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-medium"
                >
                  {item.label}
                </Link>
                {item.children.length > 0 && (
                  <div className="pl-4 pb-2 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-sm text-text-muted"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/admissions/status"
              onClick={() => setOpen(false)}
              className="btn btn-outline mt-3 justify-center"
            >
              Check Application Status
            </Link>
            <Link
              href="/admissions/apply"
              onClick={() => setOpen(false)}
              className="btn btn-accent mt-2 justify-center"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
