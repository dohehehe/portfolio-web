export function getCvLinkSelections(links, cvId) {
  const cvLinks = links.filter((link) => link.cv_id === cvId);

  return {
    projectIds: cvLinks
      .filter((link) => link.project_id)
      .map((link) => link.project_id),
    workIds: cvLinks.filter((link) => link.work_id).map((link) => link.work_id),
    links: cvLinks,
  };
}

export async function syncLinkCvItems({
  cvId,
  projectIds,
  workIds,
  existingLinks,
  createLink,
  deleteLink,
}) {
  const desiredProjectIds = new Set(projectIds);
  const desiredWorkIds = new Set(workIds);

  const projectLinks = existingLinks.filter((link) => link.project_id);
  const workLinks = existingLinks.filter((link) => link.work_id);

  for (const link of projectLinks) {
    if (!desiredProjectIds.has(link.project_id)) {
      await deleteLink(link.id);
    }
  }

  for (const link of workLinks) {
    if (!desiredWorkIds.has(link.work_id)) {
      await deleteLink(link.id);
    }
  }

  const existingProjectIds = new Set(
    projectLinks.map((link) => link.project_id),
  );
  const existingWorkIds = new Set(workLinks.map((link) => link.work_id));

  for (const projectId of projectIds) {
    if (!existingProjectIds.has(projectId)) {
      await createLink({
        cv_id: cvId,
        project_id: projectId,
        work_id: null,
      });
    }
  }

  for (const workId of workIds) {
    if (!existingWorkIds.has(workId)) {
      await createLink({
        cv_id: cvId,
        project_id: null,
        work_id: workId,
      });
    }
  }
}

export function toggleSelectedId(selectedIds, id) {
  return selectedIds.includes(id)
    ? selectedIds.filter((value) => value !== id)
    : [...selectedIds, id];
}

export function getItemLabel(item, labelKey = "title_ko") {
  return item[labelKey] ?? item.title_en ?? item.year ?? item.id;
}
