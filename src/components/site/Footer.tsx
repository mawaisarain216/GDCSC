import Link from "next/link";
import { getMenu, getSettings, getSocialLinks } from "@/lib/repo";
import { Mail, MapPin, Phone } from "lucide-react";
import SocialIcons from "./SocialIcons";

export default async function Footer() {
  const settings = await getSettings();
  const footerLinks = await getMenu("FOOTER");
  const year = new Date().getFullYear();
  const socialLinks = getSocialLinks(settings).filter((x: any) => x.enabled && x.url && x.showInFooter).sort((a: any,b: any)=>a.order-b.order).slice(0, Math.max(0, settings.footerSocialLimit || 0));

  return (
    <footer className="bg-footer-bg text-footer-text mt-auto border-t-[3px] border-accent">
      <div className="container-site py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white mb-3">{settings.siteName}</h3>
          <p className="text-sm text-footer-text/80 leading-relaxed">{settings.affiliationText}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {socialLinks.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label} title={item.label} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#2b2205] transition-colors">
                <SocialIcons platform={item.platform} size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-3 text-sm tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-footer-text/80">
            {(footerLinks.length
              ? footerLinks
              : [
                  { id: "1", label: "About College", url: "/about" },
                  { id: "2", label: "Admissions", url: "/admissions" },
                  { id: "3", label: "Notices", url: "/notices" },
                  { id: "4", label: "Downloads", url: "/downloads" },
                  { id: "5", label: "Contact Us", url: "/contact" },
                ]
            ).map((l) => (
              <li key={l.id}>
                <Link href={l.url} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-3 text-sm tracking-wide uppercase">Academics</h4>
          <ul className="space-y-2 text-sm text-footer-text/80">
            <li><Link href="/departments" className="hover:text-accent transition-colors">Departments</Link></li>
            <li><Link href="/programs" className="hover:text-accent transition-colors">Degree Programs</Link></li>
            <li><Link href="/faculty" className="hover:text-accent transition-colors">Faculty & Staff</Link></li>
            <li><Link href="/news-events" className="hover:text-accent transition-colors">News & Events</Link></li>
            <li><Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-3 text-sm tracking-wide uppercase">Contact</h4>
          <ul className="space-y-3 text-sm text-footer-text/80">
            <li className="flex items-start gap-2"><MapPin size={16} className="shrink-0 mt-0.5" /> {settings.address}</li>
            {settings.phone && <li className="flex items-center gap-2"><Phone size={15} /> {settings.phone}</li>}
            {settings.email && <li className="flex items-center gap-2"><Mail size={15} /> {settings.email}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-footer-text/70">
          <p>© {year} {settings.siteName}. All rights reserved.</p>
          <p>Government of Sindh — Directorate General of Colleges</p>
        </div>
      </div>
    </footer>
  );
}
