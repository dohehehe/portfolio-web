import { isAdminUser } from "@/lib/auth/constants";
import { apiError, supabaseError } from "@/lib/api/errors";
import {
  createSupabaseAuthServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import {
  IMAGE_UPLOAD_BUCKET,
  IMAGE_UPLOAD_MAX_SIZE_MB,
} from "@/lib/imageUpload/constants";

const BUCKET = IMAGE_UPLOAD_BUCKET;
const MAX_FILE_SIZE_BYTES = IMAGE_UPLOAD_MAX_SIZE_MB * 1024 * 1024;

function buildStoragePath(file) {
  const extension = file.name?.includes(".")
    ? file.name.split(".").pop()
    : (file.type?.split("/")[1] ?? "webp");

  return `images/${crypto.randomUUID()}.${extension}`;
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseAuthServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAdminUser(user)) {
      return apiError("Unauthorized.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return apiError("file is required.", 400);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return apiError(
        `Image must be ${IMAGE_UPLOAD_MAX_SIZE_MB}MB or smaller.`,
        400,
      );
    }

    const filePath = buildStoragePath(file);
    const storageSupabase = createSupabaseServiceRoleClient();

    const { error } = await storageSupabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return supabaseError(error, "Failed to upload image.");
    }

    const { data } = storageSupabase.storage.from(BUCKET).getPublicUrl(filePath);

    return Response.json({ url: data.publicUrl });
  } catch (error) {
    return apiError(error.message, 500);
  }
}
