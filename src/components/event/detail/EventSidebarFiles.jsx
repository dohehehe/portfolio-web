"use client";

import { useImageLightbox } from "@/components/image-lightbox";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import { getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { getGalleryItemKey, isGalleryVideo } from "@/components/work/gallery/galleryUtils";
import GalleryMuxVideo from "@/components/work/gallery/GalleryMuxVideo";
import styles from "./EventSidebar.module.css";

export default function EventSidebarFiles({ items }) {
  const { open: openImageLightbox } = useImageLightbox();

  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.fileList}>
      {items.map((item, index) => (
        <figure key={getGalleryItemKey(item, index)} className={styles.fileItem}>
          {isGalleryVideo(item) ? (
            <GalleryMuxVideo
              videoUrl={item.video_url}
              title={getCaptionPlainText(item.caption)}
              variant="fullWidth"
            />
          ) : (
            <AspectRatioImage
              className={styles.fileImage}
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
    </div>
  );
}
