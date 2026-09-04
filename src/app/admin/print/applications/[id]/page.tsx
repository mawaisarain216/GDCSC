import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getAdmissionApplicationById,
  getAdmissionFormFields,
  getAdmissionProgramById,
  getSettings,
} from "@/lib/repo";
import { formatDate } from "@/lib/format";
import { UserRound } from "lucide-react";
import PrintButton from "@/components/admin/PrintButton";

const SECTION_LABELS: Record<string, string> = {
  FACULTY: "Choice of Faculty",
  EDUCATIONAL: "Educational Details",
  PERSONAL: "Personal Details",
};

export default async function ApplicationPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;
  const application = await getAdmissionApplicationById(id);
  if (!application) notFound();

  const settings = await getSettings();
  const fields = await getAdmissionFormFields();
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(application.dataJson || "{}");
  } catch {
    data = {};
  }
  const program = application.admissionProgramId ? await getAdmissionProgramById(application.admissionProgramId) : undefined;

  if (type === "gate-pass") {
    return (
      <div className="min-h-screen bg-gray-100 print:bg-white py-10 print:py-0">
        <PrintButton />
        <div className="max-w-md mx-auto bg-white border-2 border-gray-900 rounded-xl p-7 print:border print:rounded-none print:shadow-none shadow-lg">
          <div className="text-center mb-5 pb-4 border-b border-dashed border-gray-300">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Government of Sindh</p>
            <h1 className="font-bold text-lg text-gray-900 mt-0.5">{settings.siteName}</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">{settings.address}</p>
            <p className="mt-3 inline-block bg-gray-900 text-white text-xs font-bold tracking-wide px-3 py-1 rounded-full">
              ADMISSION GATE PASS
            </p>
          </div>

          {application.status !== "SELECTED" ? (
            <p className="text-sm text-center text-gray-500 py-8">
              A gate pass is issued only once an applicant has been marked <strong>Selected</strong>. This
              application&apos;s current status is <strong>{application.status.replace("_", " ")}</strong>.
            </p>
          ) : (
            <>
              <div className="flex gap-4 mb-5">
                <div className="w-20 h-24 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                  {application.photoUrl ? (
                    <Image src={application.photoUrl} alt="Applicant" fill className="object-cover" />
                  ) : (
                    <UserRound className="text-gray-300" size={26} />
                  )}
                </div>
                <div className="text-sm space-y-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">{data["full_name"] || "—"}</p>
                  <p className="text-gray-500 text-xs">S/o {data["father_name"] || "—"}</p>
                  <p className="text-gray-700">
                    <span className="text-gray-400 text-xs">App. No.: </span>
                    {application.applicationNo}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-400 text-xs">Program: </span>
                    {program?.name || application.programChoice} ({application.programChoice})
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                The bearer of this pass has been <strong>selected</strong> for admission. This pass permits entry to
                college premises for document verification / test / interview as scheduled by the college. Please
                carry original CNIC/B-Form and all original educational documents along with this pass.
              </p>

              <div className="flex items-end justify-between text-xs text-gray-600">
                <div>
                  <p className="mb-8">Issued: {formatDate(application.reviewedAt || application.submittedAt)}</p>
                  <div className="w-32 border-t border-gray-400 pt-1">Verifying Officer</div>
                </div>
                <div className="text-right">
                  <p className="mb-8">&nbsp;</p>
                  <div className="w-32 border-t border-gray-400 pt-1">Principal&apos;s Signature &amp; Stamp</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const sections = ["FACULTY", "EDUCATIONAL", "PERSONAL"];

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white py-10 print:py-0">
      <PrintButton />
      <div className="max-w-3xl mx-auto bg-white print:shadow-none shadow-lg p-8 print:p-0 text-sm">
        <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Government of Sindh — Directorate General of Colleges</p>
            <h1 className="font-bold text-xl text-gray-900 mt-0.5">{settings.siteName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{settings.address}</p>
            <h2 className="font-semibold text-gray-800 mt-3">Online Admission Application Form</h2>
            <p className="text-xs text-gray-500 mt-1">
              Application No: <strong className="text-gray-900">{application.applicationNo}</strong> · Submitted:{" "}
              {formatDate(application.submittedAt)} · Status:{" "}
              <strong className="text-gray-900">{application.status.replace("_", " ")}</strong>
            </p>
          </div>
          <div className="w-24 h-28 rounded bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
            {application.photoUrl ? (
              <Image src={application.photoUrl} alt="Applicant" fill className="object-cover" />
            ) : (
              <UserRound className="text-gray-300" size={28} />
            )}
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5">
          Program Choice: <strong className="text-gray-900">{program?.name || "—"}</strong> — Faculty:{" "}
          <strong className="text-gray-900">{application.programChoice || "—"}</strong>
        </p>

        {sections.map((section) => {
          const sectionFields = fields.filter((f) => f.section === section);
          if (!sectionFields.length) return null;
          return (
            <div key={section} className="mb-5 break-inside-avoid">
              <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide border-b border-gray-200 pb-1.5 mb-2.5">
                {SECTION_LABELS[section]}
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                {sectionFields.map((f) => (
                  <div key={f.id} className="flex justify-between border-b border-dotted border-gray-200 pb-1">
                    <dt className="text-gray-500">{f.label}</dt>
                    <dd className="text-gray-900 font-medium text-right">{data[f.fieldKey] || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}

        {application.status === "REJECTED" && application.rejectionReason && (
          <div className="mb-5 text-xs bg-red-50 border border-red-200 rounded p-3 text-red-700">
            <strong>Reason for rejection:</strong> {application.rejectionReason}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-700 border-t border-gray-200 pt-4">
          <p>
            I hereby declare that the information provided above is true to the best of my knowledge. I understand
            that this is a government institution and no admission or tuition fee is charged for enrollment.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-8 text-xs text-gray-600 break-inside-avoid">
          <div>
            <div className="border-t border-gray-400 pt-1">Applicant&apos;s Signature</div>
          </div>
          <div>
            <div className="border-t border-gray-400 pt-1">Verified By (Admission Committee)</div>
          </div>
          <div>
            <div className="border-t border-gray-400 pt-1">Principal&apos;s Signature &amp; Stamp</div>
          </div>
        </div>
      </div>
    </div>
  );
}
