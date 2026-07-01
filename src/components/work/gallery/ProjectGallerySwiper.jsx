"use client";

import styles from "./ProjectGallerySwiper.module.css";

export default function ProjectGallerySwiper({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
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
  );
}
