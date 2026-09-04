import { notFound } from "next/navigation";
import { getDepartmentBySlug, getFaculty, getPrograms } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { GraduationCap, User } from "lucide-react";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);
  if (!department) notFound();

  const programs = (await getPrograms()).filter((p) => p.departmentId === department.id);
  const faculty = (await getFaculty()).filter((f) => f.departmentId === department.id);

  return (
    <>
      <PageHero title={department.name} subtitle={department.headName ? `Head of Department: ${department.headName}` : undefined} />
      <section className="section-y">
        <div className="container-site max-w-4xl">
          <p className="text-text-muted leading-relaxed mb-10">{department.description}</p>

          {programs.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading font-bold mb-5 flex items-center gap-2">
                <GraduationCap className="text-primary" size={22} /> Programs Offered
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {programs.map((p) => (
                  <div key={p.id} className="card-surface border border-black/5 p-5">
                    <p className="font-semibold text-text">{p.title}</p>
                    <p className="text-xs text-secondary font-medium mt-1">{p.level} · {p.duration}</p>
                    <p className="text-sm text-text-muted mt-2">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {faculty.length > 0 && (
            <div>
              <h2 className="font-heading font-bold mb-5 flex items-center gap-2">
                <User className="text-primary" size={22} /> Department Faculty
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {faculty.map((f) => (
                  <div key={f.id} className="card-surface border border-black/5 p-5 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center text-primary font-heading font-bold text-xl">
                      {f.name.charAt(0)}
                    </div>
                    <p className="font-semibold text-sm">{f.name}</p>
                    <p className="text-xs text-text-muted">{f.designation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
