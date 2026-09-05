"use client";

import { upload } from "@vercel/blob/client";
import { Loader2, UserRound } from "lucide-react";
import { useRef, useState } from "react";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function safeFilename(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "photo";
}

export default function PhotoUploadField({ required }: { required?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, WebP or GIF image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size <= 0 || file.size > MAX_SIZE) {
      setError("Photo must be between 1 byte and 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setPhotoUrl("");
    setUploading(true);

    try {
      const blob = await upload(
        `admissions/photos/${Date.now()}-${safeFilename(file.name)}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admission-upload",
        }
      );

      setPhotoUrl(blob.url);
    } catch (err) {
      console.error("Admission photo upload failed:", err);
      setError("Photo upload failed. Please choose the photo again.");
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setPhotoUrl("");
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-24 h-24 rounded-theme bg-bg border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <UserRound className="text-primary/30" size={32} />
        )}
      </div>

      <div className="min-w-0">
        <label className="block text-sm font-medium text-text mb-1">
          Passport-size Photograph {required && <span className="text-red-500">*</span>}
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required={false}
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
          className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-theme file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium hover:file:opacity-90 cursor-pointer"
        />

        <p className="text-xs text-text-muted mt-1">JPG, PNG, WebP or GIF · maximum 5 MB.</p>

        {uploading && (
          <p className="inline-flex items-center gap-1.5 text-xs text-primary mt-2">
            <Loader2 size={14} className="animate-spin" />
            Uploading photo...
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 mt-2" role="alert">
            {error}
          </p>
        )}
      </div>

      <input type="hidden" name="photoUrl" value={photoUrl} required={required} readOnly />
    </div>
  );
}
