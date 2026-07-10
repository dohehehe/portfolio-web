"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useImageLightbox } from "@/components/image-lightbox";
import { getGalleryItemKey, isGalleryVideo } from "@/components/work/gallery/galleryUtils";
import GalleryMuxVideo from "@/components/work/gallery/GalleryMuxVideo";
import { resolveImageDimensions } from "@/utils/imageDimensions";
import styles from "./WorkGallery.module.css";

const GALLERY_GAP = 14;
const MOBILE_BREAKPOINT = 780;

function getOrientation(naturalWidth, naturalHeight) {
  if (!naturalWidth || !naturalHeight) {
    return "portrait";
  }

  if (naturalWidth > naturalHeight) {
    return "landscape";
  }

  if (naturalWidth === naturalHeight) {
    return "square";
  }

  return "portrait";
}

function buildMetaFromDimensions(width, height) {
  return {
    width,
    height,
    orientation: getOrientation(width, height),
  };
}

function getItemMeta(index, item, imageMeta) {
  const loaded = imageMeta[index];

  if (loaded?.width && loaded?.height) {
    return loaded;
  }

  const fromItem = resolveImageDimensions(item);

  if (!fromItem) {
    return loaded ?? null;
  }

  return buildMetaFromDimensions(fromItem.width, fromItem.height);
}

function buildGalleryRows(items, imageMeta, isMobile) {
  if (isMobile) {
    return items.map((item, index) => ({
      type: "full-width",
      items: [{ item, index }],
    }));
  }

  const rows = [];
  let portraitBuffer = [];

  const flushPortraits = () => {
    if (!portraitBuffer.length) {
      return;
    }

    for (let index = 0; index < portraitBuffer.length; index += 2) {
      const pair = portraitBuffer.slice(index, index + 2);

      rows.push({
        type: pair.length === 2 ? "portrait-pair" : "single-portrait",
        items: pair,
      });
    }

    portraitBuffer = [];
  };

  items.forEach((item, index) => {
    const orientation = isGalleryVideo(item)
      ? "landscape"
      : (getItemMeta(index, item, imageMeta)?.orientation ?? null);
    const entry = { item, index };

    if (orientation === "portrait") {
      portraitBuffer.push(entry);
      return;
    }

    flushPortraits();

    if (!orientation) {
      rows.push({
        type: "full-width",
        items: [entry],
      });
      return;
    }

    rows.push({
      type: orientation,
      items: [entry],
    });
  });

  flushPortraits();

  return rows;
}

function buildInitialImageMeta(items) {
  const meta = {};

  items.forEach((item, index) => {
    const dimensions = resolveImageDimensions(item);

    if (dimensions) {
      meta[index] = buildMetaFromDimensions(dimensions.width, dimensions.height);
    }
  });

  return meta;
}

function getItemsKey(items) {
  return items
    .map(
      (item, index) =>
        `${index}:${item.img_url ?? ""}:${item.video_url ?? ""}:${item.width ?? ""}:${item.height ?? ""}`,
    )
    .join("|");
}

function getPairRowHeight(items, imageMeta, galleryWidth) {
  if (!galleryWidth) {
    return undefined;
  }

  const cellWidth = (galleryWidth - GALLERY_GAP) / 2;

  return Math.max(
    ...items.map(({ item, index }) => {
      const meta = getItemMeta(index, item, imageMeta);

      if (!meta?.width || !meta?.height) {
        return 0;
      }

      return cellWidth * (meta.height / meta.width);
    }),
  );
}

export default function WorkGallery({ items }) {
  const galleryRef = useRef(null);
  const { open: openImageLightbox } = useImageLightbox();
  const [galleryWidth, setGalleryWidth] = useState(0);
  const [imageMeta, setImageMeta] = useState(() => buildInitialImageMeta(items));
  const itemsKeyRef = useRef(getItemsKey(items));

  useEffect(() => {
    const nextItemsKey = getItemsKey(items);

    if (nextItemsKey === itemsKeyRef.current) {
      return;
    }

    itemsKeyRef.current = nextItemsKey;
    setImageMeta(buildInitialImageMeta(items));
  }, [items]);

  const handleImageLoad = useCallback((index, image) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    if (!width || !height) {
      return;
    }

    const nextMeta = buildMetaFromDimensions(width, height);

    setImageMeta((prev) => {
      const current = prev[index];

      if (
        current?.orientation === nextMeta.orientation &&
        current?.width === nextMeta.width &&
        current?.height === nextMeta.height
      ) {
        return prev;
      }

      return {
        ...prev,
        [index]: nextMeta,
      };
    });
  }, []);

  useEffect(() => {
    const node = galleryRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setGalleryWidth(entry.contentRect.width);
    });

    observer.observe(node);
    setGalleryWidth(node.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const rows = useMemo(
    () => buildGalleryRows(items, imageMeta, isMobile),
    [items, imageMeta, isMobile],
  );

  useEffect(() => {
    const root = galleryRef.current;

    if (!root) {
      return;
    }

    root.querySelectorAll("img[data-gallery-index]").forEach((node) => {
      const index = Number(node.dataset.galleryIndex);

      if (Number.isNaN(index) || !node.complete || !node.naturalWidth) {
        return;
      }

      handleImageLoad(index, node);
    });
  }, [rows, handleImageLoad]);

  if (!items?.length) {
    return null;
  }

  return (
    <div ref={galleryRef} className={styles.gallery}>
      {rows.map((row) => {
        if (row.type === "portrait-pair") {
          const rowHeight = getPairRowHeight(row.items, imageMeta, galleryWidth);

          return (
            <div
              key={`pair-${row.items.map(({ index }) => index).join("-")}`}
              className={styles.portraitPairRow}
              style={rowHeight ? { height: rowHeight } : undefined}
            >
              {row.items.map(({ item, index }) => {
                const meta = getItemMeta(index, item, imageMeta);

                return (
                  <figure key={getGalleryItemKey(item, index)} className={styles.pairCell}>
                    {isGalleryVideo(item) ? (
                      <GalleryMuxVideo
                        videoUrl={item.video_url}
                        title={item.caption}
                        variant="pair"
                      />
                    ) : (
                      <img
                        data-gallery-index={index}
                        className={styles.pairImage}
                        src={item.img_url}
                        alt={item.caption || ""}
                        width={meta?.width}
                        height={meta?.height}
                        draggable={false}
                        loading={index === 0 ? "eager" : "lazy"}
                        onClick={() => openImageLightbox({ items, index })}
                        onLoad={(event) => handleImageLoad(index, event.currentTarget)}
                      />
                    )}
                  </figure>
                );
              })}
            </div>
          );
        }

        const { item, index } = row.items[0];
        const itemClassName =
          row.type === "single-portrait" ? styles.singlePortrait : styles.fullWidth;
        const meta = getItemMeta(index, item, imageMeta);

        return (
          <figure
            key={getGalleryItemKey(item, index)}
            className={`${styles.item} ${itemClassName}`}
          >
            {isGalleryVideo(item) ? (
              <GalleryMuxVideo
                videoUrl={item.video_url}
                title={item.caption}
                variant="fullWidth"
              />
            ) : (
              <img
                data-gallery-index={index}
                className={styles.image}
                src={item.img_url}
                alt={item.caption || ""}
                width={meta?.width}
                height={meta?.height}
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
                onClick={() => openImageLightbox({ items, index })}
                onLoad={(event) => handleImageLoad(index, event.currentTarget)}
              />
            )}
          </figure>
        );
      })}
    </div>
  );
}
