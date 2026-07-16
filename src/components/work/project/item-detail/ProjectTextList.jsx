import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import defaultStyles from "@/components/work/project/item-detail/ProjectItemDetail.module.css";

export default function ProjectTextList({
  items = [],
  locale,
  styles = defaultStyles,
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.textContent}>
      <ul className={styles.eventList}>
        {items.map((item) => {
          if (!item.title && !item.writer && !item.year) {
            return null;
          }

          const content = (
            <>
              <div className={styles.eventItemRow}>
                - {item.title ? <span className={styles.eventTitle}>{item.title}, </span> : null}
                {item.writer ? <span className={styles.eventMeta}>{item.writer}</span> : null}
              </div>
            </>
          );

          return (
            <li key={item.id}>
              <Link
                href={localizedPath(`/text/${item.id}`, locale)}
                className={`${styles.eventItem} ${styles.eventLink}`.trim()}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
