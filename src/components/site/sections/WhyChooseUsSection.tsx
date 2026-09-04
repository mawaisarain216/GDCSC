import { BadgeCheck, BookOpenCheck, FlaskConical, HandCoins, Landmark, Users2 } from "lucide-react";
import SectionHeading from "../SectionHeading";
import { getSettings } from "@/lib/repo";

const FEATURES = [
  {
    icon: HandCoins,
    title: "No Admission Fee",
    desc: "A government institution with merit-based, tuition-free admission — quality education without financial barriers.",
  },
  {
    icon: Landmark,
    title: "Government Recognized",
    desc: "Operating under the Directorate General of Colleges, Sindh, with a recognized affiliation and syllabus.",
  },
  {
    icon: Users2,
    title: "Qualified Faculty",
    desc: "Experienced, dedicated teaching staff committed to student success across every faculty.",
  },
  {
    icon: FlaskConical,
    title: "Science Labs & Library",
    desc: "Well-equipped laboratories and a college library supporting Pre-Medical and Pre-Engineering students.",
  },
  {
    icon: BookOpenCheck,
    title: "Multiple Faculties",
    desc: "Pre-Medical, Pre-Engineering, Arts and Commerce programs under one roof, at Intermediate and Degree level.",
  },
  {
    icon: BadgeCheck,
    title: "Merit-Based Selection",
    desc: "Transparent, marks-based admission process with published merit lists — fair to every applicant.",
  },
];

export default async function WhyChooseUsSection() {
  const settings = await getSettings();
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading eyebrow="Why Choose Us" title={`Why Students Choose ${settings.shortName}`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card-surface hover-lift reveal-up border border-black/5 p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="w-12 h-12 rounded-theme bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon size={22} />
              </span>
              <h3 className="font-heading font-semibold text-text mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
