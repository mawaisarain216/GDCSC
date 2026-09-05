import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkFormRateLimit, getClientIp, recordFormAttempt } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024;
const PATH_PREFIX = "admissions/photos/";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const isCompletion = body.type === "blob.upload-completed";

    let ip = "";
    if (!isCompletion) {
      ip = await getClientIp();

      const { limited } = await checkFormRateLimit("admission-upload", ip);

      if (limited) {
        return Response.json(
          { error: "Too many photo upload attempts. Please try again later." },
          { status: 429 }
        );
      }
    }

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(PATH_PREFIX)) {
          throw new Error("Invalid admission photo destination.");
        }

        await recordFormAttempt("admission-upload", ip);

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // The database URL is saved by the form action after the client
        // receives the completed Blob URL. No database write is needed here.
      },
    });

    return Response.json(response);
  } catch (error) {
    console.error("Admission Blob upload handler error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Photo upload authorization failed.",
      },
      { status: 400 }
    );
  }
}
