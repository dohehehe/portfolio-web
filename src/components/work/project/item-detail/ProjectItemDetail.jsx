import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import ProjectGallerySwiper from "@/components/work/gallery/ProjectGallerySwiper";
import ProjectEditorSection from "@/components/work/project/item-detail/ProjectEditorSection";
import ProjectEventList from "@/components/work/project/item-detail/ProjectEventList";
import ProjectTextList from "@/components/work/project/item-detail/ProjectTextList";
import styles from "@/components/work/project/item-detail/ProjectItemDetail.module.css";

const META_FIELDS = ["medium", "dimension"];

function getBilingualTitles(item) {
  return [...new Set([item.titleKo, item.titleEn].filter(Boolean))];
}

export default function ProjectItemDetail({
  id,
  item,
  cvs = [],
  texts = [],
  className = "",
  locale,
}) {
  const galleryItems = normalizeGalleryItems(item.gallery, locale);
  const titles = getBilingualTitles(item);

  return (
    <article id={id} className={`${styles.article} ${className}`.trim()}>

      <header className={styles.header}>
        <h1 className={styles.title}>
          {titles.length > 0
            ? titles.map((title) => (
              <span key={title} className={styles.titleLine}>
                {title}
              </span>
            ))
            : "Untitled"}
        </h1>
        <h2 className={styles.subtitle}>
          {item.year ? <div className={styles.year}>{item.year}</div> : null}

          {META_FIELDS.map((label) => {
            const value = item[label];

            if (!value) {
              return null;
            }

            return (
              <span key={label} className={styles.metaValue}>{value}</span>
            );
          })}

        </h2>
      </header>

      <ProjectGallerySwiper items={galleryItems} />

      <div className={styles.contentRow}>
        <ProjectEditorSection variant="content" data={item.content} styles={styles} />

        <div className={styles.creditRow}>
          <ProjectEventList items={cvs} locale={locale} styles={styles} />
          <ProjectTextList items={texts} locale={locale} styles={styles} />
          <ProjectEditorSection variant="credit" data={item.credit} styles={styles} />
        </div>
      </div>
    </article>
  );
}
