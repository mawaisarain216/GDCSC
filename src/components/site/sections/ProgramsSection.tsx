import Link from "next/link";
import { ArrowRight, Atom, Calculator, Landmark, Laptop } from "lucide-react";
import { getDepartments } from "@/lib/repo";
import SectionHeading from "../SectionHeading";

const ICONS: Record<string, React.ElementType> = {
  science: Atom,
  arts: Landmark,
  commerce: Calculator,
  "computer-science": Laptop,
};

export default async function ProgramsSection() {
  const departments = await getDepartments();

  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading eyebrow="Academics" title="Faculties & Programs Offered" subtitle="Choose from Intermediate and Degree programs across four established faculties." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((d) => {
            const Icon = ICONS[d.slug] || Atom;
            return (
              <Link
                key={d.id}
                href={`/departments/${d.slug}`}
                className="group card-surface p-6 border border-black/5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col"
              >
                <span className="w-12 h-12 rounded-theme bg-primary text-white flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-[#2b2205] transition-colors">
                  <Icon size={22} />
                </span>
                <h3 className="font-heading font-semibold text-lg text-text mb-1.5">{d.name}</h3>
                <p className="text-sm text-text-muted line-clamp-3 flex-1">{d.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-4">
                  View Details <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
