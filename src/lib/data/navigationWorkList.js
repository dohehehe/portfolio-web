import {
  sortByYearDesc,
  sortWorksByOrder,
} from "@/components/navigation/workListUtils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NAV_PROJECT_COLUMNS = "id,created_at,year,title_ko,title_en";
const NAV_WORK_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,"order"';

export async function getNavigationWorkListData() {
  const supabase = createSupabaseServerClient();

  const [projectsResult, worksResult] = await Promise.all([
    supabase.from("project").select(NAV_PROJECT_COLUMNS),
    supabase.from("work").select(NAV_WORK_COLUMNS),
  ]);

  if (projectsResult.error || worksResult.error) {
    return { projects: [], works: [] };
  }

  return {
    projects: sortByYearDesc(projectsResult.data ?? []),
    works: sortWorksByOrder(worksResult.data ?? []),
  };
}
