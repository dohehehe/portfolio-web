import AdminPageShell from "@/components/admin/AdminPageShell";
import ProjectEditForm from "@/components/admin/forms/ProjectEditForm";
import { getProjectEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getProjectEditMetadata();
}

export default async function ProjectEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <ProjectEditForm id={id} />
    </AdminPageShell>
  );
}
