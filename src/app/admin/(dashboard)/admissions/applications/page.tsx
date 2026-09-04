import Link from "next/link";
import { getAdmissionApplications } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import ApplicationsTable, { type ApplicationRow } from "@/components/admin/ApplicationsTable";
import { Download } from "lucide-react";

const STATUS_OPTIONS = ["ALL", "RECEIVED", "UNDER_REVIEW", "DOCS_VERIFIED", "SELECTED", "WAITLISTED", "REJECTED"];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = status || "ALL";
  const applications = await getAdmissionApplications(active);

  const rows: ApplicationRow[] = applications.map((a) => {
    let fullName = "";
    try {
      const data = JSON.parse(a.dataJson || "{}") as Record<string, string>;
      fullName = data["full_name"] || "";
    } catch {
      /* ignore */
    }
    return {
      id: a.id,
      applicationNo: a.applicationNo,
      programChoice: a.programChoice,
      submittedAt: a.submittedAt,
      status: a.status,
      fullName,
    };
  });

  return (
    <div>
      <AdminPageHeader
        title="Admission Applications"
        description="Review submitted applications, update status and export data."
        action={
          <a
            href={`/admin/admissions/applications/export${active !== "ALL" ? `?status=${active}` : ""}`}
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={15} /> Export CSV
          </a>
        }
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/admissions/applications" : `/admin/admissions/applications?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              active === s ? "bg-[#0B5D46] text-white border-[#0B5D46]" : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <ApplicationsTable applications={rows} />
    </div>
  );
}
