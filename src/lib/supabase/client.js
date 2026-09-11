import { createBrowserClient } from "@supabase/ssr";

function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, key };
}

export function createSupabaseBrowserClient() {
  const { url, key } = getPublicSupabaseEnv();

  return createBrowserClient(url, key);
}
