import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileText, HelpCircle, ListChecks } from "lucide-react";
import { getAdmissionPrograms, getDocuments, getNotices, isAdmissionOpen } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admissions" };

const faqs = [
  {
    q: "Is there any admission or tuition fee?",
    a: "No. As a government degree college, admission is merit-based and free of cost — there is no admission fee or tuition fee system.",
  },
  {
    q: "What documents are required?",
    a: "Matric certificate/marksheet, CNIC/B-Form, domicile, recent photographs, and previous school leaving certificate. Full list is shown on the online application form.",
  },
  {
    q: "How is merit decided?",
    a: "Selection is based on marks obtained in the qualifying (Matric) examination as per the seat allocation for each faculty.",
  },
];

export default async function AdmissionsPage() {
  const programs = await getAdmissionPrograms();
  const admissionOpen = await isAdmissionOpen();
  const notices = (await getNotices()).filter((n) => n.category === "Admission").slice(0, 5);
  const prospectus = (await getDocuments("Prospectus"))[0];

  return (
    <>
      <PageHero title="Admissions" subtitle="Merit-based admissions — no admission fee, this is a government institution." />

      <section className="section-y">
        <div className="container-site grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {!admissionOpen && (
              <div className="flex items-start gap-3 rounded-theme border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm">
                  Admissions are currently <strong>closed</strong> — no program has open, announced seats at this
                  time. The online application form will become available again as soon as a new session is
                  announced. Watch the Notices page for updates.
                </p>
              </div>
            )}
            <div>
              <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                <ListChecks className="text-primary" size={22} /> Choice of Faculty & Available Seats
              </h2>
              <div className="overflow-x-auto rounded-theme border border-black/5">
                <table className="w-full text-sm">
                  <thead className="bg-primary text-white text-left">
                    <tr>
                      <th className="p-3 font-semibold">Faculty</th>
                      <th className="p-3 font-semibold">Program</th>
                      <th className="p-3 font-semibold">Seats</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 bg-surface">
                    {programs.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 font-medium">{p.faculty}</td>
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.seats}</td>
                        <td className="p-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              p.isOpen ? "bg-secondary/10 text-secondary" : "bg-black/10 text-text-muted"
                            }`}
                          >
                            {p.isOpen ? "Open" : "Closed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" size={22} /> Eligibility Criteria
              </h2>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>• Passed Matriculation (Class 10) from a recognized Board.</li>
                <li>• Choice of faculty subject to available seats and merit list.</li>
                <li>• Domicile of Sindh (as per government policy) required for local quota.</li>
                <li>• No admission fee — government-funded institution.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                <HelpCircle className="text-primary" size={22} /> Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.q} className="card-surface border border-black/5 p-5">
                    <p className="font-semibold text-text text-sm">{f.q}</p>
                    <p className="text-sm text-text-muted mt-1.5">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface border border-black/5 p-6 bg-primary text-white">
              <h3 className="font-heading font-semibold mb-2">Ready to Apply?</h3>
              {admissionOpen ? (
                <>
                  <p className="text-sm text-white/80 mb-4">
                    Fill out the online admission form — takes about 10 minutes.
                  </p>
                  <Link href="/admissions/apply" className="btn btn-accent w-full justify-center">
                    Apply Online
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-white/80 mb-4">
                    No seats are currently announced open — applications are not being accepted right now.
                  </p>
                  <span className="btn w-full justify-center bg-white/10 border border-white/20 text-white/50 cursor-not-allowed">
                    Applications Closed
                  </span>
                </>
              )}
              <Link
                href="/admissions/status"
                className="btn bg-white/10 hover:bg-white/20 border border-white/20 w-full justify-center mt-3"
              >
                Check Application Status
              </Link>
            </div>

            {prospectus && (
              <a
                href={prospectus.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface border border-black/5 p-5 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <FileText className="text-primary shrink-0" size={26} />
                <div>
                  <p className="font-semibold text-sm">Download Prospectus</p>
                  <p className="text-xs text-text-muted">PDF document</p>
                </div>
              </a>
            )}

            <div className="card-surface border border-black/5 p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">Admission Notices</h3>
              {notices.length === 0 ? (
                <p className="text-xs text-text-muted">No admission notices published yet.</p>
              ) : (
                <ul className="space-y-3">
                  {notices.map((n) => (
                    <li key={n.id} className="text-sm">
                      <p className="font-medium text-text">{n.title}</p>
                      <p className="text-xs text-text-muted">{formatDate(n.publishedAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/notices" className="text-xs font-semibold text-primary mt-3 inline-block hover:underline">
                View all notices →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
