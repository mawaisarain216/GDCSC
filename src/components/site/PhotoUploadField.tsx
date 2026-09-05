"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";
import { Loader2, UserRound, UploadCloud, XCircle, CheckCircle2 } from "lucide-react";

export default function PhotoUploadField({ required }: { required?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
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
    setPreview(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a JPG, PNG, WebP or GIF image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setUploading(true);

    try {
      const blob = await upload(`admissions/photos/${Date.now()}-${file.name}`, file, {
        access: "private",
        handleUploadUrl: "/api/admission-upload",
      });
      setUrl(blob.url);
    } catch (err) {
      console.error("Admission photo upload failed:", err);
      setError(err instanceof Error ? err.message : "Photo upload failed. Please try again.");
      setUrl("");
      setFileName("");
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-theme border border-black/10 bg-surface p-5" data-admission-uploading={uploading ? "true" : "false"}>
      <input type="hidden" name="photoUrl" value={url} />
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="w-32 h-32 rounded-theme bg-bg border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Passport photo preview" className="w-full h-full object-cover" />
          ) : (
            <UserRound className="text-primary/30" size={38} />
          )}
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-semibold text-text mb-1">
            Passport-size Photograph {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-xs text-text-muted mb-3">Recent passport-size photo · JPG, PNG, WebP or GIF · maximum 5MB.</p>
          <label className="inline-flex items-center gap-2 cursor-pointer btn btn-outline text-sm py-2 px-3">
            <UploadCloud size={16} /> {uploading ? "Uploading..." : "Choose Photo"}
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required={required && !url}
              disabled={uploading}
              onChange={handleChange}
              className="sr-only"
            />
          </label>
          {uploading && <p className="mt-2 text-xs text-primary flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Uploading securely…</p>}
          {fileName && !uploading && url && <p className="mt-2 text-xs text-green-700 flex items-center gap-1"><CheckCircle2 size={14} /> {fileName} uploaded</p>}
          {error && <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><XCircle size={14} /> {error}</p>}
        </div>
      </div>
    </div>
  );
}
