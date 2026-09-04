"use server";

import { requireAdminSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function uploadPrincipalPhotoAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("principalPhoto") as File | null;
  const url = await saveUploadedFile(file, "principal");

  if (!url) {
    return { error: "Please choose a valid image file." };
  }

  return { url };
}
