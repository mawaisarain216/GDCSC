"use client";

import ImageUploadField from "@/components/admin/ImageUploadField";

export default function PrincipalPhotoUpload({
  initialUrl,
}: {
  initialUrl: string;
}) {
  return (
    <ImageUploadField
      name="principal.photoUrl"
      folder="principal"
      currentUrl={initialUrl}
      label="Principal photo"
      description="Recommended square image: 400 × 400 px."
    />
  );
}
