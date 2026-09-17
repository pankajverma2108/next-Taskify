"use client";

import { createClient } from "@supabase/supabase-js";

type AccessTokenProvider = () => Promise<string | null>;

export function createClerkSupabaseClient(accessToken: AccessTokenProvider) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return createClient(url, publishableKey, {
    accessToken,
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

export function boardRealtimeTopic(orgId: string, boardId: string) {
  if (orgId.includes(":") || boardId.includes(":")) {
    throw new Error("Realtime identifiers cannot contain colons.");
  }

  return `org:${orgId}:board:${boardId}`;
}
