import HashScroll from "./HashScroll";
import ProjectPageNav from "./ProjectPageNav";
import WorkItemDetail from "./WorkItemDetail";
import styles from "./workDetail.module.css";

export default function ProjectWorkPage({ project, works, scrollToId = null }) {
  return (
    <div className={styles.page}>
      <HashScroll targetId={scrollToId} projectId={project.id} />
      <ProjectPageNav project={project} works={works} />
      <WorkItemDetail id={project.id} item={project} />
      {works.map((work) => (
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
