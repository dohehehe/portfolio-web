import { isAdminUser } from "@/lib/auth/constants";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin | dohee kwak",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !isAdminUser(user)) {
    return <AccessDenied />;
  }

  if (isAdminUser(user)) {
    return <AdminDashboard user={user} />;
  }

  return <LoginForm />;
}
