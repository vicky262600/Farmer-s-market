"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, type Category, type Stall } from "@/data/market";
import { useMergedStalls } from "@/hooks/use-merged-market";
import { parseStallOverrides, saveStallOverrides, type StallPatch } from "@/lib/market-overrides";

export default function ManagerStallsPage() {
  const merged = useMergedStalls();
  const [stallId, setStallId] = useState(String(merged[0]?.id ?? 1));

  const stall = useMemo(() => merged.find((s) => String(s.id) === stallId) ?? merged[0], [merged, stallId]);

  const [vendor, setVendor] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [status, setStatus] = useState<Stall["status"]>("active");
  const [description, setDescription] = useState("");
  const [sellsText, setSellsText] = useState("");
  const [hlName, setHlName] = useState("");
  const [hlPrice, setHlPrice] = useState("");
  const [hlOld, setHlOld] = useState("");

  useEffect(() => {
    if (!stall) return;
    setVendor(stall.vendor ?? "");
    setBrand(stall.brand ?? "");
    setCategory(stall.category ?? "");
    setStatus(stall.status);
    setDescription(stall.description ?? "");
    setSellsText((stall.sells ?? []).join("\n"));
    const h = stall.highlights?.[0];
    setHlName(h?.name ?? "");
    setHlPrice(h?.price ?? "");
    setHlOld(h?.oldPrice ?? "");
  }, [stall]);

  const save = () => {
    if (!stall) return;
    const sells = sellsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const highlights =
      hlName.trim() || hlPrice.trim()
        ? [{ name: hlName.trim() || "Special", price: hlPrice.trim() || "—", ...(hlOld.trim() ? { oldPrice: hlOld.trim() } : {}) }]
        : [];

    const patch: StallPatch = {
      vendor: vendor.trim() ? vendor.trim() : null,
      brand: brand.trim() ? brand.trim() : null,
      ...(category ? { category: category as Category } : {}),
      status,
      description: description.trim(),
      sells,
      highlights,
    };

    const all = parseStallOverrides();
    all[stall.id] = { ...all[stall.id], ...patch };
    saveStallOverrides(all);
    toast.success(`Stall ${String(stall.id).padStart(2, "0")} saved`);
  };

  if (!stall) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Stalls & vendors</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a stall, edit fields, then save. Empty vendor clears the operator name for empty stalls.
      </p>

      <div className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-2">
          <Label>Stall</Label>
          <Select value={stallId} onValueChange={setStallId}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {merged.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  #{String(s.id).padStart(2, "0")} — {s.brand ?? s.vendor ?? "Empty"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor / operator</Label>
            <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand (sign name)</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-xl" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category || "__none"} onValueChange={(v) => setCategory(v === "__none" ? "" : (v as Category))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Stall["status"])}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deal">Deal today</SelectItem>
                <SelectItem value="empty">Empty / available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sells">What they sell (one per line)</Label>
          <Textarea id="sells" rows={4} value={sellsText} onChange={(e) => setSellsText(e.target.value)} className="rounded-xl font-mono text-sm" />
        </div>

        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Primary price line</p>
          <p className="mt-1 text-xs text-muted-foreground">Shown on deals strip and stall cards when set.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="hlN" className="text-xs">
                Label
              </Label>
              <Input id="hlN" value={hlName} onChange={(e) => setHlName(e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hlP" className="text-xs">
                Price
              </Label>
              <Input id="hlP" value={hlPrice} onChange={(e) => setHlPrice(e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hlO" className="text-xs">
                Was (optional)
              </Label>
              <Input id="hlO" value={hlOld} onChange={(e) => setHlOld(e.target.value)} className="rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <Button type="button" className="rounded-full" onClick={save}>
          Save stall
        </Button>
      </div>
    </div>
  );
}
