import { notFound } from "next/navigation";
import { getAdmissionApplicationByNo, getAdmissionFormFields, getAdmissionProgramById, getSettings } from "@/lib/repo";
import { verifyAdmissionPrintToken } from "@/lib/admissionPrint";
import { formatDate } from "@/lib/format";
import { UserRound } from "lucide-react";
import PrintButton from "@/components/admin/PrintButton";

const SECTION_LABELS: Record<string, string> = {
  FACULTY: "Choice of Faculty",
  EDUCATIONAL: "Educational Details",
  PERSONAL: "Personal Details",
  DOCUMENTS: "Documents & Declaration",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicAdmissionPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; token?: string }>;
}) {
  const { ref = "", token = "" } = await searchParams;
  if (!ref || !token) notFound();

  const application = await getAdmissionApplicationByNo(ref);
  if (!application) notFound();

  let data: Record<string, string> = {};
  try { data = JSON.parse(application.dataJson || "{}"); } catch { data = {}; }
  const cnic = data["cnic_bform"] || "";
  if (!cnic || !(await verifyAdmissionPrintToken(token, ref, cnic))) notFound();

  const settings = await getSettings();
  const fields = await getAdmissionFormFields();
  const program = application.admissionProgramId ? await getAdmissionProgramById(application.admissionProgramId) : undefined;
  const sections = ["FACULTY", "EDUCATIONAL", "PERSONAL", "DOCUMENTS"];

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0">
      <div className="max-w-4xl mx-auto mb-4 flex justify-end print:hidden"><PrintButton label="Print Application" /></div>
      <main className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none p-8 print:p-0 text-sm">
        <header className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Government of Sindh — Directorate General of Colleges</p>
            <h1 className="font-bold text-xl text-gray-900 mt-1">{settings.siteName}</h1>
            <p className="text-xs text-gray-500 mt-1">{settings.address}</p>
            <h2 className="font-semibold text-gray-800 mt-4">Admission Application Form</h2>
            <p className="text-xs text-gray-500 mt-1">Application No: <strong className="text-gray-900">{application.applicationNo}</strong> · Submitted: {formatDate(application.submittedAt)}</p>
          </div>
          <div className="w-28 h-32 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {application.photoUrl ? <img src={application.photoUrl.includes(".private.blob.vercel-storage.com") ? `/api/admission-file?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(token)}&url=${encodeURIComponent(application.photoUrl)}` : application.photoUrl} alt="Applicant" className="w-full h-full object-cover" /> : <UserRound className="text-gray-300" size={30} />}
          </div>
        </header>

        <p className="text-xs text-gray-700 mb-6">Program: <strong>{program?.name || "—"}</strong> · Faculty: <strong>{application.programChoice || "—"}</strong></p>

        {sections.map((section) => {
          const sectionFields = fields.filter((f) => f.section === section);
          if (!sectionFields.length) return null;
          return (
            <section key={section} className="mb-6 break-inside-avoid">
              <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide border-b border-gray-200 pb-1.5 mb-3">{SECTION_LABELS[section]}</h3>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2">
                {sectionFields.map((field) => {
                  const value = data[field.fieldKey] || "";
                  if (field.fieldType === "file") {
                    return <div key={field.id} className="flex items-center justify-between gap-4 border-b border-dotted border-gray-200 pb-1"><dt className="text-gray-500">{field.label}</dt><dd className="text-gray-900 font-medium">{value ? <a className="underline" href={`/api/admission-file?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(token)}&url=${encodeURIComponent(value)}`}>View attached file</a> : "Not attached"}</dd></div>;
                  }
                  return <div key={field.id} className="flex justify-between gap-4 border-b border-dotted border-gray-200 pb-1"><dt className="text-gray-500">{field.label}</dt><dd className="text-gray-900 font-medium text-right break-words">{value || "—"}</dd></div>;
                })}
              </dl>
            </section>
          );
        })}

        <div className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-700">
          <p>I hereby declare that the information provided above is true to the best of my knowledge. I understand that this is a government institution and no admission or tuition fee is charged for enrollment.</p>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-8 text-xs text-gray-600 break-inside-avoid">
          <div className="border-t border-gray-400 pt-1">Applicant&apos;s Signature</div>
          <div className="border-t border-gray-400 pt-1">Verified By (Admission Committee)</div>
          <div className="border-t border-gray-400 pt-1">Principal&apos;s Signature &amp; Stamp</div>
        </div>
      </main>
    </div>
  );
}
