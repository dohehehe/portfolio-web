import "server-only";

import {
  sortByYearDesc,
  sortWorksByOrder,
} from "@/components/navigation/workListUtils";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { applyPublicActiveFilter } from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NAV_PROJECT_COLUMNS =
  "id,created_at,year,title_ko,title_en,is_active";
const NAV_WORK_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,"order",is_active';

const fetchNavigationWorkListData = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();

    const [projectsResult, worksResult] = await Promise.all([
      applyPublicActiveFilter(
        supabase.from("project").select(NAV_PROJECT_COLUMNS),
      ),
      applyPublicActiveFilter(supabase.from("work").select(NAV_WORK_COLUMNS)),
    ]);

    if (projectsResult.error || worksResult.error) {
      return { projects: [], works: [] };
    }

    return {
      projects: sortByYearDesc(projectsResult.data ?? []),
      works: sortWorksByOrder(worksResult.data ?? []),
    };
  },
  {
    key: ["navigation-work-list"],
    tags: [
      DATA_CACHE_TAG.project,
      DATA_CACHE_TAG.work,
      DATA_CACHE_TAG.navigation,
    ],
  },
);

export async function getNavigationWorkListData() {
  return fetchNavigationWorkListData();
}
