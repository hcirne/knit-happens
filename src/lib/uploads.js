import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Photos are written to UPLOAD_DIR. The database stores only the file name
// (Photo.path), never the image bytes. Files are served by /api/uploads/[filename].
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");

/** Detects the real image type from the first bytes, not from the file name. */
export function detectImageType(buffer) {
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buffer.length > 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

export const CONTENT_TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Saves validated photos and returns their file names. */
export async function savePhotos(photos) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const names = [];
  for (const { buffer, type } of photos) {
    const name = `${crypto.randomUUID()}.${type}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
    names.push(name);
  }
  return names;
}

export async function deletePhotos(names) {
  await Promise.all(names.map((n) => fs.unlink(path.join(UPLOAD_DIR, n)).catch(() => {})));
}

export const photoUrl = (name) => `/api/uploads/${name}`;
