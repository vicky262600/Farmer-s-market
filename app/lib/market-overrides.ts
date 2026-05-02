import type { Announcement } from "@/data/market";
import type { Stall } from "@/data/market";

export const STORAGE_STALLS = "fm-stall-overrides";
export const STORAGE_ANNOUNCEMENTS = "fm-announcements";

export type StallPatch = Partial<
  Pick<Stall, "vendor" | "brand" | "category" | "sells" | "highlights" | "status" | "description">
>;

export function parseStallOverrides(): Record<number, StallPatch> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_STALLS);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, StallPatch>;
    const out: Record<number, StallPatch> = {};
    for (const [k, v] of Object.entries(o)) {
      const id = Number(k);
      if (!Number.isNaN(id)) out[id] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveStallOverrides(overrides: Record<number, StallPatch>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_STALLS, JSON.stringify(overrides));
  window.dispatchEvent(new CustomEvent("fm-market-updated"));
}

export function mergeStalls(base: Stall[], overrides: Record<number, StallPatch>): Stall[] {
  return base.map((s) => {
    const p = overrides[s.id];
    if (!p) return s;
    return { ...s, ...p };
  });
}

export function parseAnnouncementsOverride(): Announcement[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_ANNOUNCEMENTS);
    if (!raw) return null;
    const list = JSON.parse(raw) as Announcement[];
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

export function saveAnnouncementsOverride(list: Announcement[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_ANNOUNCEMENTS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("fm-market-updated"));
}
