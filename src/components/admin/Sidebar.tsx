"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { NAV_GROUPS } from "./navConfig";
import { logout } from "@/app/admin/(auth)/login/actions";

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-[#073F30] text-white px-4 py-3">
        <span className="flex items-center gap-2 font-semibold text-sm">
          <GraduationCap size={18} /> Admin Panel
        </span>
        <button onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`bg-[#073F30] text-white w-64 shrink-0 flex-col fixed lg:static inset-y-0 left-0 z-40 lg:flex ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="hidden lg:flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <GraduationCap size={18} />
          </span>
          <div>
            <p className="font-heading font-bold text-sm leading-tight">GBDC Shahpur Chakar</p>
            <p className="text-[11px] text-white/50">Admin Panel</p>
          </div>
        </div>

        {nav}

        <div className="border-t border-white/10 p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink size={16} /> View Website
          </a>
          <div className="px-3 py-2 text-xs text-white/40 truncate">Signed in as {userName}</div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-white transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
