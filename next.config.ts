import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the browser from guessing content types away from what the
  // server declared — blocks a class of stored-file XSS attacks.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Blocks this site from being embedded in an <iframe> on another site
  // (clickjacking protection) — the admin panel especially has no reason
  // to ever be framed.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Only meaningful once the site is served over HTTPS in production, but
  // harmless to send in dev — browsers ignore it over plain HTTP.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
