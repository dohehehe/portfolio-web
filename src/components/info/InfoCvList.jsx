import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./InfoPage.module.css";

function CvItem({ item, locale }) {
  const label = item.eventTitle || item.title;

  if (!label && !item.date && !item.space && !item.year) {
    return null;
  }

  const content = (
    <>
      {item.year ? <span className={styles.cvYear}>{item.year}</span> : null}
      <span className={styles.cvBody}>
        {label ? (
          <span
            className={`${styles.cvTitle} ${locale === "en" ? styles.cvTitleEn : ""}`.trim()}
          >
            {locale === "en" ? `${label}` : `《${label}》`}
            {item.space ? ", " : null}
          </span>
        ) : null}
        {item.space ? <span className={styles.cvMeta}>{item.space}</span> : null}
      </span>
    </>
  );

  if (item.eventId) {
    return (
      <li className={styles.cvItem}>
        <Link
          href={localizedPath(`/event/${item.eventId}`, locale)}
          className={styles.cvLink}
        >
          {content}
        </Link>
      </li>
    );
  }

  return <li className={styles.cvItem}>{content}</li>;
}

export default function InfoCvList({ groups = [], locale }) {
  if (!groups.length) {
    return null;
  }

  return (
    <div className={styles.cvGroups}>
      {groups.map((group) => (
        <div key={group.id} className={styles.cvGroup}>
          {group.name ? <h2 className={styles.cvType}>{group.name}</h2> : null}
          <ul className={styles.cvList}>
            {group.items.map((item) => (
              <CvItem key={item.id} item={item} locale={locale} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
