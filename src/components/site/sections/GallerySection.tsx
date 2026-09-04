import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { getGalleryImages } from "@/lib/repo";
import SectionHeading from "../SectionHeading";

export default async function GallerySection() {
  const images = (await getGalleryImages()).slice(0, 8);

  return (
    <section className="section-y bg-surface">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <SectionHeading eyebrow="Campus Life" title="Campus Gallery" align="left" />
          <Link href="/gallery" className="btn btn-outline shrink-0">
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>

        {images.length === 0 ? (
          <p className="text-text-muted text-sm">No gallery images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`relative rounded-theme overflow-hidden bg-primary/10 group ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
              >
                {img.url ? (
                  <Image src={img.url} alt={img.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30">
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
