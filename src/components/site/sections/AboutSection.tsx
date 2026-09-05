import { sanitizeHtml } from "@/lib/sanitizeHtml";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getContent } from "@/lib/repo";

const highlights = [
  "Government-recognized degree college",
  "Science, Arts, Commerce & Computer Science faculties",
  "Experienced, qualified teaching staff",
  "Affordable, merit-based admissions — no hidden fees",
];

export default async function AboutSection() {
  const title = await getContent("home.about.title", "About Our College");
  const body = await getContent("home.about.body", "");

  return (
    <section className="section-y">
      <div className="container-site grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="aspect-[4/3] rounded-theme overflow-hidden bg-primary/10 relative">
            <Image
              src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1200&auto=format&fit=crop"
              alt="College campus"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden sm:block card-surface shadow-xl p-5 border border-black/5">
            <p className="text-3xl font-heading font-extrabold text-primary">1998</p>
            <p className="text-xs text-text-muted">Serving the community</p>
          </div>
        </div>

        <div>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Welcome
          </span>
          <h2 className="font-heading font-bold text-text mb-4">{title}</h2>
          <div
            className="prose-content text-text-muted"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
          />
          <ul className="mt-4 space-y-2.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-text">
                <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-outline mt-6">
            Read Full Story
          </Link>
        </div>
      </div>
    </section>
  );
}
