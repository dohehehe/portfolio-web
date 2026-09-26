import { requireAdmin } from "@/lib/api/requireAdmin";
import { apiError, supabaseError } from "@/lib/api/errors";
import { IMAGE_UPLOAD_BUCKET } from "@/lib/imageUpload/constants";
import { parseImageStoragePathFromUrl } from "@/lib/imageUpload/storagePath";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

function buildStoragePath(file) {
  const extension = file.name?.includes(".")
    ? file.name.split(".").pop()
    : (file.type?.split("/")[1] ?? "webp");

  return `images/${crypto.randomUUID()}.${extension}`;
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

    if (!file.type?.startsWith("image/")) {
      return apiError("Only image files are allowed.", 400);
    }

    const filePath = buildStoragePath(file);
    const storageSupabase = createSupabaseServiceRoleClient();

    const { error } = await storageSupabase.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return supabaseError(error, "Failed to upload image.");
    }

    const { data } = storageSupabase.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .getPublicUrl(filePath);

    return Response.json({ url: data.publicUrl });
  } catch (error) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(request) {
  try {
    const { response: unauthorized } = await requireAdmin();

    if (unauthorized) {
      return unauthorized;
    }

    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return apiError("url is required.", 400);
    }

    const filePath = parseImageStoragePathFromUrl(url);

    if (!filePath) {
      return Response.json({ success: true, skipped: true });
    }

    const storageSupabase = createSupabaseServiceRoleClient();

    const { error } = await storageSupabase.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .remove([filePath]);

    if (error) {
      return supabaseError(error, "Failed to delete image.");
    }

    return Response.json({ success: true });
  } catch (error) {
    return apiError(error.message, 500);
  }
}
