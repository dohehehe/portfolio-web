import { notFound } from "next/navigation";
import { barlow } from "@/app/fonts";
import EventGallery from "@/components/event/detail/EventGallery";
import JsonLd from "@/components/seo/JsonLd";
import { getEventById } from "@/lib/data/event";
import {
  buildDetailPageMetadata,
  getEventMetadata,
} from "@/lib/locale/metadata";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import { generateEventDetailStaticParams } from "@/lib/data/staticParams";
import { buildExhibitionEventJsonLd } from "@/lib/structured-data/buildJsonLd";
import styles from "@/components/event/detail/EventDetail.module.css";
import EventSidebar from "@/components/event/detail/EventSidebar";

export async function generateStaticParams() {
  return generateEventDetailStaticParams();
}

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const event = await getEventById(id, locale);

  if (!event) {
    return { title: "Not found" };
  }

  return buildDetailPageMetadata(
    `/event/${id}`,
    locale,
    getEventMetadata(event, locale),
  );
}

export default async function EventDetailPage({ params }) {
  const { locale, id } = await params;
  const event = await getEventById(id, locale);

  if (!event) {
    notFound();
  }

  const galleryItems = normalizeGalleryItems(event.gallery, locale);
  const titles = [...new Set([event.titleKo, event.titleEn].filter(Boolean))];

  return (
    <>
      <JsonLd
        data={buildExhibitionEventJsonLd({
          event,
          locale,
          pathname: `/event/${id}`,
        })}
      />
      <article className={`${barlow.variable} ${styles.article}`}>
        <header className={styles.eventHeader}>
          <h1 className={styles.title}>
            {titles.length > 0
              ? titles.map((title) => <span key={title}>{title}</span>)
              : "Untitled"}
          </h1>
          {event.date ? <p className={styles.date}>{event.date}</p> : null}
          {event.space ? <p>{event.space}</p> : null}
        </header>

        <div className={styles.eventContent}>
          <EventGallery items={galleryItems} />
          <EventSidebar event={event} locale={locale} />
        </div>
      </article>
    </>
  );
}
