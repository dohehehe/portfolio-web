import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { SITE_NAME } from "@/lib/site/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const INFO_COLUMNS = "id,created_at,email,bio_ko,bio_en";

export async function getInfo(locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("info")
    .select(INFO_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    bio: pickLocalized(data, "bio", locale),
  };
}

export async function getSiteDescription(locale = DEFAULT_LOCALE) {
  const info = await getInfo(locale);

  return info?.bio || SITE_NAME;
}
