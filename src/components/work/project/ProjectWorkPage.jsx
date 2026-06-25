import HashScroll from "./HashScroll";
import ProjectItemDetail from "./ProjectItemDetail";
import ProjectPageNav from "./ProjectPageNav";
import WorkItemDetail from "@/components/work/work/WorkItemDetail";
import styles from "./ProjectWorkPage.module.css";

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
      <ProjectItemDetail id={project.id} item={project} locale={locale} />
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
