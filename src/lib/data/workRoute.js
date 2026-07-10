import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { normalizeRecord } from "@/lib/locale/normalizeRecord";
import { getCvsByProjectId, getCvsByWorkId } from "@/lib/data/cv";
import { getTextsByProjectId, getTextsByWorkId } from "@/lib/data/text";
import { getProjectById } from "@/lib/data/project";
import { getWorkById, getWorksByProjectId } from "@/lib/data/work";

async function normalizeProjectRoute(project, works, locale, scrollToId = null) {
  const [cvs, texts] = await Promise.all([
    getCvsByProjectId(project.id, locale),
    getTextsByProjectId(project.id, locale),
  ]);

  const worksWithRelations = await Promise.all(
    works.map(async (work) => {
      const [workCvs, workTexts] = await Promise.all([
        getCvsByWorkId(work.id, locale),
        getTextsByWorkId(work.id, locale),
      ]);

      return {
        ...normalizeRecord(work, locale),
        cvs: workCvs,
        texts: workTexts,
      };
    }),
  );

  return {
    type: "project",
    project: normalizeRecord(project, locale),
    works: worksWithRelations,
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
    const [cvs, texts] = await Promise.all([
      getCvsByWorkId(work.id, locale),
      getTextsByWorkId(work.id, locale),
    ]);

    return {
      type: "standalone",
      item: normalizeRecord(work, locale),
      cvs,
      texts,
    };
  }

  const parentProject = await getProjectById(work.project_id, locale);

  if (!parentProject) {
    const [cvs, texts] = await Promise.all([
      getCvsByWorkId(work.id, locale),
      getTextsByWorkId(work.id, locale),
    ]);

    return {
      type: "standalone",
      item: normalizeRecord(work, locale),
      cvs,
      texts,
    };
  }

  const works = await getWorksByProjectId(parentProject.id, locale);
  return normalizeProjectRoute(parentProject, works, locale, work.id);
}
