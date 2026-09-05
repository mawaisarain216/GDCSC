"use client";

import { upload } from "@vercel/blob/client";
import { FileText, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const FILE_TYPES = ["application/pdf", ...IMAGE_TYPES];

function safeFilename(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "upload";
}

export default function ImageUploadField({
  name,
  folder,
  currentUrl = "",
  label,
  required = false,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  kind = "image",
  description,
}: {
  name: string;
  folder: string;
  currentUrl?: string;
  label: string;
  required?: boolean;
  accept?: string;
  kind?: "image" | "file";
  description?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef("");
  const [url, setUrl] = useState(currentUrl);
  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  async function handleFile(file: File) {
    setError("");

    const allowedTypes = kind === "image" ? IMAGE_TYPES : FILE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      setError(
        kind === "image"
          ? "Please choose JPG, PNG, WebP or GIF."
          : "Please choose a PDF or image file."
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size <= 0 || file.size > MAX_SIZE) {
      setError("File must be between 1 byte and 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = "";
    }

    if (kind === "image") {
      const objectUrl = URL.createObjectURL(file);
      previewRef.current = objectUrl;
      setLocalPreview(objectUrl);
    }

    setFilename(file.name);
    setUploading(true);

    try {
      const blob = await upload(
        `admin/${folder}/${Date.now()}-${safeFilename(file.name)}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
          clientPayload: JSON.stringify({ kind }),
        }
      );

      setUrl(blob.url);
    } catch (err) {
      console.error("Blob upload failed:", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Upload failed. Please try again."
      );
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = "";
      }
      setLocalPreview("");
      setFilename("");
    } finally {
      setUploading(false);
    }
  }

  function removeFile() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = "";
    }
    setLocalPreview("");
    setUrl("");
    setFilename("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const previewUrl = localPreview || url;

  return (
    <div>
      <div className="flex items-start gap-4">
        {kind === "image" ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={`${label} preview`}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus size={28} className="text-gray-400" />
            )}

            {previewUrl && (
              <button
                type="button"
                onClick={removeFile}
                disabled={uploading}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
                title="Remove image"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex flex-col items-center justify-center gap-1 text-gray-500">
            <FileText size={28} />
            <span className="text-[10px]">PDF / IMAGE</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            required={false}
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="block w-full text-sm text-gray-600 cursor-pointer file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#0B5D46] file:text-white file:text-sm file:font-medium file:px-4 file:py-2.5 hover:file:opacity-90 file:transition-opacity"
          />

          {filename && (
            <p className="text-xs text-gray-500 mt-1.5 truncate">
              {uploading ? "Uploading: " : "Selected: "}
              {filename}
            </p>
          )}

          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            Maximum 5 MB. Upload is stored permanently in Vercel Blob.
          </p>

          {uploading && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[#0B5D46] mt-2">
              <Loader2 size={14} className="animate-spin" />
              Uploading...
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        type="hidden"
        name={name}
        value={url}
        required={required}
        readOnly
      />
    </div>
  );
}
