import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { normalizeRecord } from "@/lib/locale/normalizeRecord";
import { getCvsByProjectId } from "@/lib/data/cv";
import { getTextsByProjectId } from "@/lib/data/text";
import { getProjectById } from "@/lib/data/project";
import { getWorkById, getWorksByProjectId } from "@/lib/data/work";

async function normalizeProjectRoute(project, works, locale, scrollToId = null) {
  const [cvs, texts] = await Promise.all([
    getCvsByProjectId(project.id, locale),
    getTextsByProjectId(project.id, locale),
  ]);

  return {
    type: "project",
    project: normalizeRecord(project, locale),
    works: works.map((work) => normalizeRecord(work, locale)),
    cvs,
    texts,
    scrollToId,
  };
}

export async function getWorkRouteById(id, locale = DEFAULT_LOCALE) {
  const project = await getProjectById(id, locale);

  if (project) {
    const works = await getWorksByProjectId(project.id, locale);
    return normalizeProjectRoute(project, works, locale);
  }

  const work = await getWorkById(id, locale);

  if (!work) {
    return null;
  }

  if (!work.project_id) {
    return {
      type: "standalone",
      item: normalizeRecord(work, locale),
    };
  }

  const parentProject = await getProjectById(work.project_id, locale);

  if (!parentProject) {
    return {
      type: "standalone",
      item: normalizeRecord(work, locale),
    };
  }

  const works = await getWorksByProjectId(parentProject.id, locale);
  return normalizeProjectRoute(parentProject, works, locale, work.id);
}
