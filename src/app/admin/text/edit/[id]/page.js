import AdminPageShell from "@/components/admin/AdminPageShell";
import TextEditForm from "@/components/admin/forms/TextEditForm";
import { getTextEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getTextEditMetadata();
}

export default async function TextEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <TextEditForm id={id} />
    </AdminPageShell>
  );
}
