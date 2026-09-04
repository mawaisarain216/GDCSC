"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";

export default function PhotoUploadField({ required }: { required?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-32 rounded-theme bg-bg border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <UserRound className="text-primary/30" size={32} />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Passport-size Photograph {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          required={required}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-theme file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium hover:file:opacity-90 cursor-pointer"
        />
        <p className="text-xs text-text-muted mt-1">JPG or PNG, recent photo, plain background.</p>
      </div>
    </div>
  );
}
