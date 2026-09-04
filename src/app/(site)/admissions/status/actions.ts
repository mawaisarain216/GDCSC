"use server";

import { getAdmissionApplicationByNo } from "@/lib/repo";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";

function normalizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export async function checkStatus(_prevState: unknown, formData: FormData) {
  // Honeypot — a hidden field real visitors never fill in; bots that
  // auto-fill every input on the page trip this and get a generic error.
  if (((formData.get("website") as string) || "").trim()) {
    return { error: "No matching application found. Please double-check your application number and CNIC / B-Form number." };
  }

  const ip = await getClientIp();
  const { limited, minutesRemaining } = await checkFormRateLimit("admission-status", ip);
  if (limited) {
    return { error: `Too many lookups from this connection. Please try again in about ${minutesRemaining} minute(s).` };
  }

  const applicationNo = ((formData.get("applicationNo") as string) || "").trim();
  const cnic = ((formData.get("cnic") as string) || "").trim();

  if (!applicationNo || !cnic) {
    await recordFormAttempt("admission-status", ip);
    return { error: "Please enter both your application number and your CNIC / B-Form number." };
  }

  const application = await getAdmissionApplicationByNo(applicationNo);

  // Application numbers are sequential (GBDCSC-YYYY-NNNN) and therefore
  // guessable — so status/program are never returned on the application
  // number alone. The CNIC / B-Form number the applicant entered on the
  // form itself acts as a second factor only the applicant should know.
  let storedCnic = "";
  if (application) {
    try {
      const data = JSON.parse(application.dataJson || "{}") as Record<string, string>;
      storedCnic = data["cnic_bform"] || "";
    } catch {
      storedCnic = "";
    }
  }

  if (!application || normalizeId(storedCnic) !== normalizeId(cnic)) {
    await recordFormAttempt("admission-status", ip);
    return { error: "No matching application found. Please double-check your application number and CNIC / B-Form number." };
  }

  let fullName = "";
  let fatherName = "";
  try {
    const data = JSON.parse(application.dataJson || "{}") as Record<string, string>;
    fullName = data["full_name"] || "";
    fatherName = data["father_name"] || "";
  } catch {
    /* ignore */
  }

  return {
    result: {
      applicationNo: application.applicationNo,
      status: application.status,
      programChoice: application.programChoice,
      submittedAt: application.submittedAt,
      rejectionReason: application.rejectionReason,
      photoUrl: application.photoUrl,
      fullName,
      fatherName,
    },
  };
}
