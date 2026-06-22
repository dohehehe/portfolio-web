import AdminPageShell from "@/components/admin/AdminPageShell";
import CvEditForm from "@/components/admin/forms/CvEditForm";
import { getCvEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getCvEditMetadata();
}

export default async function CvEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <CvEditForm id={id} />
    </AdminPageShell>
  );
}
