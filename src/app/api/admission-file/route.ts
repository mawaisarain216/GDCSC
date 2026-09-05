import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getAdmissionApplicationByNo } from "@/lib/repo";
import { verifyAdmissionPrintToken } from "@/lib/admissionPrint";

function isPrivateAdmissionUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".private.blob.vercel-storage.com") && url.pathname.startsWith("/admissions/");
  } catch { return false; }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") || "";
  if (!isPrivateAdmissionUrl(url)) return new NextResponse("Not found", { status: 404 });

  const applicationRef = request.nextUrl.searchParams.get("ref") || "";
  const token = request.nextUrl.searchParams.get("token") || "";
  let authorized = false;

  try {
    await requireAdminSession();
    authorized = true;
  } catch {
    if (applicationRef && token) {
      const application = await getAdmissionApplicationByNo(applicationRef);
      if (application) {
        try {
          const data = JSON.parse(application.dataJson || "{}");
          authorized = await verifyAdmissionPrintToken(token, application.applicationNo, data.cnic_bform || "");
          if (authorized) {
            const ownedFiles = [application.photoUrl, ...Object.values(data)].filter((value): value is string => typeof value === "string" && value.startsWith("https://"));
            authorized = ownedFiles.includes(url);
          }
        } catch { authorized = false; }
      }
    }
  }

  if (!authorized) return new NextResponse("Not found", { status: 404 });

  const tokenValue = process.env.ADMISSION_BLOB_READ_WRITE_TOKEN;
  if (!tokenValue) return new NextResponse("Storage unavailable", { status: 503 });
  const pathname = new URL(url).pathname.replace(/^\//, "");
  const result = await get(pathname, { access: "private", token: tokenValue });
  if (!result || result.statusCode !== 200) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "Content-Disposition": result.blob.contentDisposition || "inline",
    },
  });
}
