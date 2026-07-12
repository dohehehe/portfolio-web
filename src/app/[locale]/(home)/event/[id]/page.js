import { notFound } from "next/navigation";
import { barlow } from "@/app/fonts";
import EventFileGallery from "@/components/event/EventFileGallery";
import EventGallery from "@/components/event/EventGallery";
import { getEventById } from "@/lib/data/event";
import { getTextsByEventId } from "@/lib/data/text";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import styles from "@/components/event/EventDetailPage.module.css";

export default async function EventDetailPage({ params }) {
  const { locale, id } = await params;
  const event = await getEventById(id, locale);

  if (!event) {
    notFound();
  }

  const galleryItems = normalizeGalleryItems(event.gallery, locale);
  const fileLinkItems = normalizeGalleryItems(event.file_link, locale);
  const texts = await getTextsByEventId(id, locale);
  const titles = [...new Set([event.titleKo, event.titleEn].filter(Boolean))];

  return (
    <>
      <section className={`${barlow.variable} ${styles.section}`}>
        <div className={styles.eventHeader}>
          <h1 className={styles.title}>
            {titles.length > 0
              ? titles.map((title) => (
                <span key={title} className={styles.titleLine}>
                  {title}
                </span>
              ))
              : "Untitled"}
          </h1>
          {event.date ? <p className={styles.date}>{event.date}</p> : null}
          {event.space ? <p>{event.space}</p> : null}
        </div>
        <div className={styles.eventGallery}>
          <EventGallery items={galleryItems} />
        </div>
        <div className={styles.fileGallery}>
          <EventFileGallery
            items={fileLinkItems}
            credit={event.credit}
            texts={texts}
            locale={locale}
          />
        </div>
      </section>

    </>
  );
}
