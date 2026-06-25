"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/locale/LocaleProvider";
import { extractEnFields } from "@/lib/locale/extractLocaleFields";
import { mergeLocaleItem } from "@/lib/locale/mergeLocaleItem";

async function fetchEnRecord(apiBase, id) {
  const response = await fetch(`${apiBase}/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return extractEnFields(data);
}

export function useLocalizedPage({ project = null, works = [] }) {
  const { locale } = useLocale();
  const [enProject, setEnProject] = useState(null);
  const [enWorks, setEnWorks] = useState({});
  const workIdsKey = works.map((work) => work.id).join(",");

  useEffect(() => {
    if (locale !== "en") {
      return undefined;
    }

    let cancelled = false;

    async function loadEnData() {
      const requests = [
        ...works.map(async (work) => {
          const enWork = await fetchEnRecord("/api/work", work.id);
          return [work.id, enWork];
        }),
      ];

      if (project) {
        requests.push(
          fetchEnRecord("/api/project", project.id).then((enProjectData) => [
            "__project__",
            enProjectData,
          ]),
        );
      }

      const results = await Promise.all(requests);

      if (cancelled) {
        return;
      }

      const nextEnWorks = {};
      let nextEnProject = null;

      for (const [key, value] of results) {
        if (key === "__project__") {
          nextEnProject = value;
        } else {
          nextEnWorks[key] = value;
        }
      }

      setEnProject(nextEnProject);
      setEnWorks(nextEnWorks);
    }

    loadEnData();

    return () => {
      cancelled = true;
    };
  }, [locale, project?.id, workIdsKey, works, project]);

  const localizedProject = useMemo(() => {
    if (!project) {
      return null;
    }

    return mergeLocaleItem(project, enProject, locale);
  }, [project, enProject, locale]);

  const localizedWorks = useMemo(
    () => works.map((work) => mergeLocaleItem(work, enWorks[work.id], locale)),
    [works, enWorks, locale],
  );

  return {
    locale,
    project: localizedProject,
    works: localizedWorks,
  };
}

export function useLocalizedItem(table, item) {
  const { locale } = useLocale();
  const [enItem, setEnItem] = useState(null);

  useEffect(() => {
    if (locale !== "en") {
      return undefined;
    }

    let cancelled = false;

    async function loadEnItem() {
      const enRecord = await fetchEnRecord(`/api/${table}`, item.id);

      if (!cancelled) {
        setEnItem(enRecord);
      }
    }

    loadEnItem();

    return () => {
      cancelled = true;
    };
  }, [locale, table, item.id]);

  const localizedItem = useMemo(
    () => mergeLocaleItem(item, enItem, locale),
    [item, enItem, locale],
  );

  return { item: localizedItem, locale };
}
