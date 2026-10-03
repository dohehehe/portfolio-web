import Link from "next/link";
import { getProjectsAndWorksByEventId } from "@/lib/data/cv";
import { getTextsByEventId } from "@/lib/data/text";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import { localizedPath } from "@/lib/locale/routing";
import EventEditor from "@/components/event/detail/editor/EventEditor";
import EventSidebarFiles from "@/components/event/detail/EventSidebarFiles";
import EventSidebarShell from "@/components/event/detail/EventSidebarShell";
import styles from "@/components/event/detail/EventSidebar.module.css";

function formatWorkMetaParts({ year, medium, dimension }) {
  const rest = [medium, dimension].filter(Boolean).join(" ");

  if (year) {
    return rest ? `${year}. ${rest}` : `${year}.`;
  }

  return rest;
}

function getWorkItemHref(item, locale) {
  if (item.type === "work" && item.projectId) {
    return localizedPath(`/work/${item.projectId}`, locale, item.id);
  }

  return localizedPath(`/work/${item.id}`, locale);
}

function RelatedTextList({ items, locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.textBlock}>
      <ul className={styles.textList}>
        {items.map((item) => {
          if (!item.title && !item.writer && !item.year) {
            return null;
          }

          return (
            <li key={item.id}>
              <Link
                href={localizedPath(`/text/${item.id}`, locale)}
                className={styles.textLink}
              >
                <span className={styles.textRow}>
                {item.type?.name ? (
                    <span className={styles.textMeta}>
                      {item.writer || !item.title ? " " : null}{item.type.name}
                    </span>
                  ) : null} 
                  {item.title ? (
                    <span className={styles.textTitle}>{item.title}, {item.writer} </span>
                  ) : null}

                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RelatedWorkList({ items, locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.workBlock}>
      <ul className={styles.workList}>
        {items.map((item) => {
          if (!item.title && !item.year && !item.medium && !item.dimension) {
            return null;
          }

          const meta = formatWorkMetaParts(item);
          const titleClassName = `${styles.workTitle} ${locale === "en" ? styles.workTitleEn : ""
            }`.trim();
          const titleLabel =
            item.title && locale === "en"
              ? item.title
              : item.title
                ? `〈${item.title}〉`
                : null;

          return (
            <li key={`${item.type}-${item.id}`}>
              <Link href={getWorkItemHref(item, locale)} className={styles.workLink}>
                <span className={styles.workRow}>
                  {titleLabel ? (
                    <span className={titleClassName}>
                      {meta ? `${titleLabel}, ` : titleLabel}
                    </span>
                  ) : null}
                  {meta ? <span className={styles.workMeta}>{meta}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function EventSidebar({ event, locale }) {
  const [texts, works] = await Promise.all([
    getTextsByEventId(event.id, locale),
    getProjectsAndWorksByEventId(event.id, locale),
  ]);

  const fileItems = normalizeGalleryItems(event.file_link, locale);
  const hasCredit = normalizeBlocks(event.credit).length > 0;
  const hasContent = normalizeBlocks(event.content).length > 0;
  const hasTexts = texts.length > 0;
  const hasWorks = works.length > 0;
  const hasFiles = fileItems.length > 0;

  if (!hasCredit && !hasContent && !hasTexts && !hasWorks && !hasFiles) {
    return null;
  }

  return (
    <EventSidebarShell>
      {hasCredit || hasTexts || hasWorks ? (
        <section
          data-sidebar-section
          className={`${styles.section} ${styles.creditSection}`}
          aria-label="credit and related"
        >
          {hasCredit ? (
            <div className={styles.creditBlock}>
              <EventEditor data={event.credit} variant="credit" />
            </div>
          ) : null}
          {hasWorks ? <RelatedWorkList items={works} locale={locale} /> : null}
        </section>
      ) : null}

      <section
        data-sidebar-section
        className={`${styles.section} ${styles.contentSection}`}
        aria-label="content"
      >
        {hasTexts ? <RelatedTextList items={texts} locale={locale} /> : null}
        {hasContent ? (
          <EventEditor data={event.content} variant="content" />
        ) : null}
      </section>

      {hasFiles ? (
        <section
          data-sidebar-section
          className={`${styles.section} ${styles.fileSection}`}
          aria-label="files"
        >
          <EventSidebarFiles items={fileItems} />
        </section>
      ) : null}
    </EventSidebarShell>
  );
}
