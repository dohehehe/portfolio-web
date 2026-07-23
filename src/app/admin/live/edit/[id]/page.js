import AdminPageShell from "@/components/admin/AdminPageShell";
import LiveEditForm from "@/components/admin/forms/LiveEditForm";
import { getLiveEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getLiveEditMetadata();
}

export default async function LiveEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <LiveEditForm id={id} />
    </AdminPageShell>
  );
}
