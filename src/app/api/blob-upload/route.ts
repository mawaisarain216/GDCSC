import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdminSession } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024;

const IMAGE_PREFIXES = [
  "admin/branding/",
  "admin/principal/",
  "admin/gallery/",
  "admin/departments/",
  "admin/faculty/",
  "admin/slides/",
  "admin/news/",
];

const FILE_PREFIXES = ["admin/notices/", "admin/documents/"];

function isAllowedPath(pathname: string) {
  return [...IMAGE_PREFIXES, ...FILE_PREFIXES].some((prefix) =>
    pathname.startsWith(prefix)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    // The initial token request must be authenticated. Vercel Blob may call
    // this same route later as a server-to-server upload-completion callback,
    // which does not carry the browser's admin session cookie.
    if (body.type !== "blob.upload-completed") {
      await requireAdminSession();
    }

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isAllowedPath(pathname)) {
          throw new Error("This upload destination is not allowed.");
        }

        let kind: "image" | "file" = "image";
        if (clientPayload) {
          try {
            const parsed = JSON.parse(clientPayload) as { kind?: string };
            if (parsed.kind === "file") kind = "file";
          } catch {
            throw new Error("Invalid upload request.");
          }
        }

        const isImagePath = IMAGE_PREFIXES.some((prefix) =>
          pathname.startsWith(prefix)
        );
        const isFilePath = FILE_PREFIXES.some((prefix) =>
          pathname.startsWith(prefix)
        );

        if ((kind === "image" && !isImagePath) || (kind === "file" && !isFilePath)) {
          throw new Error("Invalid upload destination.");
        }

        const allowedContentTypes = isImagePath
          ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
          : pathname.startsWith("admin/documents/")
            ? ["application/pdf"]
            : ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];

        return {
          allowedContentTypes,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ admin: true }),
        };
      },
      onUploadCompleted: async () => {
        // The database URL is saved by the form action after the client
        // receives the completed Blob URL. No database write is needed here.
      },
    });

    return Response.json(response);
  } catch (error) {
    console.error("Admin Blob upload handler error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Blob upload authorization failed.",
      },
      { status: 400 }
    );
  }
}
