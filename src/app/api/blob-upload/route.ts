import { handleUpload } from "@vercel/blob/client";
import { requireAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdminSession();

    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "image/svg+xml",
        ],
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ admin: true }),
      }),
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload handler error:", error);

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