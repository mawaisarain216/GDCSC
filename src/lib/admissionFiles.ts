export type AdmissionFileKind = "image" | "pdf" | "both";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

export function getAdmissionFileKind(options: string): AdmissionFileKind {
  const raw = (options || "").trim().toLowerCase();
  if (raw.includes("pdf/image") || raw.includes("image/pdf") || raw.includes("both")) return "both";
  if (raw.includes("pdf")) return "pdf";
  return "image";
}

export function getAdmissionAccept(kind: AdmissionFileKind) {
  if (kind === "pdf") return ".pdf,application/pdf";
  if (kind === "both") return "image/jpeg,image/png,image/webp,image/gif,application/pdf";
  return "image/jpeg,image/png,image/webp,image/gif";
}

export function getAdmissionMaxSize(kind: AdmissionFileKind) {
  return kind === "pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
}

export function getAdmissionFileHint(kind: AdmissionFileKind) {
  if (kind === "pdf") return "PDF only · maximum 10MB";
  if (kind === "both") return "PDF or JPG/PNG/WebP/GIF · images 5MB, PDF 10MB";
  return "JPG, PNG, WebP or GIF · maximum 5MB";
}

export function isAllowedAdmissionBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".public.blob.vercel-storage.com") || url.hostname.endsWith(".private.blob.vercel-storage.com")) &&
      url.pathname.startsWith("/admissions/")
    );
  } catch {
    return false;
  }
}

export function isAdmissionFileUrlForKind(value: string, kind: AdmissionFileKind) {
  if (!isAllowedAdmissionBlobUrl(value)) return false;
  const path = new URL(value).pathname.toLowerCase();
  const isPdf = path.endsWith(".pdf");
  const isImage = /\.(jpe?g|png|webp|gif)$/.test(path);
  if (kind === "pdf") return isPdf;
  if (kind === "image") return isImage;
  return isPdf || isImage;
}

export const ADMISSION_MAX_FIELD_LENGTH = 500;
