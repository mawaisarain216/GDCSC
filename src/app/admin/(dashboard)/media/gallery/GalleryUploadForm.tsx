"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";
import {
  fileInputClass,
  inputClass,
  labelClass,
  SubmitButton,
} from "@/components/admin/ui";
import { createGalleryImageAction } from "../../actions";
import { Loader2, XCircle } from "lucide-react";

export default function GalleryUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (uploading) return;

    setError("");

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem(
      "image"
    ) as HTMLInputElement | null;

    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Please choose an image file.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const blob = await upload(
        `gallery/${Date.now()}-${file.name}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
        }
      );

      const formData = new FormData();

      formData.append("url", blob.url);

      const categoryInput = form.elements.namedItem(
        "category"
      ) as HTMLInputElement | null;

      const captionInput = form.elements.namedItem(
        "caption"
      ) as HTMLInputElement | null;

      formData.append(
        "category",
        categoryInput?.value || "Campus"
      );

      formData.append(
        "caption",
        captionInput?.value || ""
      );

      const result = await createGalleryImageAction(formData);

      if (!result?.success) {
        throw new Error(
          result?.error || "Failed to save image."
        );
      }

      window.location.href =
        "/admin/media/gallery?saved=1";
    } catch (err) {
      console.error("Gallery upload failed:", err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid sm:grid-cols-4 gap-4 items-end"
    >
      <div className="sm:col-span-2">
        <label className={labelClass}>Image File</label>

        <input
          type="file"
          name="image"
          accept="image/*"
          required
          disabled={uploading}
          className={fileInputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>

        <input
          name="category"
          defaultValue="Campus"
          disabled={uploading}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Caption</label>

        <input
          name="caption"
          disabled={uploading}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-4">
        <SubmitButton>
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2
                size={16}
                className="animate-spin"
              />
              Uploading...
            </span>
          ) : (
            "Upload"
          )}
        </SubmitButton>
      </div>

      {error && (
        <div className="sm:col-span-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          <XCircle size={16} />
          {error}
        </div>
      )}
    </form>
  );
}