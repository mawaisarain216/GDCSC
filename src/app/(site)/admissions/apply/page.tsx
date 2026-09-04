import type { Metadata } from "next";
import Link from "next/link";
import { getAdmissionFormFields, getOpenAdmissionPrograms } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import AdmissionFieldInput from "@/components/site/AdmissionFieldInput";
import PhotoUploadField from "@/components/site/PhotoUploadField";
import { submitApplication } from "./actions";
import { GraduationCap, IdCard, ListChecks, Paperclip, ClipboardX, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Online Admission Form" };

const SECTION_META: Record<string, { title: string; icon: React.ElementType; note?: string }> = {
  FACULTY: { title: "Choice of Faculty", icon: GraduationCap },
  EDUCATIONAL: { title: "Educational Details", icon: ListChecks },
  PERSONAL: { title: "Personal Details", icon: IdCard },
  DOCUMENTS: { title: "Documents & Declaration", icon: Paperclip },
};

const SECTION_ORDER = ["FACULTY", "EDUCATIONAL", "PERSONAL", "DOCUMENTS"];

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const limited = params.limited === "1";
  const openPrograms = await getOpenAdmissionPrograms();
  const admissionOpen = openPrograms.length > 0;

  if (!admissionOpen) {
    return (
      <>
        <PageHero
          title="Online Admission Form"
          subtitle="Govt. Boys Degree College Shahpur Chakar — no admission fee, merit-based selection."
        />
        <section className="section-y">
          <div className="container-site max-w-xl">
            <div className="card-surface border border-black/5 p-8 text-center">
              <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <ClipboardX size={26} />
              </span>
              <h2 className="font-heading font-bold text-lg mb-2">Admissions Are Currently Closed</h2>
              <p className="text-text-muted text-sm mb-6">
                There are no programs with announced seats open for admission right now. The online form will
                open automatically here as soon as the college announces seats for a new session — please check
                our notices in the meantime.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/notices" className="btn btn-outline">
                  View Notices
                </Link>
                <Link href="/admissions" className="btn btn-solid">
                  Back to Admissions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const fields = await getAdmissionFormFields(true);
  const openFaculties = [...new Set(openPrograms.map((p) => p.faculty))];
  const grouped = SECTION_ORDER.map((key) => ({
    key,
    meta: SECTION_META[key],
    fields: fields.filter((f) => f.section === key),
  })).filter((g) => g.fields.length > 0 || g.key === "DOCUMENTS");

  return (
    <>
      <PageHero
        title="Online Admission Form"
        subtitle="Govt. Boys Degree College Shahpur Chakar — no admission fee, merit-based selection. Fields marked * are required."
      />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          {limited && (
            <div className="mb-6 flex items-start gap-2.5 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-theme p-4">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>Too many submissions have come from this connection in a short time. Please wait a few minutes and try again.</span>
            </div>
          )}
          <form action={submitApplication} className="space-y-10">
            {/* Honeypot — hidden from real applicants via CSS; bots that auto-fill every field trip this. */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />
            {grouped.map((group) => {
              const Icon = group.meta.icon;
              return (
                <div key={group.key}>
                  <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2 pb-2 border-b border-black/10">
                    <Icon className="text-primary" size={20} /> {group.meta.title}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                    {group.fields.map((field) => (
                      <div key={field.id} className={field.fieldType === "textarea" || field.fieldType === "radio" ? "sm:col-span-2" : ""}>
                        <AdmissionFieldInput
                          field={field}
                          optionsOverride={field.fieldKey === "faculty" ? openFaculties : undefined}
                        />
                      </div>
                    ))}
                  </div>
                  {group.key === "DOCUMENTS" && (
                    <div className="mt-5">
                      <PhotoUploadField required />
                    </div>
                  )}
                </div>
              );
            })}

            <div className="card-surface border border-black/5 p-5 bg-bg/60">
              <label className="inline-flex items-start gap-2.5 text-sm text-text">
                <input type="checkbox" name="declaration" required className="mt-0.5 accent-[var(--primary)]" />
                <span>
                  I hereby declare that the information provided above is true to the best of my knowledge.
                  I understand that this is a government institution and no admission or tuition fee is
                  charged for enrollment. <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-solid w-full sm:w-auto justify-center px-10">
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
