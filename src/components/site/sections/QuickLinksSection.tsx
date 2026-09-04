import Link from "next/link";
import { ClipboardList, GraduationCap, Megaphone, Users } from "lucide-react";

const items = [
  { href: "/admissions", label: "Admissions", desc: "Programs, eligibility & how to apply", icon: ClipboardList },
  { href: "/programs", label: "Programs", desc: "Science, Arts, Commerce & CS", icon: GraduationCap },
  { href: "/notices", label: "Notices", desc: "Latest announcements & deadlines", icon: Megaphone },
  { href: "/faculty", label: "Faculty", desc: "Meet our teaching staff", icon: Users },
];

export default function QuickLinksSection() {
  return (
    <section className="relative -mt-10 md:-mt-14 z-10">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card-surface shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex flex-col gap-3 border border-black/5"
            >
              <span className="w-11 h-11 rounded-theme bg-primary/10 text-primary flex items-center justify-center">
                <Icon size={22} />
              </span>
              <div>
                <p className="font-heading font-semibold text-text">{label}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-snug">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
