function getYearValue(year) {
  if (!year) {
    return 0;
  }

  const match = String(year).match(/\d{4}/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function getOrderValue(order) {
  const value = Number(order);
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

export function sortByYearDesc(items) {
  return [...items].sort((left, right) => {
    const yearDiff = getYearValue(right.year) - getYearValue(left.year);

    if (yearDiff !== 0) {
      return yearDiff;
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  });
}

export function sortWorksByOrder(works) {
  return [...works].sort((left, right) => {
    const orderDiff = getOrderValue(left.order) - getOrderValue(right.order);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    const yearDiff = getYearValue(right.year) - getYearValue(left.year);

    if (yearDiff !== 0) {
      return yearDiff;
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  });
}

export function groupWorksByProject(projects, works) {
  const worksByProjectId = new Map();

  for (const work of works) {
    if (!work.project_id) {
      continue;
    }

    const projectWorks = worksByProjectId.get(work.project_id) ?? [];
    projectWorks.push(work);
    worksByProjectId.set(work.project_id, projectWorks);
  }

  return sortByYearDesc(projects).map((project) => ({
    ...project,
    works: sortWorksByOrder(worksByProjectId.get(project.id) ?? []),
  }));
}
