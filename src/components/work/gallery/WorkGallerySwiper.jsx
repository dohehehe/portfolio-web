"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./WorkGallerySwiper.module.css";

const GALLERY_GAP = 14;

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

function buildGalleryRows(items, imageMeta) {
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
    const orientation = imageMeta[index]?.orientation ?? "portrait";
    const entry = { item, index };

    if (orientation === "portrait") {
      portraitBuffer.push(entry);
      return;
    }

    flushPortraits();
    rows.push({
      type: orientation,
      items: [entry],
    });
  });

  flushPortraits();

  return rows;
}

function getPairRowHeight(items, imageMeta, galleryWidth) {
  if (!galleryWidth) {
    return undefined;
  }

  const cellWidth = (galleryWidth - GALLERY_GAP) / 2;

  return Math.max(
    ...items.map(({ index }) => {
      const meta = imageMeta[index];

      if (!meta?.width || !meta?.height) {
        return 0;
      }

      return cellWidth * (meta.height / meta.width);
    }),
  );
}

export default function WorkGallerySwiper({ items }) {
  const galleryRef = useRef(null);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const [imageMeta, setImageMeta] = useState({});

  const handleImageLoad = useCallback((index, image) => {
    const { naturalWidth, naturalHeight } = image;
    const orientation = getOrientation(naturalWidth, naturalHeight);

    setImageMeta((prev) => {
      const current = prev[index];

      if (
        current?.orientation === orientation &&
        current?.width === naturalWidth &&
        current?.height === naturalHeight
      ) {
        return prev;
      }

      return {
        ...prev,
        [index]: {
          width: naturalWidth,
          height: naturalHeight,
          orientation,
        },
      };
    });
  }, []);

  const setImageRef = useCallback(
    (index) => (node) => {
      if (node?.complete && node.naturalWidth) {
        handleImageLoad(index, node);
      }
    },
    [handleImageLoad],
  );

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

  const rows = useMemo(
    () => buildGalleryRows(items, imageMeta),
    [items, imageMeta],
  );

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
              {row.items.map(({ item, index }) => (
                <figure key={`${item.img_url}-${index}`} className={styles.pairCell}>
                  <img
                    ref={setImageRef(index)}
                    className={styles.pairImage}
                    src={item.img_url}
                    alt={item.caption || ""}
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={(event) => handleImageLoad(index, event.currentTarget)}
                  />
                </figure>
              ))}
            </div>
          );
        }

        const { item, index } = row.items[0];
        const slideClassName =
          row.type === "single-portrait" ? styles.singlePortrait : styles.fullWidth;

        return (
          <figure
            key={`${item.img_url}-${index}`}
            className={`${styles.slide} ${slideClassName}`}
          >
            <img
              ref={setImageRef(index)}
              className={styles.image}
              src={item.img_url}
              alt={item.caption || ""}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              onLoad={(event) => handleImageLoad(index, event.currentTarget)}
            />
          </figure>
        );
      })}
    </div>
  );
}
