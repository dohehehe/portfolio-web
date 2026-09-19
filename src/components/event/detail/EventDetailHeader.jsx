"use client";

import { useEffect, useRef } from "react";
import styles from "@/components/event/detail/EventDetail.module.css";

function syncHeaderHeight(header) {
  const article = header.closest("article");

  if (!article) {
    return;
  }

  article.style.setProperty(
    "--event-header-height",
    `${header.getBoundingClientRect().height}px`,
  );
}

export default function EventDetailHeader({ titles, date, space }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return undefined;
    }

    const update = () => syncHeaderHeight(header);

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, [titles, date, space]);

  return (
    <header ref={headerRef} className={styles.eventHeader}>
      <h1 className={styles.title}>
        {titles.length > 0
          ? titles.map((title) => <span key={title}>{title}</span>)
          : "Untitled"}
      </h1>
      {date ? <p className={styles.date}>{date}</p> : null}
      {space ? <p>{space}</p> : null}
    </header>
  );
}
