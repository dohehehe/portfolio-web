import AdminPageShell from "@/components/admin/AdminPageShell";
import CvCreateForm from "@/components/admin/forms/CvCreateForm";
import { getCvCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getCvCreateMetadata();

export default function CvCreatePage() {
  return (
    <AdminPageShell>
      <CvCreateForm />
    </AdminPageShell>
  );
}
