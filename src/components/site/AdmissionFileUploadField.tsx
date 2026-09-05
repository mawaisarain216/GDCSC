"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";
import { FileCheck2, FileText, Image as ImageIcon, Loader2, UploadCloud, XCircle } from "lucide-react";
import type { AdmissionFormField } from "@/lib/types";
import { getAdmissionAccept, getAdmissionFileHint, getAdmissionFileKind, getAdmissionMaxSize } from "@/lib/admissionFiles";

export default function AdmissionFileUploadField({ field }: { field: AdmissionFormField }) {
  const required = field.required === 1;
  const kind = getAdmissionFileKind(field.options);
  const accept = getAdmissionAccept(kind);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    setUrl("");
    setFileName("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    const allowed = kind === "both" ? isPdf || isImage : kind === "pdf" ? isPdf : isImage;
    if (!allowed) {
      setError(kind === "pdf" ? "Please select a PDF file." : kind === "image" ? "Please select an image file." : "Please select a PDF or image file.");
      event.target.value = "";
      return;
    }
    if (file.size > getAdmissionMaxSize(kind === "both" && isPdf ? "pdf" : kind)) {
      setError(isPdf ? "PDF must be 10MB or smaller." : "Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    if (isImage) setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const folder = isPdf ? "admissions/documents" : "admissions/documents";
      const blob = await upload(`${folder}/${Date.now()}-${file.name}`, file, {
        access: "private",
        handleUploadUrl: "/api/admission-upload",
      });
      setUrl(blob.url);
    } catch (err) {
      console.error("Admission file upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setFileName("");
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="sm:col-span-2 rounded-theme border border-black/10 bg-surface p-4" data-admission-uploading={uploading ? "true" : "false"}>
      <input type="hidden" name={`${field.fieldKey}__url`} value={url} />
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-theme border border-black/10 bg-bg overflow-hidden shrink-0 flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected file preview" className="w-full h-full object-cover" />
          ) : kind === "pdf" ? (
            <FileText className="text-primary/40" size={28} />
          ) : (
            <ImageIcon className="text-primary/40" size={28} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor={field.fieldKey} className="block text-sm font-semibold text-text mb-1">
            {field.label} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-xs text-text-muted mb-3">{getAdmissionFileHint(kind)}</p>
          <label className="inline-flex items-center gap-2 cursor-pointer btn btn-outline text-sm py-2 px-3">
            <UploadCloud size={16} />
            {uploading ? "Uploading..." : "Choose File"}
            <input
              id={field.fieldKey}
              name={field.fieldKey}
              type="file"
              accept={accept}
              required={required && !url}
              disabled={uploading}
              onChange={handleChange}
              className="sr-only"
            />
          </label>
          {uploading && <span className="ml-3 inline-flex items-center gap-1 text-xs text-primary"><Loader2 size={14} className="animate-spin" /> Uploading securely…</span>}
          {fileName && !uploading && url && <p className="mt-2 text-xs text-green-700 flex items-center gap-1"><FileCheck2 size={14} /> {fileName}</p>}
          {error && <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><XCircle size={14} /> {error}</p>}
        </div>
      </div>
    </div>
  );
}
