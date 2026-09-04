import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NotFoundContent from "@/components/site/NotFoundContent";

// This root-level not-found.tsx handles fully unmatched URLs (paths that
// don't fall under any known route at all). Because it lives outside the
// (site) route group, it isn't automatically wrapped by that group's
// layout — so Header/Footer are rendered here explicitly to keep the 404
// visually consistent with the rest of the site. The (site)/not-found.tsx
// sibling handles notFound() calls thrown from within site routes (e.g. an
// invalid department slug) and already inherits Header/Footer from its
// group layout.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
