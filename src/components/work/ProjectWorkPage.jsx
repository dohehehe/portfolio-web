import HashScroll from "./HashScroll";
import ProjectPageNav from "./ProjectPageNav";
import WorkItemDetail from "./WorkItemDetail";
import styles from "./workDetail.module.css";

export default function ProjectWorkPage({
  project,
  works,
  scrollToId = null,
  locale,
}) {
  return (
    <div className={styles.page}>
      <HashScroll
        targetId={scrollToId}
        projectId={project.id}
        locale={locale}
      />
      <ProjectPageNav project={project} works={works} locale={locale} />
      <WorkItemDetail id={project.id} item={project} locale={locale} />
      {works.map((work) => (
        <WorkItemDetail
          key={work.id}
          id={work.id}
          item={work}
          locale={locale}
          className={styles.workSection}
        />
      ))}
    </div>
  );
}
