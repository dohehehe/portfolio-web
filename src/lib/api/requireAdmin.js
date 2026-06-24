import { isAdminUser } from "@/lib/auth/constants";
import { apiError } from "@/lib/api/errors";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();

  if (!user) {
    return { user: null, response: apiError("Unauthorized.", 401) };
  }

  return { user, response: null };
}
