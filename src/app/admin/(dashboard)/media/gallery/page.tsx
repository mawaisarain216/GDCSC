import Image from "next/image";
import { getGalleryImages } from "@/lib/repo";
import {
  AdminCard,
  AdminPageHeader,
  DeleteButton,
} from "@/components/admin/ui";
import { deleteGalleryImageAction } from "../../actions";
import { CheckCircle2, XCircle } from "lucide-react";
import GalleryUploadForm from "./GalleryUploadForm";

export default async function GalleryAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const images = await getGalleryImages();

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Upload and organize campus photos shown in the public gallery."
      />

      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Image added.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-5">
          <XCircle size={16} /> Please choose an image file.
        </div>
      )}

      <AdminCard className="p-5 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Add Image</h2>

        <GalleryUploadForm />
      </AdminCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative rounded-xl overflow-hidden bg-white border border-gray-200 group"
          >
            <div className="aspect-square relative bg-gray-100">
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 truncate">
                {img.category}
              </span>

              <DeleteButton
                action={deleteGalleryImageAction}
                id={img.id}
                confirmText="Delete this image?"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}