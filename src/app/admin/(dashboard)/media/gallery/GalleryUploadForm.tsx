"use client";

import { useState } from "react";
import { createGalleryImageAction } from "../../actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { inputClass, labelClass } from "@/components/admin/ui";
import { Loader2, XCircle } from "lucide-react";

export default function GalleryUploadForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSaving(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const result = await createGalleryImageAction(formData);

      if (!result?.success) {
        throw new Error(result?.error || "Failed to save image.");
      }

      window.location.href = "/admin/media/gallery?saved=1";
    } catch (err) {
      console.error("Gallery save failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-4 items-end">
      <div className="sm:col-span-4">
        <ImageUploadField
          name="url"
          folder="gallery"
          label="Image File"
          required
          description="Recommended square image: 800 × 800 px."
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <input name="category" defaultValue="Campus" disabled={saving} className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Caption</label>
        <input name="caption" disabled={saving} className={inputClass} />
      </div>

      <div className="sm:col-span-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "Saving..." : "Upload"}
        </button>
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
