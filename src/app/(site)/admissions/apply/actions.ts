"use server";

import { redirect } from "next/navigation";
import { createAdmissionApplication, getAdmissionFormFields, getOpenAdmissionPrograms } from "@/lib/repo";
import { saveUploadedFile } from "@/lib/upload";
import { nowIso } from "@/lib/db";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";

export async function submitApplication(formData: FormData) {
  // Honeypot — a hidden field real applicants never see or fill in. Bots
  // that auto-fill every input on the page trip this; we quietly bounce
  // them back without creating a record or revealing the check exists.
  if (((formData.get("company_website") as string) || "").trim()) {
    redirect("/admissions/apply");
  }

  const ip = await getClientIp();
  const { limited } = await checkFormRateLimit("admission-apply", ip);
  if (limited) {
    redirect("/admissions/apply?limited=1");
  }
  await recordFormAttempt("admission-apply", ip);

  // Server-side gate — never trust the client. If nothing is open by the
  // time this submits (e.g. an admin closed admissions while the form was
  // open in the visitor's browser), bounce back to the apply page, which
  // will render the "Admissions Closed" state instead of accepting data.
  const openPrograms = await getOpenAdmissionPrograms();
  if (openPrograms.length === 0) {
    redirect("/admissions/apply");
  }

  const fields = await getAdmissionFormFields(true);
  const data: Record<string, string> = {};

  for (const field of fields) {
    if (field.fieldType === "file") continue;
    if (field.fieldType === "checkbox") {
      data[field.fieldKey] = formData.get(field.fieldKey) ? "Yes" : "No";
      continue;
    }
    const value = formData.get(field.fieldKey);
    data[field.fieldKey] = typeof value === "string" ? value : "";
  }

  const photoFile = formData.get("photo") as File | null;
  const photoUrl = (await saveUploadedFile(photoFile, "admissions/photos")) || "";

  const programChoice = (formData.get("programChoice") as string) || data["faculty"] || "";

  // Reject a submission for a faculty that isn't currently open/seated —
  // guards against a stale form or a tampered request choosing a closed one.
  // The matching program record's id is stored as the real link (source of
  // truth); programChoice stays as a readable label alongside it.
  const matchedProgram = openPrograms.find((p) => p.faculty === programChoice);
  if (programChoice && !matchedProgram) {
    redirect("/admissions/apply");
  }

  const applicationNo = await createAdmissionApplication({
    programChoice,
    admissionProgramId: matchedProgram?.id || "",
    dataJson: JSON.stringify(data),
    photoUrl,
    status: "RECEIVED",
    submittedAt: nowIso(),
  });

  redirect(`/admissions/apply/success?ref=${encodeURIComponent(applicationNo)}`);
}
