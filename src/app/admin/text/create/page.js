import AdminPageShell from "@/components/admin/AdminPageShell";
import TextCreateForm from "@/components/admin/forms/TextCreateForm";
import { getTextCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getTextCreateMetadata();

export default function TextCreatePage() {
  return (
    <AdminPageShell>
      <TextCreateForm />
    </AdminPageShell>
  );
}
