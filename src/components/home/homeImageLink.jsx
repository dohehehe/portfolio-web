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

export default function HomeImageLink({ slide, active = false }) {
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
