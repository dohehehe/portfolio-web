import { getProjectColumns } from "@/lib/data/localizedSelect";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getProjectById(id, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project")
    .select(getProjectColumns(locale))
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
