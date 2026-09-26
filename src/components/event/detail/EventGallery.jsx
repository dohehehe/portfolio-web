"use client";

import { useImageLightbox } from "@/components/image-lightbox";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import { getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { getGalleryItemKey, isGalleryVideo } from "@/components/work/gallery/galleryUtils";
import GalleryMuxVideo from "@/components/work/gallery/GalleryMuxVideo";
import styles from "@/components/event/detail/EventDetail.module.css";

export default function EventGallery({ items }) {
  const { open: openImageLightbox } = useImageLightbox();

  if (!items?.length) {
    return null;
  }

  return (
    <section className={styles.eventGallery}>
      {items.map((item, index) => (
        <figure key={getGalleryItemKey(item, index)} className={styles.item}>
          {isGalleryVideo(item) ? (
            <GalleryMuxVideo
              videoUrl={item.video_url}
              title={getCaptionPlainText(item.caption)}
              variant="fullWidth"
            />
          ) : (
            <AspectRatioImage
              className={styles.image}
              src={item.img_url}
              alt={getCaptionPlainText(item.caption)}
              width={item.width}
              height={item.height}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              onClick={() => openImageLightbox({ items, index })}
            />
          )}
        </figure>
      ))}
    </section>
  );
}
