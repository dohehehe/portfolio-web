import styles from "./EventDetail.module.css";

export default function EventHeader({ event }) {
  const titles = [...new Set([event.titleKo, event.titleEn].filter(Boolean))];

  return (
    <header className={styles.eventHeader}>
      <h1 className={styles.title}>
        {titles.length > 0
          ? titles.map((title) => (
              <span key={title} className={styles.titleLine}>
                {title}
              </span>
            ))
          : "Untitled"}
      </h1>
      {event.date ? <p className={styles.date}>{event.date}</p> : null}
      {event.space ? <p>{event.space}</p> : null}
    </header>
  );
}
