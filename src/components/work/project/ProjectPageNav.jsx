"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { barlow } from "@/app/fonts";
import { localizedPath } from "@/lib/locale/routing";
import { getSectionHash, scrollToSection } from "@/lib/scroll/scrollToSection";
import styles from "@/components/work/project/ProjectPageNav.module.css";

const SCROLL_OFFSET = 64;
const NAV_HIDE_TOP_ZONE = 200;
const SCROLL_DIRECTION_THRESHOLD = 8;

function NavItem({ id, title, year, nested = false, active, onNavigate }) {
  return (
    <li className={`${styles.item} ${nested ? styles.nestedItem : ""}`.trim()}>
      <button
        type="button"
        className={`${styles.link} ${active ? styles.linkActive : ""}`.trim()}
        onClick={() => onNavigate(id)}
      >
        <span className={styles.title}>{title || "-"}</span>
        {year ? <span className={styles.year}>{year}</span> : null}
      </button>
    </li>
  );
}

export default function ProjectPageNav({ project, works, locale }) {
  const [activeId, setActiveId] = useState(project.id);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const sectionIds = useMemo(
    () => [project.id, ...works.map((work) => work.id)],
    [project.id, works],
  );

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function resolveActiveSectionId() {
      let currentId = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= SCROLL_OFFSET) {
          currentId = id;
        }
      }

      return currentId;
    }

    function syncActiveId() {
      setActiveId(getSectionHash() || resolveActiveSectionId());
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= NAV_HIDE_TOP_ZONE) {
        setIsVisible(false);
      } else if (delta > SCROLL_DIRECTION_THRESHOLD) {
        setIsVisible(false);
      } else if (delta < -SCROLL_DIRECTION_THRESHOLD) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;

      setActiveId((prev) => {
        const next = resolveActiveSectionId();
        return prev === next ? prev : next;
      });
    }

    syncActiveId();
    handleScroll();
    window.addEventListener("hashchange", syncActiveId);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("hashchange", syncActiveId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sectionIds]);

  const navigate = useCallback(
    (id) => {
      scrollToSection(id, "smooth");
      window.history.replaceState(
        null,
        "",
        localizedPath(`/work/${project.id}`, locale, id),
      );
      setActiveId(id);
    },
    [project.id, locale],
  );

  return (
    <nav
      className={`${barlow.variable} ${styles.nav} ${isVisible ? "" : styles.navHidden}`.trim()}
      aria-label="Project sections"
      aria-hidden={!isVisible}
    >
      <ul className={styles.list}>
        <NavItem
          id={project.id}
          title={project.title}
          year={project.year}
          active={activeId === project.id}
          onNavigate={navigate}
        />
        {works.map((work) => (
          <NavItem
            key={work.id}
            id={work.id}
            title={work.title}
            year={work.year}
            nested
            active={activeId === work.id}
            onNavigate={navigate}
          />
        ))}
      </ul>
    </nav>
  );
}
