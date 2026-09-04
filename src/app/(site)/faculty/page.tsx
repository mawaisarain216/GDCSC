import type { Metadata } from "next";
import Image from "next/image";
import { getDepartments, getFaculty } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Faculty & Staff" };

export default async function FacultyPage() {
  const departments = await getDepartments();
  const faculty = await getFaculty();
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <>
      <PageHero title="Faculty & Staff" subtitle="Meet the qualified teaching staff dedicated to student success." />
      <section className="section-y">
        <div className="container-site grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {faculty.map((f) => (
            <div key={f.id} className="card-surface border border-black/5 shadow-sm p-6 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/10 relative overflow-hidden flex items-center justify-center">
                {f.photoUrl ? (
                  <Image src={f.photoUrl} alt={f.name} fill className="object-cover" />
                ) : (
                  <span className="text-primary font-heading font-bold text-2xl">{f.name.charAt(0)}</span>
                )}
              </div>
              <p className="font-heading font-semibold text-text">{f.name}</p>
              <p className="text-xs text-secondary font-medium mt-0.5">{f.designation}</p>
              {f.departmentId && (
                <p className="text-xs text-text-muted mt-1">{deptMap.get(f.departmentId)}</p>
              )}
              {f.qualification && <p className="text-xs text-text-muted mt-2">{f.qualification}</p>}
              {f.email && (
                <p className="flex items-center justify-center gap-1 text-xs text-primary mt-2">
                  <Mail size={12} /> {f.email}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
