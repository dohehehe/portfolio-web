"use client";

import Caption from "@/components/ui/Caption";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./homeImage.module.css";

function readRatio(image) {
  if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return null;
  }

  return image.naturalWidth / image.naturalHeight;
}

const SCROLL_NUDGE_MS = 5000;

export function startScrollNudge(link) {
  let frame = 0;
  let cancelled = false;
  const image = link.querySelector("img");

  function cancel() {
    cancelled = true;
    window.cancelAnimationFrame(frame);
    image?.removeEventListener("load", run);
    link.removeEventListener("pointerdown", cancel);
  }

  function run() {
    if (cancelled) {
      return;
    }

    const max = link.scrollWidth - link.clientWidth;

    if (max <= 1) {
      if (image && !image.complete) {
        image.addEventListener("load", run, { once: true });
      }

      return;
    }

    const start = performance.now();

    function step(now) {
      if (cancelled) {
        return;
      }

      const progress = Math.min(1, (now - start) / SCROLL_NUDGE_MS);
      link.scrollLeft = max * Math.sin(progress * Math.PI);

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
        return;
      }

      link.scrollLeft = 0;
    }

    frame = window.requestAnimationFrame(step);
  }

  link.addEventListener("pointerdown", cancel);
  run();

  return cancel;
}

export default function HomeImageLink({ slide, active = false, linkRef }) {
  const imageRef = useRef(null);
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      return undefined;
    }

    function syncRatio() {
      const nextRatio = readRatio(image);

      if (nextRatio) {
        setRatio(nextRatio);
      }
    }

    syncRatio();
    image.addEventListener("load", syncRatio);

    return () => image.removeEventListener("load", syncRatio);
  }, [slide.src]);

  return (
    <Link
      ref={linkRef}
      href={slide.href}
      className={active ? `${styles.imageLink} ${styles.imageLinkActive}` : styles.imageLink}
      style={{ "--ratio": ratio }}
    >
      <span className={styles.imageFrame}>
        <img
          ref={imageRef}
          src={slide.src}
          alt={slide.alt}
          className={styles.image}
          draggable={false}
        />
      </span>
      <Caption as="span" className={styles.caption} text={slide.caption} />
    </Link>
  );
}
