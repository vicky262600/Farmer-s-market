"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Stall } from "@/data/market";
import { useMergedStalls } from "@/hooks/use-merged-market";
import { parseStallOverrides, saveStallOverrides, type StallPatch } from "@/lib/market-overrides";

export default function ManagerDealsPage() {
  const merged = useMergedStalls();

  const saveRow = (stall: Stall, status: Stall["status"], hlName: string, hlPrice: string, hlOld: string) => {
    const highlights =
      hlName.trim() || hlPrice.trim()
        ? [{ name: hlName.trim() || "Special", price: hlPrice.trim() || "—", ...(hlOld.trim() ? { oldPrice: hlOld.trim() } : {}) }]
        : stall.highlights;

    const patch: StallPatch = {
      status,
      highlights: highlights?.length ? highlights : stall.highlights,
    };

    if (status === "deal" && !(patch.highlights?.length ?? 0)) {
      toast.error(`Stall ${stall.id}: add a price line (or edit in Stalls) before marking as deal.`);
      return;
    }

    const all = parseStallOverrides();
    all[stall.id] = { ...all[stall.id], ...patch };
    saveStallOverrides(all);
    toast.success(`Stall ${String(stall.id).padStart(2, "0")} updated`);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Deals</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Toggle deal status and adjust the primary offer line. Vendors with no name can still be edited under Stalls.
      </p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Stall</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Offer</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Was</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {merged.map((s) => (
              <DealRow key={s.id} stall={s} onSave={saveRow} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DealRow({
  stall,
  onSave,
}: {
  stall: Stall;
  onSave: (s: Stall, status: Stall["status"], n: string, p: string, o: string) => void;
}) {
  const h = stall.highlights?.[0];
  const [status, setStatus] = useState(stall.status);
  const [n, setN] = useState(h?.name ?? "");
  const [p, setP] = useState(h?.price ?? "");
  const [o, setO] = useState(h?.oldPrice ?? "");

  useEffect(() => {
    setStatus(stall.status);
    const hi = stall.highlights?.[0];
    setN(hi?.name ?? "");
    setP(hi?.price ?? "");
    setO(hi?.oldPrice ?? "");
  }, [stall]);

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3 font-mono text-xs">#{String(stall.id).padStart(2, "0")}</td>
      <td className="max-w-[140px] truncate px-4 py-3">{stall.vendor ?? "—"}</td>
      <td className="px-4 py-3">
        <Select value={status} onValueChange={(v) => setStatus(v as Stall["status"])}>
          <SelectTrigger className="h-9 w-[120px] rounded-lg text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deal">Deal</SelectItem>
            <SelectItem value="empty">Empty</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-2">
        <Input value={n} onChange={(e) => setN(e.target.value)} className="h-9 rounded-lg text-xs" placeholder="Label" />
      </td>
      <td className="px-4 py-2">
        <Input value={p} onChange={(e) => setP(e.target.value)} className="h-9 rounded-lg text-xs" placeholder="$0" />
      </td>
      <td className="px-4 py-2">
        <Input value={o} onChange={(e) => setO(e.target.value)} className="h-9 rounded-lg text-xs" placeholder="Optional" />
      </td>
      <td className="px-4 py-2">
        <Button type="button" size="sm" variant="secondary" className="rounded-full text-xs" onClick={() => onSave(stall, status, n, p, o)}>
          Save
        </Button>
      </td>
    </tr>
  );
}
