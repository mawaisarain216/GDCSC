import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { getGalleryImages } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category || "All";
  const allImages = await getGalleryImages();
  const categories = ["All", ...Array.from(new Set(allImages.map((i) => i.category)))];
  const images = await getGalleryImages(active);

  return (
    <>
      <PageHero title="Campus Gallery" subtitle="A glimpse of campus life, events and facilities." />
      <section className="section-y">
        <div className="container-site">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <Link
                key={c}
                href={c === "All" ? "/gallery" : `/gallery?category=${encodeURIComponent(c)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active === c ? "bg-primary text-white border-primary" : "border-black/10 text-text-muted hover:border-primary/40"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          {images.length === 0 ? (
            <p className="text-text-muted">No images in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="aspect-square rounded-theme overflow-hidden bg-primary/10 relative group">
                  {img.url ? (
                    <Image src={img.url} alt={img.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <ImageIcon size={28} />
                    </div>
                  )}
                  {img.caption && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
