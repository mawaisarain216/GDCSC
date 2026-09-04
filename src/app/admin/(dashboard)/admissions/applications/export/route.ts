import { NextResponse } from "next/server";
import { getAdmissionApplications, getAdmissionFormFields, getAdmissionProgramById } from "@/lib/repo";
import { getSession } from "@/lib/auth";

function csvCell(value: string): string {
  const v = value ?? "";
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

/**
 * Admin-only CSV export of admission applications — for registrars who need
 * the data in a spreadsheet (merit lists, physical record-keeping, sharing
 * with the admission committee). middleware.ts already blocks unauthenticated
 * requests under /admin/*, but this checks the session directly too, the
 * same defense-in-depth pattern used by every mutating admin server action.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const applications = await getAdmissionApplications(status);
  const fields = await getAdmissionFormFields();

  const header = ["Application No", "Status", "Program", "Rejection Reason", "Submitted At", ...fields.map((f) => f.label)];
  const lines = [header.map(csvCell).join(",")];

  for (const a of applications) {
    let data: Record<string, string> = {};
    try {
      data = JSON.parse(a.dataJson || "{}");
    } catch {
      data = {};
    }
    const program = a.admissionProgramId ? await getAdmissionProgramById(a.admissionProgramId) : undefined;
    const row = [
      a.applicationNo,
      a.status,
      program?.name || a.programChoice,
      a.rejectionReason || "",
      a.submittedAt,
      ...fields.map((f) => data[f.fieldKey] || ""),
    ];
    lines.push(row.map(csvCell).join(","));
  }

  const csv = lines.join("\r\n");
  const filename = `admission-applications-${status || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
