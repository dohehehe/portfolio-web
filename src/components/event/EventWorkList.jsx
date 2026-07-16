import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./EventWorkList.module.css";

function formatMetaParts({ year, medium, dimension }) {
  const rest = [medium, dimension].filter(Boolean).join(" ");

  if (year) {
    return rest ? `${year}. ${rest}` : `${year}.`;
  }

  return rest;
}

function getItemHref(item, locale) {
  if (item.type === "work" && item.projectId) {
    return localizedPath(`/work/${item.projectId}`, locale, item.id);
  }

  return localizedPath(`/work/${item.id}`, locale);
}

export default function EventWorkList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.workContent}>
      <ul className={styles.workList}>
        {items.map((item) => {
          if (!item.title && !item.year && !item.medium && !item.dimension) {
            return null;
          }

          const meta = formatMetaParts(item);
          const titleClassName = `${styles.workTitle} ${locale === "en" ? styles.workTitleEn : ""}`.trim();
          const titleLabel =
            item.title && locale === "en"
              ? item.title
              : item.title
                ? `〈${item.title}〉`
                : null;

          return (
            <li key={`${item.type}-${item.id}`}>
              <Link href={getItemHref(item, locale)} className={styles.workLink}>
                <div className={styles.workItemRow}>
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
