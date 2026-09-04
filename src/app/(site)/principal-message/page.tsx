import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { getContent } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = { title: "Principal's Message" };

export default async function PrincipalMessagePage() {
  const name = await getContent("principal.name", "Prof. (Sample Name)");
  const photo = await getContent("principal.photoUrl", "");
  const message = await getContent("principal.message", "");

  return (
    <>
      <PageHero title="Principal's Message" />
      <section className="section-y">
        <div className="container-site grid md:grid-cols-[260px_1fr] gap-10 items-start max-w-4xl mx-auto">
          <div className="mx-auto md:mx-0">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-8 ring-primary/10 bg-primary/10 relative">
              {photo ? (
                <Image src={photo} alt={name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-heading font-bold text-primary/40">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <p className="text-center md:text-left mt-4 font-heading font-semibold">{name}</p>
            <p className="text-center md:text-left text-sm text-text-muted">Principal</p>
          </div>
          <div>
            <Quote className="text-accent mb-3" size={36} />
            <div className="prose-content text-text text-lg" dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        </div>
      </section>
    </>
  );
}
