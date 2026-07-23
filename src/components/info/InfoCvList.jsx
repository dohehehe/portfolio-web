import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./InfoPage.module.css";

function formatTitle(label, locale, emphasizeTitle) {
  if (!label) {
    return null;
  }

  if (!emphasizeTitle) {
    return label;
  }

  return locale === "en" ? label : `《${label}》`;
}

function CvItemContent({ item, locale }) {
  const emphasizeTitle = Boolean(item.emphasizeTitle);
  const titleClassName = [
    styles.cvTitle,
    emphasizeTitle && locale === "en" ? styles.cvTitleEn : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {item.year ? <span className={styles.cvYear}>{item.year}</span> : null}
      <span className={styles.cvBody}>
        {item.title ? (
          <span className={titleClassName}>
            {formatTitle(item.title, locale, emphasizeTitle)}
            {item.space ? ", " : null}
          </span>
        ) : null}
        {item.space ? <span className={styles.cvMeta}>{item.space}</span> : null}
        {item.suffix ? (
          <span className={styles.cvSuffix}> {item.suffix}</span>
        ) : null}
      </span>
    </>
  );
}

function CvItem({ item, locale }) {
  if (!item.title && !item.space && !item.date && !item.year) {
    return null;
  }

  const content = <CvItemContent item={item} locale={locale} />;

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

  if (item.linkUrl) {
    return (
      <li className={styles.cvItem}>
        <a
          href={item.linkUrl}
          className={styles.cvLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
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
