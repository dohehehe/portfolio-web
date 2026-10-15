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

    const header = frame?.querySelector("header");

    if (!frame || !runway || !galleryPane || !gallery) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let frameId = 0;

    const apply = () => {
      frameId = 0;

      const frameHeight = frame.offsetHeight;
      const mobile = mediaQuery.matches;
      const headerHeight = mobile && header ? header.offsetHeight : 0;
      const nextPadding = headerHeight > 0 ? `${headerHeight}px` : "";

      if (galleryPane.style.paddingTop !== nextPadding) {
        galleryPane.style.paddingTop = nextPadding;
      }

      const visibleHeight = galleryPane.clientHeight;

      if (!frameHeight || !visibleHeight) {
        return;
      }

      const overflow = Math.max(0, headerHeight + gallery.offsetHeight - visibleHeight);
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

    if (header) {
      resizeObserver.observe(header);
    }

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
