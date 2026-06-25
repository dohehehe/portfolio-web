import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getWorksByProjectId(projectId) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("work")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    return [];
  }

  return sortByYearDesc(data ?? []);
}

export async function getWorkById(id) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("work")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
