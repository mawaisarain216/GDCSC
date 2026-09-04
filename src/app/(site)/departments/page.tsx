import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDepartments } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <>
      <PageHero title="Departments" subtitle="Four established faculties offering Intermediate and Degree level education." />
      <section className="section-y">
        <div className="container-site grid sm:grid-cols-2 gap-6">
          {departments.map((d) => (
            <Link
              key={d.id}
              href={`/departments/${d.slug}`}
              className="card-surface border border-black/5 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col"
            >
              <h3 className="font-heading font-semibold text-xl text-text mb-2">{d.name}</h3>
              {d.headName && <p className="text-sm text-secondary font-medium mb-2">Head: {d.headName}</p>}
              <p className="text-sm text-text-muted flex-1">{d.description}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-4">
                View Department <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
