import { isAdminUser } from "@/lib/auth/constants";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server";
import AccessDenied from "@/components/admin/AccessDenied";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminPageShell({ children }) {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !isAdminUser(user)) {
    return <AccessDenied />;
  }

  if (isAdminUser(user)) {
    return children;
  }

  return <LoginForm />;
}
