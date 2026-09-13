import { Suspense } from "react";
import { notFound } from "next/navigation";
import { barlow } from "@/app/fonts";
import EventHeader from "@/components/event/detail/EventHeader";
import EventGallery from "@/components/event/detail/EventGallery";
import EventNoteModal from "@/components/event/detail/EventNoteModal";
import EventFileGallerySection, {
  EventFileGallerySkeleton,
} from "@/components/event/detail/EventFileGallerySection";
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

  return (
    <>
      <JsonLd
        data={buildExhibitionEventJsonLd({
          event,
          locale,
          pathname: `/event/${id}`,
        })}
      />
      <section className={`${barlow.variable} ${styles.section}`}>
        <EventHeader event={event} />
        <div className={styles.eventGallery}>
          <EventGallery items={galleryItems} />
        </div>
        <div className={styles.fileGallery}>
          <Suspense fallback={<EventFileGallerySkeleton />}>
            <EventFileGallerySection id={id} locale={locale} />
          </Suspense>
        </div>
        <EventNoteModal data={event.note} />
      </section>
    </>
  );
}
