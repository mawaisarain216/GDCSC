import { notFound } from "next/navigation";
import Image from "next/image";
import { getAdmissionApplicationById, getAdmissionFormFields } from "@/lib/repo";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { ADMISSION_STATUS_TRANSITIONS } from "@/lib/admissionWorkflow";
import ApplicationStatusPanel from "@/components/admin/ApplicationStatusPanel";
import { formatDate } from "@/lib/format";
import { UserRound, AlertTriangle, CheckCircle2 } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  FACULTY: "Choice of Faculty",
  EDUCATIONAL: "Educational Details",
  PERSONAL: "Personal Details",
  DOCUMENTS: "Documents & Declaration",
};

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-transition": "That status change isn't a valid next step from where this application currently is.",
  "reason-required": "A reason is required to reject an application.",
};

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { id } = await params;
  const { error, updated } = await searchParams;
  const application = await getAdmissionApplicationById(id);
  if (!application) notFound();

  const fields = await getAdmissionFormFields();
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(application.dataJson || "{}");
  } catch {
    data = {};
  }

  const sections = ["FACULTY", "EDUCATIONAL", "PERSONAL"];
  const allowedNext = ADMISSION_STATUS_TRANSITIONS[application.status] || [];

  return (
    <div>
      <AdminPageHeader title={`Application ${application.applicationNo}`} description={`Submitted ${formatDate(application.submittedAt)}`} />

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-5">
          <AlertTriangle size={16} /> {ERROR_MESSAGES[error] || "Something went wrong."}
        </div>
      )}
      {updated && !error && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Status updated.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionFields = fields.filter((f) => f.section === section);
            if (!sectionFields.length) return null;
            return (
              <AdminCard key={section} className="p-5">
                <h2 className="font-semibold text-gray-900 mb-4 text-sm">{SECTION_LABELS[section]}</h2>
                <dl className="grid sm:grid-cols-2 gap-4">
                  {sectionFields.map((f) => (
                    <div key={f.id}>
                      <dt className="text-xs text-gray-400">{f.label}</dt>
                      <dd className="text-sm text-gray-900 font-medium">{data[f.fieldKey] || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </AdminCard>
            );
          })}
        </div>

        <div className="space-y-6">
          <AdminCard className="p-5 text-center">
            <div className="w-28 h-36 rounded-lg bg-gray-100 mx-auto relative overflow-hidden flex items-center justify-center mb-3">
              {application.photoUrl ? (
                <Image src={application.photoUrl} alt="Applicant" fill className="object-cover" />
              ) : (
                <UserRound className="text-gray-300" size={32} />
              )}
            </div>
            <p className="text-xs text-gray-400">Applicant Photo</p>
          </AdminCard>

          <AdminCard className="p-5">
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">Application Status</h2>
            <ApplicationStatusPanel
              applicationId={application.id}
              status={application.status}
              rejectionReason={application.rejectionReason}
              allowedNext={allowedNext}
            />
          </AdminCard>

          <AdminCard className="p-5">
            <h2 className="font-semibold text-gray-900 mb-2 text-sm">Program Choice</h2>
            <p className="text-sm text-gray-600">{application.programChoice || "Not specified"}</p>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
