import HashScroll from "@/components/work/project/HashScroll";
import ProjectItemDetail from "@/components/work/project/item-detail/ProjectItemDetail";
import ProjectPageNav from "@/components/work/project/ProjectPageNav";
import WorkProjectIndex from "@/components/work/project/WorkProjectIndex";
import WorkItemDetail from "@/components/work/work/WorkItemDetail";
import styles from "@/components/work/project/ProjectWorkPage.module.css";

export default function ProjectWorkPage({
  project,
  works,
  cvs = [],
  texts = [],
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
      {/* <ProjectPageNav project={project} works={works} locale={locale} /> */}
      <ProjectItemDetail
        id={project.id}
        item={project}
        cvs={cvs}
        texts={texts}
        locale={locale}
      />

      {works.map((work) => (
        <div id={work.id} key={work.id}>
          <WorkProjectIndex
            projectId={project.id}
            projectTitle={project.title}
            locale={locale}
          />
          <WorkItemDetail
            item={work}
            locale={locale}
            className={styles.workSection}
          />
        </div>
      ))}
    </div>
  );
}
