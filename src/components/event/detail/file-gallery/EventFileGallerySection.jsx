import { getProjectsAndWorksByEventId } from "@/lib/data/cv";
import { getEventById } from "@/lib/data/event";
import { getTextsByEventId } from "@/lib/data/text";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import EventSidebar from "../sidebar/EventSidebar";
import EventFileGallery from "./EventFileGallery.client";

function hasFileGalleryData({ items, content, credit, texts, works }) {
  return (
    items.length > 0 ||
    normalizeBlocks(content).length > 0 ||
    normalizeBlocks(credit).length > 0 ||
    texts.length > 0 ||
    works.length > 0
  );
}

export default async function EventFileGallerySection({ id, locale }) {
  const [event, texts, works] = await Promise.all([
    getEventById(id, locale),
    getTextsByEventId(id, locale),
    getProjectsAndWorksByEventId(id, locale),
  ]);

  if (!event) {
    return null;
  }

  const items = normalizeGalleryItems(event.file_link, locale);

  if (
    !hasFileGalleryData({
      items,
      content: event.content,
      credit: event.credit,
      texts,
      works,
    })
  ) {
    return null;
  }

  const sidebar = (
    <EventSidebar
      content={event.content}
      credit={event.credit}
      texts={texts}
      works={works}
      locale={locale}
    />
  );

  return <EventFileGallery items={items} sidebar={sidebar} />;
}
