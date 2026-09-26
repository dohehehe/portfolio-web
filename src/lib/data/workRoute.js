import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { normalizeRecord } from "@/lib/locale/normalizeRecord";
import {
  getCvsByWorkId,
  getCvsGroupedByProjectAndWorks,
} from "@/lib/data/cv";
import {
  getTextsByWorkId,
  getTextsGroupedByProjectAndWorks,
} from "@/lib/data/text";
import { getProjectById } from "@/lib/data/project";
import { getWorkById, getWorksByProjectId } from "@/lib/data/work";

async function normalizeProjectRoute(project, works, locale, scrollToId = null) {
  const workIds = works.map((work) => work.id);
  const [cvsGrouped, textsGrouped] = await Promise.all([
    getCvsGroupedByProjectAndWorks(project.id, workIds, locale),
    getTextsGroupedByProjectAndWorks(project.id, workIds, locale),
  ]);

  const worksWithRelations = works.map((work) => ({
    ...normalizeRecord(work, locale),
    cvs: cvsGrouped.byWorkId.get(work.id) ?? [],
    texts: textsGrouped.byWorkId.get(work.id) ?? [],
  }));

  return {
    type: "project",
    project: normalizeRecord(project, locale),
    works: worksWithRelations,
    cvs: cvsGrouped.projectCvs,
    texts: textsGrouped.projectTexts,
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
