export const IMAGE_UPLOAD_MAX_DIMENSION = 3200;

export const IMAGE_UPLOAD_MAX_BYTES = 800 * 1024;

export const IMAGE_UPLOAD_MIN_QUALITY = 80;
export const IMAGE_UPLOAD_MAX_QUALITY = 100;

export const IMAGE_UPLOAD_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "high";

export const IMAGE_UPLOAD_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
