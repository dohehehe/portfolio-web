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

export default function TextRelatedList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.relatedContent}>
      <ul className={styles.relatedList}>
        {items.map((item) => {
          const titleLabel = formatTitle(item, locale);
          const titleClassName = `${styles.relatedTitle} ${
            locale === "en" && item.type !== "event" ? styles.relatedTitleEn : ""
          }`.trim();

          if (!titleLabel && !item.meta) {
            return null;
          }

          return (
            <li key={`${item.type}-${item.id}`}>
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
        })}
      </ul>
    </section>
  );
}
