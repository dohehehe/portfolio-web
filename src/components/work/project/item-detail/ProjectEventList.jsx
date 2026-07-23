import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import defaultStyles from "@/components/work/project/item-detail/ProjectItemDetail.module.css";

export default function ProjectEventList({
  items = [],
  locale,
  styles = defaultStyles,
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.eventContent}>
      <ul className={styles.eventList}>
        {items.map((item) => {
          if (!item.title && !item.date && !item.space && !item.year) {
            return null;
          }

          const emphasizeTitle = Boolean(item.emphasizeTitle);
          const titleClassName = [
            styles.eventTitle,
            emphasizeTitle && locale === "en" ? styles.eventTitleEn : "",
          ]
            .filter(Boolean)
            .join(" ");
          const titleText = item.title
            ? `${
                emphasizeTitle && locale !== "en"
                  ? `《${item.title}》`
                  : item.title
              }${item.space ? ", " : ""}`
            : null;

          const content = (
            <>
              <div className={styles.eventItemRow}>
                {item.year ? (
                  <span className={styles.eventYear}>{item.year}</span>
                ) : null}
              </div>
              <div className={styles.eventItemRow}>
                {titleText ? (
                  <span className={titleClassName}>{titleText}</span>
                ) : null}
                {item.space ? (
                  <span className={styles.eventMeta}>{item.space}</span>
                ) : null}
              </div>
            </>
          );

          if (item.eventId) {
            return (
              <li key={item.id}>
                <Link
                  href={localizedPath(`/event/${item.eventId}`, locale)}
                  className={`${styles.eventItem} ${styles.eventLink}`.trim()}
                >
                  {content}
                </Link>
              </li>
            );
          }

          if (item.linkUrl) {
            return (
              <li key={item.id}>
                <a
                  href={item.linkUrl}
                  className={`${styles.eventItem} ${styles.eventLink}`.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <div className={styles.eventItem}>{content}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
