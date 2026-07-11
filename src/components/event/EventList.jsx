"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  localizedPath,
} from "@/lib/locale/routing";
import styles from "./EventList.module.css";

export default function EventList({
  className = "",
  events = [],
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  if (events.length === 0) {
    return null;
  }

  return (
    <ul className={`${styles.list} ${className}`.trim()}>
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
          </Link>
        </li>
      ))}
    </ul>
  );
}
