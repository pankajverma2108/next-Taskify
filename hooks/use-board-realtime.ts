"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { boardRealtimeTopic, createClerkSupabaseClient } from "@/lib/supabase/client";

export type BoardRealtimeStatus = "connecting" | "live" | "offline" | "unavailable";

type Options = {
  boardId: string;
  onInvalidate: () => void | Promise<void>;
  orgId: string;
};

export function useBoardRealtime({ boardId, onInvalidate, orgId }: Options) {
  const { isLoaded, isSignedIn, session } = useSession();
  const [connection, setConnection] = useState<{ key: string; status: BoardRealtimeStatus }>({ key: "", status: "connecting" });
  const onInvalidateRef = useRef(onInvalidate);
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const connectionKey = session && orgId ? `${session.id}:${orgId}:${boardId}` : "";
  const canConnect = isLoaded && isSignedIn && !!session && isConfigured;

  useEffect(() => {
    onInvalidateRef.current = onInvalidate;
  }, [onInvalidate]);

  useEffect(() => {
    if (!canConnect || !session) return;

    const supabase = createClerkSupabaseClient(() => session.getToken());
    if (!supabase) return;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let hasSubscribed = false;
    const invalidate = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void onInvalidateRef.current(), 120);
    };

    const channel = supabase
      .channel(boardRealtimeTopic(orgId, boardId), {
        config: { broadcast: { self: false }, private: true },
      })
      .on("broadcast", { event: "INSERT" }, invalidate)
      .on("broadcast", { event: "UPDATE" }, invalidate)
      .on("broadcast", { event: "DELETE" }, invalidate)
      .subscribe(channelStatus => {
        if (channelStatus === "SUBSCRIBED") {
          setConnection({ key: connectionKey, status: "live" });
          if (hasSubscribed) invalidate();
          hasSubscribed = true;
        }
        else if (channelStatus === "CLOSED") setConnection({ key: connectionKey, status: "offline" });
        else if (channelStatus === "CHANNEL_ERROR" || channelStatus === "TIMED_OUT") setConnection({ key: connectionKey, status: "offline" });
      });

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [boardId, canConnect, connectionKey, orgId, session]);

  if (isLoaded && (!isSignedIn || !session || !isConfigured)) return "unavailable";
  if (!isLoaded || connection.key !== connectionKey) return "connecting";
  return connection.status;
}
