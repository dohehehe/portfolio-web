import Link from "next/link";
import { localizedPath } from "@/lib/locale/routing";
import styles from "./EventList.module.css";

export default function EventList({ events = [], locale }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.id} className={styles.item}>
          <Link
            className={styles.link}
            href={localizedPath(`/event/${event.id}`, locale)}
          >
            {event.date ? (
              <span className={styles.date}>{event.date}</span>
            ) : null}
            <span className={styles.title}>{event.title || "-"}</span>
            {/* {event.space ? (
              <span className={styles.space}>{event.space}</span>
            ) : null} */}

          </Link>
        </li>
      ))}
    </ul>
  );
}
