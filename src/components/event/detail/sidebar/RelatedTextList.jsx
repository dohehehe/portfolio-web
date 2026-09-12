import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./RelatedTextList.module.css";

export default function RelatedTextList({ items = [], locale }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.root}>
      <ul className={styles.list}>
        {items.map((item) => {
          if (!item.title && !item.writer && !item.year) {
            return null;
          }

          return (
            <li key={item.id}>
              <Link
                href={localizedPath(`/text/${item.id}`, locale)}
                className={styles.link}
              >
                <div className={styles.row}>
                  -{" "}
                  {item.title ? (
                    <span className={styles.title}>{item.title}, </span>
                  ) : null}
                  {item.writer ? (
                    <span className={styles.meta}>{item.writer}</span>
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
