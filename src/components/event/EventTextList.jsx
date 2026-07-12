import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./EventTextList.module.css";

export default function EventTextList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.textContent}>
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
                <div className={styles.textItemRow}>
                  - {item.title ? <span className={styles.textTitle}>{item.title}, </span> : null}
                  {item.writer ? <span className={styles.textMeta}>{item.writer}</span> : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
