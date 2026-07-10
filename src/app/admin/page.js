import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin | dohee kwak",
  robots: { index: false, follow: false },
};

async function AdminDashboardLoader() {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminDashboard user={user} />;
}

export default async function AdminPage() {
  return (
    <AdminPageShell>
      <AdminDashboardLoader />
    </AdminPageShell>
  );
}
