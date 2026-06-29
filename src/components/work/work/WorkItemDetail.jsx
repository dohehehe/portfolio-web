import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import WorkGallery from "@/components/work/gallery/WorkGallery";
import EditorContent from "./EditorContent";
import styles from "./WorkItemDetail.module.css";

function MetaField({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className={styles.metaField}>
      <span className={styles.metaLabel}>{label}</span>
      <p className={styles.metaValue}>{value}</p>
    </div>
  );
}

function ContentSection({ title, data }) {
  if (!data) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <EditorContent data={data} styles={styles} />
    </section>
  );
}

export default function WorkItemDetail({ id, item, className = "", locale }) {
  const galleryItems = normalizeGalleryItems(item.gallery, locale);

  return (
    <article id={id} className={`${styles.article} ${className}`.trim()}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{item.title || "Untitled"}</h1>
          {item.year ? <span className={styles.year}>{item.year}</span> : null}
        </div>

        <MetaField label="medium" value={item.medium} />
        <MetaField label="dimension" value={item.dimension} />
      </header>

      <WorkGallery items={galleryItems} />

      <ContentSection title="content" data={item.content} />
      <ContentSection title="credit" data={item.credit} />
    </article>
  );
}
