import Link from "next/link";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import { localizedPath } from "@/lib/locale/routing";
import EventEditor from "./EventEditor";
import styles from "./EventSidebar.module.css";

function RelatedTextList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.textSection}>
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
                <div className={styles.textRow}>
                  -{" "}
                  {item.title ? (
                    <span className={styles.textTitle}>{item.title}, </span>
                  ) : null}
                  {item.writer ? (
                    <span className={styles.textMeta}>{item.writer}</span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

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

function RelatedWorkList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.workSection}>
      <ul className={styles.workList}>
        {items.map((item) => {
          if (!item.title && !item.year && !item.medium && !item.dimension) {
            return null;
          }

          const meta = formatWorkMetaParts(item);
          const titleClassName = `${styles.workTitle} ${
            locale === "en" ? styles.workTitleEn : ""
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
                <div className={styles.workRow}>
                  {titleLabel ? (
                    <span className={titleClassName}>
                      {meta ? `${titleLabel}, ` : titleLabel}
                    </span>
                  ) : null}
                  {meta ? <span className={styles.workMeta}>{meta}</span> : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function EventSidebar({
  content,
  credit,
  texts = [],
  works = [],
  locale,
}) {
  const hasContent = normalizeBlocks(content).length > 0;
  const hasCredit = normalizeBlocks(credit).length > 0;
  const hasTexts = texts.length > 0;
  const hasWorks = works.length > 0;

  if (!hasContent && !hasCredit && !hasTexts && !hasWorks) {
    return null;
  }

  return (
    <>
      {hasContent ? (
        <section className={styles.contentSection} aria-label="content">
          <EventEditor data={content} variant="content" />
        </section>
      ) : null}
      {hasTexts ? <RelatedTextList items={texts} locale={locale} /> : null}
      {hasCredit ? (
        <section className={styles.creditSection} aria-label="credit">
          <EventEditor data={credit} variant="credit" />
        </section>
      ) : null}
      {hasWorks ? <RelatedWorkList items={works} locale={locale} /> : null}
    </>
  );
}
