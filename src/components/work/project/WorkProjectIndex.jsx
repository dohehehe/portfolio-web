"use client";

import { localizedPath } from "@/lib/locale/routing";
import { scrollToSection } from "@/lib/scroll/scrollToSection";
import styles from "@/components/work/project/ProjectWorkPage.module.css";

export default function WorkProjectIndex({ projectId, projectTitle, locale }) {
  function handleClick() {
    scrollToSection(projectId, "smooth");
    window.history.replaceState(
      null,
      "",
      localizedPath(`/work/${projectId}`, locale),
    );
  }

  return (
    <button
      type="button"
      className={styles.workIndex}
      onClick={handleClick}
    >
      {/* {projectTitle} */}
    </button>
  );
}
