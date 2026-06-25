import { normalizeGallery } from "@/components/admin/forms/formUtils";
import styles from "./workDetail.module.css";

export default function WorkGallery({ gallery }) {
  const items = normalizeGallery(gallery);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {items.map((item, index) => (
        <figure key={`${item.img_url}-${index}`} className={styles.galleryItem}>
          <img
            className={styles.galleryImage}
            src={item.img_url}
            alt={item.caption_ko || item.caption_en || ""}
          />
          {item.caption_ko || item.caption_en ? (
            <figcaption className={styles.caption}>
              {item.caption_ko}
              {item.caption_ko && item.caption_en ? " / " : null}
              {item.caption_en}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
