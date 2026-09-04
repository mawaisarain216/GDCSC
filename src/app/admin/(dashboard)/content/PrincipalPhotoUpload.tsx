"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadPrincipalPhotoAction } from "./principal-photo-action";

export default function PrincipalPhotoUpload({
  initialUrl,
}: {
  initialUrl: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("principalPhoto", file);

      const result = await uploadPrincipalPhotoAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto() {
    setUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Principal"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImagePlus size={28} />
            </div>
          )}

          {url && (
            <button
              type="button"
              onClick={removePhoto}
              disabled={uploading}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Principal photo
          </label>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#0B5D46] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus size={15} />
                Upload Image
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Recommended size: 400 × 400 px (JPG, PNG, WebP)
          </p>
          <p className="text-xs text-gray-400">
            Selected file will be uploaded and saved automatically.
          </p>

          {error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </div>
      </div>

      <input type="hidden" name="principal.photoUrl" value={url} />
    </div>
  );
}
