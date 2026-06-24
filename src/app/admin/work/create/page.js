import AdminPageShell from "@/components/admin/AdminPageShell";
import WorkCreateForm from "@/components/admin/forms/WorkCreateForm";
import { getWorkCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getWorkCreateMetadata();

export default function WorkCreatePage() {
  return (
    <AdminPageShell>
      <WorkCreateForm />
    </AdminPageShell>
  );
}
