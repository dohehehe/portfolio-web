import AdminPageShell from "@/components/admin/AdminPageShell";
import LiveCreateForm from "@/components/admin/forms/LiveCreateForm";
import { getLiveCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getLiveCreateMetadata();

export default function LiveCreatePage() {
  return (
    <AdminPageShell>
      <LiveCreateForm />
    </AdminPageShell>
  );
}
