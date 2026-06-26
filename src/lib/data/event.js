import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getEventById(id, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event")
    .select("id,title_ko,title_en,date,space_ko,space_en")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    date: data.date,
    space: pickLocalized(data, "space", locale),
  };
}
