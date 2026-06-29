"use client";

import styles from "./WorkGallerySwiper.module.css";

export default function WorkGallerySwiper({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.track}>
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
              <figcaption className={styles.caption}>{item.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );
}
