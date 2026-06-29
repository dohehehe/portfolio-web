import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/event";

export default async function EventDetailPage({ params }) {
  const { locale, id } = await params;
  const event = await getEventById(id, locale);

  if (!event) {
    notFound();
  }

  return (
    <article>
      <h1>{event.title || "Untitled"}</h1>
      {event.date ? <p>{event.date}</p> : null}
      {event.space ? <p>{event.space}</p> : null}
    </article>
  );
}
