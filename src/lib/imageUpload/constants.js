export const IMAGE_UPLOAD_MAX_SIZE_MB = 2.5;
export const IMAGE_UPLOAD_MAX_DIMENSION = 2400;
export const IMAGE_UPLOAD_WEBP_QUALITY = 0.9;
export const IMAGE_UPLOAD_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "high";
