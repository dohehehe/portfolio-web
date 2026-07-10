export const IMAGE_UPLOAD_MAX_SIZE_MB = 1.8;
export const IMAGE_UPLOAD_MAX_DIMENSION = 2000;
export const IMAGE_UPLOAD_WEBP_QUALITY = 0.85;
export const IMAGE_UPLOAD_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "high";
