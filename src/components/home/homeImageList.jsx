"use client";

import { useEffect, useRef, useState } from "react";
import HomeImageLink, { startScrollNudge } from "@/components/home/homeImageLink";
import styles from "./homeImage.module.css";

const AUTO_HOVER_DELAY_MS = 3000;
const AUTO_HOVER_MS = 5000;
const SCROLL_NUDGE_INTERVAL_MS = 7000;
const MOBILE_QUERY = "(max-width: 780px)";

function shuffleKeys(keys, previousKey) {
  const next = [...keys];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }

  if (next.length > 1 && next[0] === previousKey) {
    [next[0], next[1]] = [next[1], next[0]];
  }

  return next;
}

export default function HomeImageList({ slides }) {
  const [activeKey, setActiveKey] = useState(null);
  const linkNodes = useRef(new Map());

  useEffect(() => {
    const slide = slides[0];

    if (!slide) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const startTimer = window.setTimeout(() => {
      setActiveKey(slide.key);
    }, AUTO_HOVER_DELAY_MS);
    const endTimer = window.setTimeout(() => {
      setActiveKey(null);
    }, AUTO_HOVER_DELAY_MS + AUTO_HOVER_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [slides]);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let timer = 0;
    let cursor = 0;
    let lastKey = null;
    let order = [];
    const running = new Map();

    function stopRunning() {
      running.forEach((cancel) => cancel());
      running.clear();
    }

    function tick() {
      if (!mobile.matches) {
        return;
      }

      const keys = slides
        .map((slide) => slide.key)
        .filter((key) => linkNodes.current.has(key));

      if (keys.length === 0) {
        timer = window.setTimeout(tick, SCROLL_NUDGE_INTERVAL_MS);
        return;
      }

      if (cursor >= order.length || order.some((key) => !keys.includes(key))) {
        order = shuffleKeys(keys, lastKey);
        cursor = 0;
      }

      const key = order[cursor];
      cursor += 1;
      lastKey = key;
      const link = linkNodes.current.get(key);

      if (link) {
        running.get(key)?.();
        running.set(key, startScrollNudge(link));
      }

      timer = window.setTimeout(tick, SCROLL_NUDGE_INTERVAL_MS);
    }

    function syncToViewport() {
      window.clearTimeout(timer);

      if (!mobile.matches) {
        stopRunning();
        return;
      }

      timer = window.setTimeout(tick, SCROLL_NUDGE_INTERVAL_MS);
    }

    syncToViewport();
    mobile.addEventListener("change", syncToViewport);

    return () => {
      window.clearTimeout(timer);
      mobile.removeEventListener("change", syncToViewport);
      stopRunning();
    };
  }, [slides]);

  return (
    <div className={styles.imageContainer}>
      {slides.map((slide) => (
        <HomeImageLink
          key={slide.key}
          slide={slide}
          active={slide.key === activeKey}
          linkRef={(node) => {
            if (node) {
              linkNodes.current.set(slide.key, node);
              return;
            }

            linkNodes.current.delete(slide.key);
          }}
        />
      ))}
    </div>
  );
}
