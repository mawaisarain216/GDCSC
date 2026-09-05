"use server";

import { redirect } from "next/navigation";
import { createAdmissionApplication, getAdmissionFormFields, getOpenAdmissionPrograms } from "@/lib/repo";
import { nowIso } from "@/lib/db";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";
import { createAdmissionPrintToken } from "@/lib/admissionPrint";
import { getAdmissionFileKind, isAdmissionFileUrlForKind, ADMISSION_MAX_FIELD_LENGTH } from "@/lib/admissionFiles";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, ADMISSION_MAX_FIELD_LENGTH) : "";
}

export async function submitApplication(formData: FormData) {
  if (clean(formData.get("company_website"))) redirect("/admissions/apply");

  const ip = await getClientIp();
  const { limited } = await checkFormRateLimit("admission-apply", ip);
  if (limited) redirect("/admissions/apply?limited=1");
  await recordFormAttempt("admission-apply", ip);

  const openPrograms = await getOpenAdmissionPrograms();
  if (openPrograms.length === 0) redirect("/admissions/apply");

  const fields = await getAdmissionFormFields(true);
  const data: Record<string, string> = {};

  for (const field of fields) {
    if (field.fieldType === "file") {
      const url = clean(formData.get(`${field.fieldKey}__url`));
      if (field.required === 1 && (!url || !isAdmissionFileUrlForKind(url, getAdmissionFileKind(field.options)))) {
        redirect("/admissions/apply");
      }
      if (url && !isAdmissionFileUrlForKind(url, getAdmissionFileKind(field.options))) redirect("/admissions/apply");
      if (url) data[field.fieldKey] = url;
      continue;
    }
    if (field.fieldType === "checkbox") {
      data[field.fieldKey] = formData.get(field.fieldKey) ? "Yes" : "No";
      continue;
    }
    const value = clean(formData.get(field.fieldKey));
    if (field.required === 1 && !value) redirect("/admissions/apply");
    data[field.fieldKey] = value;
  }

  const photoUrl = clean(formData.get("photoUrl"));
  if (!photoUrl || !isAdmissionFileUrlForKind(photoUrl, "image")) redirect("/admissions/apply");

  const email = data["email"];
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/admissions/apply");

  const declaration = clean(formData.get("declaration"));
  if (!declaration) redirect("/admissions/apply");

  const programChoice = data["faculty"] || clean(formData.get("programChoice"));
  const matchedProgram = openPrograms.find((p) => p.faculty === programChoice);
  if (programChoice && !matchedProgram) redirect("/admissions/apply");

  const applicationNo = await createAdmissionApplication({
    programChoice,
    admissionProgramId: matchedProgram?.id || "",
    dataJson: JSON.stringify(data),
    photoUrl,
    status: "RECEIVED",
    submittedAt: nowIso(),
  });

  const printToken = await createAdmissionPrintToken(applicationNo, data["cnic_bform"] || "");
  redirect(`/admissions/apply/success?ref=${encodeURIComponent(applicationNo)}&print=${encodeURIComponent(printToken)}`);
}
