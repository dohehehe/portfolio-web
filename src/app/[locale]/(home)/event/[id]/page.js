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
import EventDetailHeader from "@/components/event/detail/EventDetailHeader";
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
        <EventDetailHeader
          titles={titles}
          date={event.date}
          space={event.space}
        />

        <div className={styles.eventContent}>
          <EventGallery items={galleryItems} />
          <EventSidebar event={event} locale={locale} />
        </div>
      </article>
    </>
  );
}
