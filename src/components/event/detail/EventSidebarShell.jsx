"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/components/event/detail/EventSidebar.module.css";

const MOBILE_BREAKPOINT = 780;
const SECTION_SELECTOR = "[data-sidebar-section]";
const SCROLL_EDGE_EPSILON = 4;

function getSidebarPaddingLeft(container) {
  return parseFloat(getComputedStyle(container).paddingLeft) || 0;
}

function getMaxScrollLeft(container) {
  return Math.max(0, container.scrollWidth - container.clientWidth);
}

/** Scroll position that aligns the section's left edge with the inner start (after padding-left). */
function getSectionScrollTarget(container, section) {
  const paddingLeft = getSidebarPaddingLeft(container);
  const containerRect = container.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();
  const sectionOffsetInContent =
    container.scrollLeft + (sectionRect.left - containerRect.left);

  return sectionOffsetInContent - paddingLeft;
}

function getSectionScrollTargets(container, sections) {
  return sections.map((section) => getSectionScrollTarget(container, section));
}

function clampScrollLeft(container, value) {
  return Math.min(Math.max(0, value), getMaxScrollLeft(container));
}

function scrollToAdjacentSection(container, direction) {
  const sections = Array.from(container.querySelectorAll(SECTION_SELECTOR));

  if (!sections.length) {
    return;
  }

  const targets = getSectionScrollTargets(container, sections);
  const { scrollLeft } = container;
  const maxScroll = getMaxScrollLeft(container);
  const lastSectionTarget = targets[targets.length - 1] ?? 0;

  if (direction === "next") {
    const nextIndex = targets.findIndex(
      (target) => target > scrollLeft + SCROLL_EDGE_EPSILON,
    );

    if (nextIndex !== -1) {
      const isLastSection = nextIndex === sections.length - 1;
      const nextLeft = isLastSection ? maxScroll : targets[nextIndex];

      container.scrollTo({
        left: clampScrollLeft(container, nextLeft),
        behavior: "smooth",
      });

      return;
    }

    if (scrollLeft < maxScroll - SCROLL_EDGE_EPSILON) {
      container.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
    }

    return;
  }

  if (scrollLeft > lastSectionTarget + SCROLL_EDGE_EPSILON) {
    container.scrollTo({
      left: clampScrollLeft(container, lastSectionTarget),
      behavior: "smooth",
    });

    return;
  }

  const prevTarget = [...targets]
    .reverse()
    .find((target) => target < scrollLeft - SCROLL_EDGE_EPSILON);

  if (prevTarget !== undefined) {
    container.scrollTo({
      left: clampScrollLeft(container, prevTarget),
      behavior: "smooth",
    });
  }
}

export default function EventSidebarShell({ children }) {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [hasMultipleSections, setHasMultipleSections] = useState(false);

  const syncScrollControls = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const sections = Array.from(container.querySelectorAll(SECTION_SELECTOR));
    setHasMultipleSections(sections.length > 1);

    if (sections.length === 0) {
      setCanGoPrev(false);
      setCanGoNext(false);
      return;
    }

    const { scrollLeft } = container;
    const targets = getSectionScrollTargets(container, sections);
    const firstTarget = targets[0] ?? 0;
    const maxScroll = getMaxScrollLeft(container);

    setCanGoPrev(scrollLeft > firstTarget + SCROLL_EDGE_EPSILON);
    setCanGoNext(
      targets.some((target) => target > scrollLeft + SCROLL_EDGE_EPSILON) ||
        scrollLeft < maxScroll - SCROLL_EDGE_EPSILON,
    );
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return undefined;
    }

    syncScrollControls();

    container.addEventListener("scroll", syncScrollControls, { passive: true });
    window.addEventListener("resize", syncScrollControls);

    const resizeObserver = new ResizeObserver(syncScrollControls);
    resizeObserver.observe(container);
    container.querySelectorAll(SECTION_SELECTOR).forEach((section) => {
      resizeObserver.observe(section);
    });

    return () => {
      container.removeEventListener("scroll", syncScrollControls);
      window.removeEventListener("resize", syncScrollControls);
      resizeObserver.disconnect();
    };
  }, [syncScrollControls, children]);

  const showNav = !isMobile && hasMultipleSections;

  return (
    <>
      {showNav ? (
        <nav className={styles.sidebarScrollNav} aria-label="Sidebar sections">
          <button
            type="button"
            className={styles.sidebarScrollButton}
            onClick={() => scrollToAdjacentSection(scrollRef.current, "prev")}
            disabled={!canGoPrev}
            aria-label="Previous section"
          >
            ←
          </button>
          <button
            type="button"
            className={styles.sidebarScrollButton}
            onClick={() => scrollToAdjacentSection(scrollRef.current, "next")}
            disabled={!canGoNext}
            aria-label="Next section"
          >
            →
          </button>
        </nav>
      ) : null}
      <div ref={scrollRef} className={styles.sidebarWrapper}>
        {children}
      </div>
    </>
  );
}
