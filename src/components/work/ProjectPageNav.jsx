"use client";

import { useCallback, useEffect, useState } from "react";
import { getSectionHash, scrollToSection } from "@/lib/scroll/scrollToSection";
import styles from "./ProjectPageNav.module.css";

function NavItem({ id, titleKo, year, nested = false, active, onNavigate }) {
  return (
    <li className={`${styles.item} ${nested ? styles.nestedItem : ""}`.trim()}>
      <button
        type="button"
        className={`${styles.link} ${active ? styles.linkActive : ""}`.trim()}
        onClick={() => onNavigate(id)}
      >
        <span className={styles.title}>{titleKo || "-"}</span>
        {year ? <span className={styles.year}>{year}</span> : null}
      </button>
    </li>
  );
}

export default function ProjectPageNav({ project, works }) {
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
      window.history.replaceState(null, "", `/work/${project.id}#${id}`);
      setActiveId(id);
    },
    [project.id],
  );

  return (
    <nav className={styles.nav} aria-label="Project sections">
      <ul className={styles.list}>
        <NavItem
          id={project.id}
          titleKo={project.title_ko}
          year={project.year}
          active={activeId === project.id}
          onNavigate={navigate}
        />
        {works.map((work) => (
          <NavItem
            key={work.id}
            id={work.id}
            titleKo={work.title_ko}
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
