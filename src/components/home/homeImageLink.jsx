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

export default function HomeImageLink({ slide, active = false, nudgeScroll = false }) {
  const linkRef = useRef(null);
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

  useEffect(() => {
    if (!nudgeScroll) {
      return undefined;
    }

    const link = linkRef.current;
    const mobile = window.matchMedia("(max-width: 780px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!link || !mobile.matches || motion.matches) {
      return undefined;
    }

    let frame = 0;
    let cancelled = false;
    const duration = 3000;

    function cancel() {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      imageRef.current?.removeEventListener("load", run);
      link.removeEventListener("pointerdown", cancel);
    }

    function run() {
      const max = link.scrollWidth - link.clientWidth;

      if (cancelled) {
        return;
      }

      if (max <= 1) {
        const image = imageRef.current;

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

        const progress = Math.min(1, (now - start) / duration);
        link.scrollLeft = max * Math.sin(progress * Math.PI);

        if (progress < 1) {
          frame = window.requestAnimationFrame(step);
          return;
        }

        link.scrollLeft = 0;
      }

      frame = window.requestAnimationFrame(step);
    }

    const timer = window.setTimeout(run, 2000);
    link.addEventListener("pointerdown", cancel);

    return () => {
      cancel();
    };
  }, [nudgeScroll]);

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
