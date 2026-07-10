import AdminPageShell from "@/components/admin/AdminPageShell";
import WorkEditForm from "@/components/admin/forms/WorkEditForm";
import { getWorkEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getWorkEditMetadata();
}

export default async function WorkEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <WorkEditForm id={id} />
    </AdminPageShell>
  );
}
