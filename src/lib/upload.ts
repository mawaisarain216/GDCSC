import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];
const DEFAULT_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"];

function slugifyFilename(name: string) {
  const ext = path.extname(name);
  const base = path.basename(name, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base || "file"}${ext.toLowerCase()}`;
}

function sniffSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case ".png":
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    case ".gif":
      return buffer.toString("ascii", 0, 4) === "GIF8";
    case ".webp":
      return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
    case ".pdf":
      return buffer.toString("ascii", 0, 4) === "%PDF";
    case ".svg":
      return buffer.toString("utf-8", 0, Math.min(buffer.length, 2000)).toLowerCase().includes("<svg");
    default:
      return false;
  }
}

function sanitizeSvg(buffer: Buffer): Buffer {
  let text = buffer.toString("utf-8");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "");
  text = text.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");
  text = text.replace(/javascript:/gi, "");
  return Buffer.from(text, "utf-8");
}

export interface UploadOptions {
  maxSizeBytes?: number;
  allowedMimePrefixes?: string[];
}

/**
 * Uses Vercel Blob in production so uploads survive serverless deployments.
 * Local development keeps the original filesystem behavior when a Blob token
 * is not present.
 */
export async function saveUploadedFile(
  file: File | null | undefined,
  subdir = "misc",
  opts: UploadOptions = {}
): Promise<string | null> {
  if (!file || typeof file === "string" || !("arrayBuffer" in file) || file.size === 0) return null;

  const maxSize = opts.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  if (file.size > maxSize) {
    console.warn(`[upload] Rejected "${file.name}" — ${file.size} bytes exceeds the ${maxSize} byte limit.`);
    return null;
  }

  const allowedPrefixes = opts.allowedMimePrefixes ?? DEFAULT_ALLOWED_MIME_PREFIXES;
  const mimeOk = !!file.type && allowedPrefixes.some((p) => file.type.startsWith(p));
  const ext = path.extname(file.name || "").toLowerCase();
  const extOk = DEFAULT_ALLOWED_EXTENSIONS.includes(ext);
  if (!mimeOk || !extOk) {
    console.warn(`[upload] Rejected "${file.name}" — type "${file.type}" is not an accepted image or PDF.`);
    return null;
  }

  let buffer = Buffer.from(await file.arrayBuffer());
  if (!sniffSignature(buffer, ext)) {
    console.warn(`[upload] Rejected "${file.name}" — file contents don't match a valid ${ext} file.`);
    return null;
  }
 if (ext === ".svg") {
  const sanitized = sanitizeSvg(buffer);
  buffer = Buffer.from(sanitized);
}

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugifyFilename(file.name || "file")}`;
  const blobPath = `uploads/${subdir}/${filename}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Make a real ArrayBuffer copy so this remains compatible with the
    // stricter Buffer/ArrayBuffer typings used by recent Node + Blob packages.
    const arrayBuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(arrayBuffer).set(buffer);
    const blobBody = new Blob([arrayBuffer]);
    const blob = await put(blobPath, blobBody, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(UPLOAD_ROOT, subdir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${subdir}/${filename}`;
}
