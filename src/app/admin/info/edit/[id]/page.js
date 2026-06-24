import AdminPageShell from "@/components/admin/AdminPageShell";
import InfoEditForm from "@/components/admin/forms/InfoEditForm";
import { getInfoEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getInfoEditMetadata();
}

export default async function InfoEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <InfoEditForm id={id} />
    </AdminPageShell>
  );
}
