// Central place for the site's public base URL — used to build absolute
// URLs for robots.txt, sitemap.xml, canonical links and Open Graph tags.
// Set NEXT_PUBLIC_SITE_URL in .env once the site is deployed to its real
// domain; falls back to a placeholder so local/dev builds still work.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://gbdcshahpurchakar.edu.pk").replace(/\/$/, "");
