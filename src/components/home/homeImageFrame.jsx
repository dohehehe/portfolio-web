"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@/components/home/homeImage.module.css";

const MOBILE_QUERY = "(max-width: 780px)";

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

export default function HomeImageFrame({ slides }) {
  const containerRef = useRef(null);
  const [orderedSlides, setOrderedSlides] = useState(slides);
  const [index, setIndex] = useState(0);
  const activeIndex = index % orderedSlides.length;

  useEffect(() => {
    setOrderedSlides(shuffleSlides(slides));
    setIndex(0);
  }, [slides]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !window.matchMedia(MOBILE_QUERY).matches) {
      return;
    }

    container.scrollLeft = 0;
  }, [orderedSlides]);

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
