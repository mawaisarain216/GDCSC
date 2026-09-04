import type { Metadata } from "next";
import { getDepartments, getPrograms } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { Clock, GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "Degree Programs" };

export default async function ProgramsPage() {
  const departments = await getDepartments();
  const programs = await getPrograms();

  return (
    <>
      <PageHero title="Degree Programs" subtitle="Intermediate and BS (Hons) programs across all faculties." />
      <section className="section-y">
        <div className="container-site space-y-12">
          {departments.map((dept) => {
            const deptPrograms = programs.filter((p) => p.departmentId === dept.id);
            if (!deptPrograms.length) return null;
            return (
              <div key={dept.id}>
                <h2 className="font-heading font-bold text-xl mb-5 pb-2 border-b-2 border-accent inline-block">
                  {dept.name}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {deptPrograms.map((p) => (
                    <div key={p.id} className="card-surface border border-black/5 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-text">{p.title}</p>
                        <GraduationCap size={18} className="text-primary shrink-0" />
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-secondary font-medium mt-2">
                        <Clock size={13} /> {p.level} · {p.duration}
                      </p>
                      <p className="text-sm text-text-muted mt-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
