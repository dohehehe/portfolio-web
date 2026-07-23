import { kapakana } from "@/app/fonts";
import { getLives } from "@/lib/data/live";
import styles from "./Live.module.css";

function formatDate(value, locale) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  if (locale === "en") {
    return `${day}.${month}.${year}`;
  }

  return `${year}.${month}.${day}`;
}

function formatDateRange(startAt, endAt, locale) {
  const start = formatDate(startAt, locale);
  const end = formatDate(endAt, locale);

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start || end || "";
}

function formatTitle(label, locale) {
  if (!label) {
    return null;
  }

  return locale === "en" ? label : `《${label}》`;
}

function LiveItemContent({ item, locale }) {
  const titleClassName = [
    styles.title,
    locale === "en" ? styles.titleEn : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <span className={styles.date}>
        {formatDateRange(item.startAt, item.endAt, locale)}
      </span>
      <span className={styles.body}>
        {item.title ? (
          <span className={titleClassName}>
            {formatTitle(item.title, locale)}
            {item.space ? ", " : null}
          </span>
        ) : null}
        {item.space ? <span className={styles.space}>{item.space}</span> : null}
      </span>
    </>
  );
}

function LiveItem({ item, locale }) {
  const className = [styles.item, item.isOngoing ? styles.ongoing : ""]
    .filter(Boolean)
    .join(" ");
  const content = <LiveItemContent item={item} locale={locale} />;

  if (item.linkUrl) {
    return (
      <li className={className}>
        <a
          href={item.linkUrl}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className={className}>
      <div className={styles.row}>{content}</div>
    </li>
  );
}

export default async function Live({ locale }) {
  const lives = await getLives(locale);

  if (lives.length === 0) {
    return null;
  }

  return (
    <ul className={`${kapakana.variable} ${styles.list}`}>
      *
      {lives.map((item) => (
        <LiveItem key={item.id} item={item} locale={locale} />
      ))}
    </ul>
  );
}