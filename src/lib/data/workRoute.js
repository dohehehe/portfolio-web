import { getProjectById } from "@/lib/data/project";
import { getWorkById, getWorksByProjectId } from "@/lib/data/work";

export async function getWorkRouteById(id) {
  const project = await getProjectById(id);

  if (project) {
    const works = await getWorksByProjectId(project.id);

    return {
      type: "project",
      project,
      works,
      scrollToId: null,
    };
  }

  const work = await getWorkById(id);

  if (!work) {
    return null;
  }

  if (!work.project_id) {
    return {
      type: "standalone",
      item: work,
    };
  }

  const parentProject = await getProjectById(work.project_id);

  if (!parentProject) {
    return {
      type: "standalone",
      item: work,
    };
  }

  const works = await getWorksByProjectId(parentProject.id);

  return {
    type: "project",
    project: parentProject,
    works,
    scrollToId: work.id,
  };
}
