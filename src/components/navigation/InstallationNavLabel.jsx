"use client";

import { useEffect, useState } from "react";
import styles from "./navigation.module.css";

const LABELS = ["installation", "exhibition", "performance", "scene", "event"];
const HOLD_MS = 5000;
const BLUR_MS = 2000;

export default function InstallationNavLabel() {
  const [index, setIndex] = useState(0);
  const [isBlurring, setIsBlurring] = useState(false);

  useEffect(() => {
    let blurTimeout;
    let holdTimeout;

    function scheduleNext() {
      holdTimeout = setTimeout(() => {
        setIsBlurring(true);
        blurTimeout = setTimeout(() => {
          setIndex((current) => (current + 1) % LABELS.length);
          setIsBlurring(false);
          scheduleNext();
        }, BLUR_MS);
      }, HOLD_MS);
    }

    scheduleNext();

    return () => {
      clearTimeout(holdTimeout);
      clearTimeout(blurTimeout);
    };
  }, []);

  return (
    <span className={styles.cyclingLabelWrap}>
      <span className={styles.cyclingLabelSizer} aria-hidden="true">
        installation
      </span>
      <span
        className={`${styles.cyclingLabel} ${isBlurring ? styles.cyclingLabelBlurring : ""}`}
      >
        {LABELS[index]}
      </span>
    </span>
  );
}
