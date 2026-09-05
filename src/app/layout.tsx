import type { Metadata } from "next";
import "./globals.css";
import ThemeStyle from "@/components/ThemeStyle";
import { getSettings } from "@/lib/repo";
import { ensureDefaultAdmin } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";

// The application reads Neon-backed settings during rendering, so pages must render at runtime.
// This also prevents Next.js from attempting database-dependent admin/site layouts at build time.
export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.metaTitle || s.siteName;
  const description = s.metaDescription || s.tagline;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${s.shortName}`,
    },
    description,
    icons: { icon: s.faviconUrl || "/favicon.ico" },
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title,
      description,
      locale: "en_US",
      images: s.logoUrl ? [{ url: s.logoUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await ensureDefaultAdmin();
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: s.siteName,
    alternateName: s.shortName,
    description: s.metaDescription || s.tagline,
    url: SITE_URL,
    logo: s.logoUrl ? `${SITE_URL}${s.logoUrl}` : undefined,
    telephone: s.phone || undefined,
    email: s.email || undefined,
    address: s.address ? { "@type": "PostalAddress", streetAddress: s.address } : undefined,
    sameAs: [s.facebookUrl, s.twitterUrl, s.youtubeUrl, s.instagramUrl].filter(Boolean),
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <ThemeStyle />
        {/* Structured data helps search engines understand this is a real
            educational institution — improves how the site appears in results. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-theme focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
