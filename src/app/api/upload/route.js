import { requireAdmin } from "@/lib/api/requireAdmin";
import { apiError, supabaseError } from "@/lib/api/errors";
import {
  IMAGE_UPLOAD_BUCKET,
  IMAGE_UPLOAD_TYPES,
} from "@/lib/imageUpload/constants";
import { parseImageStoragePathFromUrl } from "@/lib/imageUpload/storagePath";
import { prepareStoredImage } from "@/lib/imageUpload/toWebp";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function buildStoragePath() {
  return `images/${crypto.randomUUID()}.webp`;
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

    if (!IMAGE_UPLOAD_TYPES[file.type]) {
      return apiError(
        "JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.",
        400
      );
    }

    const source = Buffer.from(await file.arrayBuffer());
    const stored = await prepareStoredImage(source);
    const filePath = buildStoragePath();
    const storageSupabase = createSupabaseServiceRoleClient();

    const { error } = await storageSupabase.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .upload(filePath, stored.buffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      return supabaseError(error, "Failed to upload image.");
    }

    const { data } = storageSupabase.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .getPublicUrl(filePath);

    return Response.json({
      url: data.publicUrl,
      width: stored.width,
      height: stored.height,
    });
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
