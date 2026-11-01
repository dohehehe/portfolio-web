"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@/components/home/homeImage.module.css";

const MOBILE_QUERY = "(max-width: 780px)";
const MAX_POPUP_SIZE = 500;
const OPENER_WINDOW_NAME = "portfolio-home";

function shuffleSlides(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
}

function fitPopupSize(naturalWidth, naturalHeight) {
  const width = naturalWidth > 0 ? naturalWidth : MAX_POPUP_SIZE;
  const height = naturalHeight > 0 ? naturalHeight : MAX_POPUP_SIZE;
  const maxWidth = Math.min(
    MAX_POPUP_SIZE,
    window.screen?.availWidth || MAX_POPUP_SIZE
  );
  const maxHeight = Math.min(
    MAX_POPUP_SIZE,
    window.screen?.availHeight || MAX_POPUP_SIZE
  );
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadPopupSize(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      resolve(fitPopupSize(image.naturalWidth, image.naturalHeight));
    };
    image.onerror = () => {
      resolve(fitPopupSize(MAX_POPUP_SIZE, MAX_POPUP_SIZE));
    };
    image.src = src;
  });
}

function rectsOverlap(a, b, gap) {
  return !(
    a.left + a.width + gap <= b.left ||
    b.left + b.width + gap <= a.left ||
    a.top + a.height + gap <= b.top ||
    b.top + b.height + gap <= a.top
  );
}

function placePopups(sizes) {
  const availLeft = window.screen?.availLeft ?? 0;
  const availTop = window.screen?.availTop ?? 0;
  const availWidth = window.screen?.availWidth || window.innerWidth;
  const availHeight = window.screen?.availHeight || window.innerHeight;
  const gap = 16;
  const placed = [];

  sizes.forEach((size, index) => {
    const maxLeft = Math.max(0, availWidth - size.width);
    const maxTop = Math.max(0, availHeight - size.height);
    let chosen = null;

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const candidate = {
        left: availLeft + Math.floor(Math.random() * (maxLeft + 1)),
        top: availTop + Math.floor(Math.random() * (maxTop + 1)),
        width: size.width,
        height: size.height,
      };

      if (!placed.some((other) => rectsOverlap(candidate, other, gap))) {
        chosen = candidate;
        break;
      }
    }

    if (!chosen) {
      const step = 32;
      const offset = index * step;

      chosen = {
        left: availLeft + (maxLeft === 0 ? 0 : offset % (maxLeft + 1)),
        top: availTop + (maxTop === 0 ? 0 : (offset * 3) % (maxTop + 1)),
        width: size.width,
        height: size.height,
      };
    }

    placed.push(chosen);
  });

  return placed;
}

function popupWindowName(key) {
  return `home-image-${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function fillPopup(popup, slide, onOpenProject) {
  const doc = popup.document;
  const style = doc.createElement("style");
  const link = doc.createElement("a");
  const image = doc.createElement("img");
  const href = new URL(slide.href, window.location.origin).href;

  doc.title = slide.alt || "";
  style.textContent = `
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #fff;
    }

    a, img {
      display: block;
      width: 100%;
      height: 100%;
    }

    img {
      object-fit: contain;
    }
  `;
  link.href = href;
  link.target = window.name || OPENER_WINDOW_NAME;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    onOpenProject(slide.href);
  });
  image.src = slide.src;
  image.alt = slide.alt || "";
  image.draggable = false;
  link.append(image);
  doc.head.replaceChildren(style);
  doc.body.replaceChildren(link);
}

function openImagePopup(slide, frame, onOpenProject) {
  const features = [
    "popup=yes",
    `width=${frame.width}`,
    `height=${frame.height}`,
    `left=${Math.round(frame.left)}`,
    `top=${Math.round(frame.top)}`,
    `screenX=${Math.round(frame.left)}`,
    `screenY=${Math.round(frame.top)}`,
    "scrollbars=no",
    "resizable=yes",
  ].join(",");
  let popup = null;

  try {
    popup = window.open("", popupWindowName(slide.key), features);
  } catch {
    return null;
  }

  if (!popup || popup.closed) {
    return null;
  }

  try {
    fillPopup(popup, slide, onOpenProject);
  } catch {
    popup.close();
    return null;
  }

  return popup;
}

function isInteractiveTarget(target) {
  return (
    target instanceof Element &&
    Boolean(target.closest("a, button, input, textarea, select, label"))
  );
}

export default function HomeImageFrame({ slides }) {
  const router = useRouter();
  const routerRef = useRef(router);
  const containerRef = useRef(null);
  const [orderedSlides, setOrderedSlides] = useState(slides);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(null);
  const activeIndex = orderedSlides.length ? index % orderedSlides.length : 0;

  routerRef.current = router;

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    setOrderedSlides(shuffleSlides(slides));
    setIndex(0);
  }, [slides]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || isMobile !== true) {
      return;
    }

    container.scrollLeft = 0;
  }, [orderedSlides, isMobile]);

  useEffect(() => {
    if (isMobile !== false || slides.length === 0) {
      return undefined;
    }

    let cancelled = false;
    const openedPopups = new Map();
    let prepared = [];

    const openPrepared = () => {
      const pending = prepared.filter(
        (item) => !openedPopups.has(item.slide.key)
      );

      if (pending.length === 0) {
        return true;
      }

      const frames = placePopups(pending.map((item) => item.size));

      pending.forEach((item, itemIndex) => {
        const popup = openImagePopup(item.slide, frames[itemIndex], (href) => {
          routerRef.current.push(href);
        });

        if (popup) {
          openedPopups.set(item.slide.key, popup);
        }
      });

      return openedPopups.size === prepared.length;
    };

    const onGesture = (event) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (openPrepared()) {
        window.removeEventListener("pointerdown", onGesture, true);
      }
    };

    const start = async () => {
      if (!window.name) {
        window.name = OPENER_WINDOW_NAME;
      }

      const ordered = shuffleSlides(slides);
      const sizedSlides = await Promise.all(
        ordered.map(async (slide) => ({
          slide,
          size: await loadPopupSize(slide.src),
        }))
      );

      if (cancelled || window.matchMedia(MOBILE_QUERY).matches) {
        return;
      }

      prepared = sizedSlides;

      if (!openPrepared()) {
        window.addEventListener("pointerdown", onGesture, true);
      }
    };

    start();

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onGesture, true);
      openedPopups.forEach((popup) => {
        if (!popup.closed) {
          popup.close();
        }
      });
    };
  }, [isMobile, slides]);

  function showNextImage(event) {
    if (window.matchMedia(MOBILE_QUERY).matches || orderedSlides.length < 2) {
      return;
    }

    const from = event.relatedTarget;
    const container = containerRef.current;

    if (
      from instanceof Element &&
      container?.contains(from) &&
      from.closest(`.${styles.imageLink}`)
    ) {
      return;
    }

    setIndex((current) => (current + 1) % orderedSlides.length);
  }

  if (isMobile === false) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.imageContainer}>
      {orderedSlides.map((slide, slideIndex) => (
        <Link
          key={slide.key}
          href={slide.href}
          className={
            slideIndex === activeIndex
              ? `${styles.imageLink} ${styles.imageLinkActive}`
              : styles.imageLink
          }
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className={styles.image}
            draggable={false}
            onMouseEnter={showNextImage}
          />
        </Link>
      ))}
    </div>
  );
}
