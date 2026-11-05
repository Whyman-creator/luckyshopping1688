import { createClient } from "@supabase/supabase-js";

// Supabase URL & Key with automatic typo correction and fallback
const DEFAULT_SUPABASE_URL = "https://mvfnnthiawdukzytlvdq.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_tDnH5lI9PSQk7LQpfAfg1Q_hriXQSyi";

let configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;

// Auto-correct any typo variations (e.g. single n or double h)
if (
  !configuredUrl ||
  configuredUrl.includes("mvfnthhiawdlukzytvdq") ||
  configuredUrl.includes("your-project.supabase.co")
) {
  configuredUrl = DEFAULT_SUPABASE_URL;
}

const supabaseUrl = configuredUrl;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key")
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-project.supabase.co")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

