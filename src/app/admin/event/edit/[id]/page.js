import AdminPageShell from "@/components/admin/AdminPageShell";
import EventEditForm from "@/components/admin/forms/EventEditForm";
import { getEventEditMetadata } from "@/lib/admin/pageMetadata";

export async function generateMetadata() {
  return getEventEditMetadata();
}

export default async function EventEditPage({ params }) {
  const { id } = await params;

  return (
    <AdminPageShell>
      <EventEditForm id={id} />
    </AdminPageShell>
  );
}
