import styles from "./workDetail.module.css";

export default function WorkGallery({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {items.map((item, index) => (
        <figure key={`${item.img_url}-${index}`} className={styles.galleryItem}>
          <img
            className={styles.galleryImage}
            src={item.img_url}
            alt={item.caption}
          />
          {item.caption ? (
            <figcaption className={styles.caption}>{item.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
