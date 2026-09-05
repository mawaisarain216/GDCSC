import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const PATH_PREFIX = "admissions/";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const FILE_TYPES = [...IMAGE_TYPES, "application/pdf"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody & { pathname?: string };
    const blobToken = process.env.ADMISSION_BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return Response.json({ error: "Admission document storage is not configured. Please contact the college administrator." }, { status: 503 });
    }
    const pathname = String(body.pathname || "");
    const isCompletion = body.type === "blob.upload-completed";

    if (!pathname.startsWith(PATH_PREFIX) || pathname.includes("..") || pathname.includes("\\")) {
      return Response.json({ error: "Invalid admission upload destination." }, { status: 400 });
    }

    let ip = "";
    if (!isCompletion) {
      const origin = request.headers.get("origin");
      if (origin) {
        try {
          if (new URL(origin).origin !== new URL(request.url).origin) {
            return Response.json({ error: "Invalid upload origin." }, { status: 403 });
          }
        } catch {
          return Response.json({ error: "Invalid upload origin." }, { status: 403 });
        }
      }

      ip = await getClientIp();
      const { limited } = await checkFormRateLimit("admission-upload", ip);
      if (limited) {
        return Response.json({ error: "Too many upload attempts. Please try again later." }, { status: 429 });
      }
    }

    const isPdfPath = pathname.toLowerCase().endsWith(".pdf");
    const isImagePath = /\.(jpe?g|png|webp|gif)$/i.test(pathname);
    if (!isPdfPath && !isImagePath) {
      return Response.json({ error: "Unsupported file type." }, { status: 400 });
    }

    const response = await handleUpload({
      token: blobToken,
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!isCompletion) await recordFormAttempt("admission-upload", ip);
        return {
          allowedContentTypes: isPdfPath ? ["application/pdf"] : IMAGE_TYPES,
          maximumSizeInBytes: isPdfPath ? MAX_PDF_SIZE : MAX_IMAGE_SIZE,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(response);
  } catch (error) {
    console.error("Admission Blob upload handler error:", error);
    return Response.json({ error: error instanceof Error ? error.message : "File upload authorization failed." }, { status: 400 });
  }
}
