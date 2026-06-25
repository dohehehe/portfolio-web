import { PROJECT_KO_COLUMNS } from "@/lib/data/localizedSelect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getProjectById(id) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project")
    .select(PROJECT_KO_COLUMNS)
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
