import {
  getMenu,
  getSettings,
  getTheme,
  getDepartments,
  getPrograms,
  getFaculty,
  getNotices,
  getNewsEvents,
  isAdmissionOpen,
  getSocialLinks,
  getHeaderUtilityLinks,
} from "@/lib/repo";
import { buildMenuTree } from "@/lib/menuTree";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import SocialIcons from "./SocialIcons";
import HeaderNav from "./HeaderNav";
import type { SearchItem } from "./SiteSearch";

async function buildSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [
    { title: "Home", url: "/", type: "Page" },
    { title: "About the College", url: "/about", type: "Page" },
    { title: "Principal's Message", url: "/principal-message", type: "Page" },
    { title: "Admissions", url: "/admissions", type: "Page" },
    { title: "Apply Online", url: "/admissions/apply", type: "Page" },
    { title: "Check Application Status", url: "/admissions/status", type: "Page" },
    { title: "Departments", url: "/departments", type: "Page" },
    { title: "Programs", url: "/programs", type: "Page" },
    { title: "Faculty", url: "/faculty", type: "Page" },
    { title: "Notices", url: "/notices", type: "Page" },
    { title: "News & Events", url: "/news-events", type: "Page" },
    { title: "Gallery", url: "/gallery", type: "Page" },
    { title: "Downloads", url: "/downloads", type: "Page" },
    { title: "Contact Us", url: "/contact", type: "Page" },
  ];

  (await getDepartments()).forEach((d) => items.push({ title: d.name, url: `/departments/${d.slug}`, type: "Department", meta: d.description }));
  (await getPrograms()).forEach((p) => items.push({ title: p.title, url: "/programs", type: "Program", meta: p.level }));
  (await getFaculty()).forEach((f) => items.push({ title: f.name, url: "/faculty", type: "Faculty", meta: f.designation }));
  (await getNotices(15)).forEach((n) => items.push({ title: n.title, url: "/notices", type: "Notice", meta: n.category }));
  (await getNewsEvents(undefined, 15)).forEach((n) => items.push({ title: n.title, url: `/news-events/${n.slug}`, type: "News & Events" }));

  return items;
}

export default async function Header() {
  const settings = await getSettings();
  const theme = await getTheme();
  const items = await getMenu("HEADER");
  const tree = buildMenuTree(items);
  const admissionOpen = await isAdmissionOpen();
  const searchIndex = await buildSearchIndex();
  const socialLinks = getSocialLinks(settings).filter((x: any) => x.enabled && x.url && x.showInTopBar).sort((a: any,b: any)=>a.order-b.order).slice(0, Math.max(0, settings.topBarSocialLimit || 0));
  const utilityLinks = getHeaderUtilityLinks(settings).filter((x: any) => x.enabled).sort((a: any,b: any)=>a.order-b.order);

  return (
    <header className={theme.stickyHeader ? "sticky top-0 z-50" : ""}>
      {theme.showTopBar && (
        <div className="hidden md:block bg-primary-dark text-white/90 text-sm">
          <div className="container-site flex items-center justify-between py-1.5">
            <div className="flex items-center gap-5">
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Phone size={13} /> {settings.phone}
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Mail size={13} /> {settings.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {utilityLinks.map((item: any) => (
                item.openInNewTab ? (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1.5">
                    {item.id === "admissions" && admissionOpen && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                    {item.id === "admissions" && admissionOpen ? `${item.label} Open` : item.label}
                  </a>
                ) : (
                  <Link key={item.id} href={item.url} className="hover:underline inline-flex items-center gap-1.5">
                    {item.id === "admissions" && admissionOpen && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                    {item.id === "admissions" && admissionOpen ? `${item.label} Open` : item.label}
                  </Link>
                )
              ))}
              {socialLinks.map((item: any) => (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="hover:text-accent transition-colors">
                  <SocialIcons platform={item.platform} size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-header-bg text-header-text shadow-md border-b-[3px] border-accent">
        <div className="container-site flex items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <span className="relative w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/30 shrink-0">
              <Image
                src={settings.logoUrl || "/uploads/logo.svg"}
                alt={settings.siteName}
                width={44}
                height={44}
                className="object-contain"
              />
            </span>
            <span className="leading-tight min-w-0">
              <span className="block font-heading font-bold text-lg md:text-xl truncate">
                {settings.siteName}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-header-text/80">
                <MapPin size={11} /> {settings.tagline}
              </span>
            </span>
          </Link>

          <HeaderNav tree={tree} searchIndex={searchIndex} />
        </div>
      </div>
    </header>
  );
}
