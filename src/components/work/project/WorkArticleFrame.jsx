"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "@/components/work/project/ProjectWorkPage.module.css";

const MOBILE_QUERY = "(max-width: 780px)";

export default function WorkArticleFrame({ id, children }) {
  const frameRef = useRef(null);
  const runwayRef = useRef(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const runway = runwayRef.current;
    const galleryPane = frame?.querySelector("[data-work-gallery]");
    const gallery = galleryPane?.firstElementChild;

    if (!frame || !runway || !galleryPane || !gallery) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let frameId = 0;

    const apply = () => {
      frameId = 0;

      if (mediaQuery.matches) {
        runway.style.height = "";
        gallery.style.transform = "";
        galleryPane.style.paddingTop = "";
        return;
      }

      galleryPane.style.paddingTop = "";

      const frameHeight = frame.offsetHeight;
      const visibleHeight = galleryPane.clientHeight;

      if (!frameHeight || !visibleHeight) {
        return;
      }

      const overflow = Math.max(0, gallery.offsetHeight - visibleHeight);
      const nextHeight = `${overflow}px`;

      if (runway.style.height !== nextHeight) {
        runway.style.height = nextHeight;
      }

      const stickyTop = Number.parseFloat(getComputedStyle(frame).top) || 0;
      const progress = Math.round(
        Math.min(
          Math.max(stickyTop + frameHeight - runway.getBoundingClientRect().top, 0),
          overflow,
        ),
      );

      gallery.style.transform = overflow > 0 ? `translate3d(0, ${-progress}px, 0)` : "";
    };

    const schedule = () => {
      if (frameId) {
        return;
      }

      frameId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mediaQuery.addEventListener("change", schedule);
    frame.addEventListener("load", schedule, true);

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(gallery);
    resizeObserver.observe(galleryPane);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mediaQuery.removeEventListener("change", schedule);
      frame.removeEventListener("load", schedule, true);
      resizeObserver.disconnect();

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <>
      <div ref={frameRef} id={id} data-work-frame className={styles.workArticle}>
        {children}
      </div>
      <div ref={runwayRef} data-work-runway className={styles.workRunway} />
    </>
  );
}
