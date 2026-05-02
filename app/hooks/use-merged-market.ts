"use client";

import { useCallback, useEffect, useState } from "react";
import { announcements as baseAnnouncements, stalls as baseStalls, type Announcement } from "@/data/market";
import type { Stall } from "@/data/market";
import {
  mergeStalls,
  parseAnnouncementsOverride,
  parseStallOverrides,
} from "@/lib/market-overrides";

function useStorageRefresh(callback: () => void) {
  useEffect(() => {
    callback();
    const on = () => callback();
    window.addEventListener("fm-market-updated", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("fm-market-updated", on);
      window.removeEventListener("storage", on);
    };
  }, [callback]);
}

export function useMergedStalls(): Stall[] {
  const [list, setList] = useState<Stall[]>(baseStalls);
  const refresh = useCallback(() => {
    setList(mergeStalls(baseStalls, parseStallOverrides()));
  }, []);
  useStorageRefresh(refresh);
  return list;
}

export function useMergedAnnouncements(): Announcement[] {
  const [list, setList] = useState<Announcement[]>(baseAnnouncements);
  const refresh = useCallback(() => {
    setList(parseAnnouncementsOverride() ?? baseAnnouncements);
  }, []);
  useStorageRefresh(refresh);
  return list;
}
