import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import WorkGallery from "@/components/work/gallery/WorkGallery";
import ProjectEditorContent from "./ProjectEditorContent";
import styles from "./ProjectItemDetail.module.css";
import ProjectEditorCredit from "./ProjectEditorCredit";

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
    <ProjectEditorContent data={data} styles={styles} />
  );
}

function CreditSection({ title, data }) {
  if (!data) {
    return null;
  }

  return (
    <ProjectEditorCredit data={data} styles={styles} />
  );
}

export default function ProjectItemDetail({ id, item, className = "", locale }) {
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

      <WorkGallery items={galleryItems} variant="project" />

      <div className={styles.contentRow}>
        <ContentSection title="content" data={item.content} />
        <CreditSection title="credit" data={item.credit} />
      </div>
    </article>
  );
}
