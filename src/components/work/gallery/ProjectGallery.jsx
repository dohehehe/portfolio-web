"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageLightbox } from "@/components/image-lightbox";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import { getGalleryItemKey, isGalleryVideo } from "@/components/work/gallery/galleryUtils";
import GalleryMuxVideo from "@/components/work/gallery/GalleryMuxVideo";
import styles from "./ProjectGallery.module.css";

const SCROLL_EDGE_THRESHOLD = 2;

export default function ProjectGallery({ items }) {
  const trackRef = useRef(null);
  const { open: openImageLightbox } = useImageLightbox();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const maxScroll = node.scrollWidth - node.clientWidth;

    setCanScrollPrev(node.scrollLeft > SCROLL_EDGE_THRESHOLD);
    setCanScrollNext(node.scrollLeft < maxScroll - SCROLL_EDGE_THRESHOLD);
  }, []);

  function scrollGallery(direction) {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction === "next" ? node.clientWidth * 0.75 : -node.clientWidth * 0.75,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const node = trackRef.current;

    if (!node) {
      return undefined;
    }

    updateScrollState();

    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [items, updateScrollState]);

  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        aria-label="Scroll left"
        disabled={!canScrollPrev}
        onClick={() => scrollGallery("prev")}
      >
        ‹
      </button>

      <div ref={trackRef} className={styles.track}>
        {items.map((item, index) => (
          <figure key={getGalleryItemKey(item, index)} className={styles.item}>
            {isGalleryVideo(item) ? (
              <GalleryMuxVideo
                videoUrl={item.video_url}
                title={item.caption}
                variant="carousel"
              />
            ) : (
              <AspectRatioImage
                className={styles.image}
                src={item.img_url}
                alt={item.caption || ""}
                width={item.width}
                height={item.height}
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
                onClick={() => openImageLightbox({ items, index })}
              />
            )}
            {item.caption ? (
              <figcaption className={styles.caption}>
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonNext}`}
        aria-label="Scroll right"
        disabled={!canScrollNext}
        onClick={() => scrollGallery("next")}
      >
        ›
      </button>
    </div>
  );
}
