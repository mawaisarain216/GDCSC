import type { Metadata } from "next";
import { getContent } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = { title: "About the College" };

export default async function AboutPage() {
  const body = await getContent("about.page.body", "");

  return (
    <>
      <PageHero title="About the College" subtitle="Our history, mission and commitment to academic excellence." />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          <div className="prose-content text-text" dangerouslySetInnerHTML={{ __html: body }} />

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            <div className="card-surface border border-black/5 p-6">
              <h3 className="font-heading font-semibold mb-2 text-primary">Our Mission</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                To provide accessible, quality higher-secondary and degree education that prepares students
                academically and morally for higher studies and productive careers. (Sample text — edit from
                Admin → Content.)
              </p>
            </div>
            <div className="card-surface border border-black/5 p-6">
              <h3 className="font-heading font-semibold mb-2 text-primary">Our Vision</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                To be recognized as a leading government degree college in the region, known for academic
                excellence, discipline and community service. (Sample text — edit from Admin → Content.)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
