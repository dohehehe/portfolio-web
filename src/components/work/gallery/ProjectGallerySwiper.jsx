"use client";

import { useRef } from "react";
import styles from "./ProjectGallerySwiper.module.css";

export default function ProjectGallerySwiper({ items }) {
  const trackRef = useRef(null);

  function scrollGallery(direction) {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction === "next" ? node.clientWidth * 0.75 : -node.clientWidth * 0.75,
      behavior: "smooth",
    });
  }

  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        aria-label="Scroll left"
        onClick={() => scrollGallery("prev")}
      >
        ‹
      </button>

      <div ref={trackRef} className={styles.track}>
        {items.map((item, index) => (
          <figure key={`${item.img_url}-${index}`} className={styles.slide}>
            <img
              className={styles.image}
              src={item.img_url}
              alt={item.caption || ""}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
            />
            {item.caption ? (
              <figcaption className={styles.caption}>
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonNext}`}
        aria-label="Scroll right"
        onClick={() => scrollGallery("next")}
      >
        ›
      </button>
    </div>
  );
}
