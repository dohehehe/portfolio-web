import AdminPageShell from "@/components/admin/AdminPageShell";
import EventCreateForm from "@/components/admin/forms/EventCreateForm";
import { getEventCreateMetadata } from "@/lib/admin/pageMetadata";

export const metadata = getEventCreateMetadata();

export default function EventCreatePage() {
  return (
    <AdminPageShell>
      <EventCreateForm />
    </AdminPageShell>
  );
}
