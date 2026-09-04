import Link from "next/link";
import { getSettings, isAdmissionOpen } from "@/lib/repo";

export default async function CtaSection() {
  const settings = await getSettings();
  const admissionOpen = await isAdmissionOpen();

  return (
    <section className="section-y">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-theme bg-primary-dark text-white p-10 md:p-14 text-center">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-heading font-bold mb-3">
              {admissionOpen ? "Admissions Open — " : "Admissions — "}
              {settings.shortName}
            </h2>
            <p className="text-white/80 mb-7">
              {admissionOpen
                ? "Apply online for Intermediate and Degree programs. No admission fee — this is a government institution, merit-based selection only."
                : "Applications are currently closed — no seats are announced open at this time. Check our notices for the next admission announcement."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {admissionOpen ? (
                <Link href="/admissions/apply" className="btn btn-accent">
                  Apply Online
                </Link>
              ) : (
                <Link href="/notices" className="btn btn-accent">
                  View Notices
                </Link>
              )}
              <Link href="/admissions/status" className="btn bg-white/10 hover:bg-white/20 border border-white/20">
                Check Application Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
