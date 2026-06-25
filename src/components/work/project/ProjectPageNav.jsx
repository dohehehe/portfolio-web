"use client";

import { useCallback, useEffect, useState } from "react";
import { localizedPath } from "@/lib/locale/routing";
import { getSectionHash, scrollToSection } from "@/lib/scroll/scrollToSection";
import styles from "./ProjectPageNav.module.css";

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

  useEffect(() => {
    function syncActiveId() {
      setActiveId(getSectionHash() || project.id);
    }

    syncActiveId();
    window.addEventListener("hashchange", syncActiveId);
    return () => window.removeEventListener("hashchange", syncActiveId);
  }, [project.id]);

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
    <nav className={styles.nav} aria-label="Project sections">
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
