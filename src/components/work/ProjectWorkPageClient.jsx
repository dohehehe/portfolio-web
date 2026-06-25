"use client";

import HashScroll from "./HashScroll";
import ProjectPageNav from "./ProjectPageNav";
import WorkItemDetail from "./WorkItemDetail";
import { useLocalizedPage } from "./useLocalizedPage";
import styles from "./workDetail.module.css";

export default function ProjectWorkPageClient({ project, works, scrollToId = null }) {
  const { project: localizedProject, works: localizedWorks } = useLocalizedPage({
    project,
    works,
  });

  return (
    <div className={styles.page}>
      <HashScroll targetId={scrollToId} projectId={project.id} />
      <ProjectPageNav project={localizedProject} works={localizedWorks} />
      <WorkItemDetail id={localizedProject.id} item={localizedProject} />
      {localizedWorks.map((work) => (
        <WorkItemDetail
          key={work.id}
          id={work.id}
          item={work}
          className={styles.workSection}
        />
      ))}
    </div>
  );
}
