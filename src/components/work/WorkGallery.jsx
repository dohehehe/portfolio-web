"use client";

import { useLocale } from "@/components/locale/LocaleProvider";
import { normalizeGallery } from "@/components/admin/forms/formUtils";
import { pickGalleryCaption } from "@/lib/locale/pickLocalized";
import styles from "./workDetail.module.css";

export default function WorkGallery({ gallery }) {
  const { locale } = useLocale();
  const items = normalizeGallery(gallery);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {items.map((item, index) => {
        const caption = pickGalleryCaption(item, locale);

        return (
          <figure key={`${item.img_url}-${index}`} className={styles.galleryItem}>
            <img
              className={styles.galleryImage}
              src={item.img_url}
              alt={caption}
            />
            {caption ? (
              <figcaption className={styles.caption}>{caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
