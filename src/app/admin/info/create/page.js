import AdminPageShell from "@/components/admin/AdminPageShell";
import InfoCreateForm from "@/components/admin/forms/InfoCreateForm";
import { getInfoCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getInfoCreateMetadata();

export default function InfoCreatePage() {
  return (
    <AdminPageShell>
      <InfoCreateForm />
    </AdminPageShell>
  );
}
