import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getDepartments, getNewsEvents } from "@/lib/repo";

const STATIC_PATHS = [
  "",
  "/about",
  "/principal-message",
  "/admissions",
  "/admissions/apply",
  "/admissions/status",
  "/departments",
  "/programs",
  "/faculty",
  "/notices",
  "/news-events",
  "/gallery",
  "/downloads",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  const departmentEntries: MetadataRoute.Sitemap = (await getDepartments()).map((d) => ({
    url: `${SITE_URL}/departments/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = (await getNewsEvents()).map((n) => ({
    url: `${SITE_URL}/news-events/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Notices don't have individual detail pages (they live on the /notices
  // list page), so they're represented by that one already-included entry.

  return [...staticEntries, ...departmentEntries, ...newsEntries];
}
