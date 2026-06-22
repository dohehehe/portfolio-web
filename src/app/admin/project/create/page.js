import AdminPageShell from "@/components/admin/AdminPageShell";
import ProjectCreateForm from "@/components/admin/forms/ProjectCreateForm";
import { getProjectCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getProjectCreateMetadata();

export default function ProjectCreatePage() {
  return (
    <AdminPageShell>
      <ProjectCreateForm />
    </AdminPageShell>
  );
}
