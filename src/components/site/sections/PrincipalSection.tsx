import { sanitizeHtml } from "@/lib/sanitizeHtml";
import Image from "next/image";
import { Quote } from "lucide-react";
import { getContent } from "@/lib/repo";

export default async function PrincipalSection() {
  const name = await getContent("principal.name", "Prof. (Sample Name)");
  const photo = await getContent("principal.photoUrl", "");
  const message = await getContent("principal.message", "");

  return (
    <section className="section-y bg-surface">
      <div className="container-site grid md:grid-cols-[280px_1fr] gap-10 items-center">
        <div className="mx-auto md:mx-0">
          <div className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden ring-8 ring-primary/10 bg-primary/10 relative">
            {photo ? (
              <Image src={photo} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-heading font-bold text-primary/40">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <p className="text-center md:text-left mt-4 font-heading font-semibold text-text">{name}</p>
          <p className="text-center md:text-left text-sm text-text-muted">Principal</p>
        </div>

        <div>
          <Quote className="text-accent mb-3" size={36} />
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Principal&apos;s Message
          </span>
          <div
            className="prose-content text-text text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(message) }}
          />
        </div>
      </div>
    </section>
  );
}
