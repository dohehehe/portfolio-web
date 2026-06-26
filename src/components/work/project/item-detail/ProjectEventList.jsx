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
          const label = item.eventTitle || item.title;

          if (!label && !item.date && !item.space && !item.year) {
            return null;
          }

          const content = (
            <>
              <div className={styles.eventItemRow}>
                {item.year ? <span className={styles.eventYear}>{item.year}</span> : null}
              </div>
              <div className={styles.eventItemRow}>
                {label ? <span className={styles.eventTitle}>《{label}》, </span> : null}
                {item.space ? <span className={styles.eventMeta}>{item.space}</span> : null}
              </div>
            </>
          );

          return (
            <li key={item.id}>
              {item.eventId ? (
                <Link
                  href={localizedPath(`/event/${item.eventId}`, locale)}
                  className={`${styles.eventItem} ${styles.eventLink}`.trim()}
                >
                  {content}
                </Link>
              ) : (
                <div className={styles.eventItem}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
