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

          return (
            <li key={item.id}>
              <Link
                href={localizedPath(`/text/${item.id}`, locale)}
                className={styles.textLink}
              >
                <span className={styles.textRow}>
                  {item.type?.name ? (
                    <span className={styles.textMeta}>
                      {item.writer || !item.title ? " " : null}
                      {item.type.name}
                    </span>
                  ) : null}
                  {item.title ? (
                    <span className={styles.textTitle}>
                      {item.title}, {item.writer}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
