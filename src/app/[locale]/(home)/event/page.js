import EventList from "@/components/event/EventList";
import { getEvents } from "@/lib/data/event";

export default async function EventPage({ params }) {
  const { locale } = await params;
  const events = await getEvents(locale);

  return <EventList events={events} locale={locale} />;
}
