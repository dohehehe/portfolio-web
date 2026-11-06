"use client";

import { useEffect, useState } from "react";
import HomeImageLink from "@/components/home/homeImageLink";
import styles from "./homeImage.module.css";

const AUTO_HOVER_MS = 5000;

export default function HomeImageList({ slides }) {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const slide = slides[0];

    if (!slide) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    setActiveKey(slide.key);
    const timer = window.setTimeout(() => setActiveKey(null), AUTO_HOVER_MS);

    return () => window.clearTimeout(timer);
  }, [slides]);

  return (
    <div className={styles.imageContainer}>
      {slides.map((slide) => (
        <HomeImageLink
          key={slide.key}
          slide={slide}
          active={slide.key === activeKey}
        />
      ))}
    </div>
  );
}
