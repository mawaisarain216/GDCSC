import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getNewsEventBySlug } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { formatDate } from "@/lib/format";

function plainText(html: string, max = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsEventBySlug(slug);
  if (!item) return { title: "Not Found" };

  const description = plainText(item.body);
  return {
    title: item.title,
    description,
    openGraph: {
      type: "article",
      title: item.title,
      description,
      images: item.coverImageUrl ? [{ url: item.coverImageUrl }] : undefined,
      publishedTime: item.publishedAt,
    },
    twitter: {
      card: item.coverImageUrl ? "summary_large_image" : "summary",
      title: item.title,
      description,
    },
  };
}

export default async function NewsEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsEventBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero title={item.title} subtitle={formatDate(item.eventDate || item.publishedAt)} />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          {item.coverImageUrl && (
            <div className="aspect-[16/9] relative rounded-theme overflow-hidden mb-8 bg-primary/10">
              <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" />
            </div>
          )}
          <div className="prose-content text-text" dangerouslySetInnerHTML={{ __html: item.body }} />
        </div>
      </section>
    </>
  );
}
