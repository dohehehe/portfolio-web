import { sortWorksByOrder } from "@/components/navigation/workListUtils";
import { getWorkColumns } from "@/lib/data/localizedSelect";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getWorksByProjectId(projectId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("work")
    .select(getWorkColumns(locale))
    .eq("project_id", projectId);

  if (error) {
    return [];
  }

  return sortWorksByOrder(data ?? []);
}

export async function getWorkById(id, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("work")
    .select(getWorkColumns(locale))
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
