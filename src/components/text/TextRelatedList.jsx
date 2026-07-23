import Link from "next/link";
import styles from "./TextRelatedList.module.css";

function formatTitle(item, locale) {
  if (!item.title) {
    return null;
  }

  if (item.type === "event") {
    return locale === "en" ? item.title : `《${item.title}》`;
  }

  if (locale === "en") {
    return item.title;
  }

  return `〈${item.title}〉`;
}

function RelatedItem({ item, locale }) {
  const titleLabel = formatTitle(item, locale);
  const titleClassName = `${styles.relatedTitle} ${locale === "en" && item.type !== "event" ? styles.relatedTitleEn : ""
    }`.trim();

  if (!titleLabel && !item.meta) {
    return null;
  }

  return (
    <li>
      <Link href={item.href} className={styles.relatedLink}>
        <div className={styles.relatedItemRow}>
          {titleLabel ? (
            <span className={titleClassName}>
              {item.meta ? `${titleLabel}, ` : titleLabel}
            </span>
          ) : null}
          {item.meta ? (
            <span className={styles.relatedMeta}>{item.meta}</span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

function RelatedGroup({ items, locale, className = "" }) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className={`${styles.relatedList} ${className}`.trim()}>
      {items.map((item) => (
        <RelatedItem
          key={`${item.type}-${item.id}`}
          item={item}
          locale={locale}
        />
      ))}
    </ul>
  );
}

export default function TextRelatedList({ items = [], locale }) {
  const eventItems = items.filter((item) => item.type === "event");
  const workItems = items.filter(
    (item) => item.type === "project" || item.type === "work",
  );

  if (!eventItems.length && !workItems.length) {
    return null;
  }

  return (
    <section className={styles.relatedContent}>
      <RelatedGroup
        items={eventItems}
        locale={locale}
        className={styles.eventItems}
      />
      <RelatedGroup
        items={workItems}
        locale={locale}
        className={styles.workItems}
      />
    </section>
  );
}
