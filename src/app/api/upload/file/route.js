import { requireAdmin } from "@/lib/api/requireAdmin";
import { apiError, supabaseError } from "@/lib/api/errors";
import {
  FILE_UPLOAD_BUCKET,
  FILE_UPLOAD_MAX_SIZE_MB,
} from "@/lib/fileUpload/constants";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const MAX_SIZE_BYTES = FILE_UPLOAD_MAX_SIZE_MB * 1024 * 1024;

function buildStoragePath(file) {
  const extension = file.name?.includes(".")
    ? file.name.split(".").pop()
    : "pdf";

  return `files/${crypto.randomUUID()}.${extension}`;
}

export async function POST(request) {
  try {
    const { response: unauthorized } = await requireAdmin();

    if (unauthorized) {
      return unauthorized;
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return apiError("file is required.", 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return apiError(
        `File size must be ${FILE_UPLOAD_MAX_SIZE_MB}MB or less.`,
        400,
      );
    }

    const filePath = buildStoragePath(file);
    const storageSupabase = createSupabaseServiceRoleClient();

    const { error } = await storageSupabase.storage
      .from(FILE_UPLOAD_BUCKET)
      .upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return supabaseError(error, "Failed to upload file.");
    }

    const { data } = storageSupabase.storage
      .from(FILE_UPLOAD_BUCKET)
      .getPublicUrl(filePath);

    return Response.json({ url: data.publicUrl });
  } catch (error) {
    return apiError(error.message, 500);
  }
}
