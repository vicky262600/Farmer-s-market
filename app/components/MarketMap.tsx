"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { stalls, categories, type Stall } from "@/data/market";
import { stallMatchesVendorSearch } from "@/lib/vendor-search";
import { StallModal } from "./StallModal";
import { cn } from "@/lib/utils";

type StallWithDim = Stall & { dim: boolean };

export const MarketMap = () => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<Stall | null>(null);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const filtered = useMemo((): StallWithDim[] => {
    return stalls.map((s) => {
      const matchesQuery = !query.trim() || stallMatchesVendorSearch(s, query);

      const matchesCategory =
        activeFilters.filter((f) => f !== "Deals only").length === 0 ||
        (s.category && activeFilters.includes(s.category));

      const matchesDeals = !activeFilters.includes("Deals only") || s.status === "deal";

      const visible = matchesQuery && matchesCategory && matchesDeals && s.vendor !== null;
      return { ...s, dim: !visible && s.status !== "empty" };
    });
  }, [query, activeFilters]);

  const allFilters = [...categories, "Deals only"];

  return (
    <section id="market-map" className="container py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl font-semibold">The market, today</h2>
        <p className="mt-3 text-muted-foreground">
          Tap any stall to meet the vendor, see what&apos;s fresh, and grab today&apos;s deals.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mt-8 rounded-3xl bg-card shadow-card p-4 md:p-5 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors or products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 rounded-2xl border-border bg-background"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allFilters.map((f) => {
            const active = activeFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium border transition-smooth",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-background border-border text-foreground/80 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <LegendDot color="bg-stall-active" label="Active vendor" />
        <LegendDot color="bg-stall-deal" label="Deals available" />
        <LegendDot color="bg-stall-empty" label="Empty stall" />
      </div>

      {/* Map grid */}
      <div className="mt-6 rounded-3xl bg-secondary/40 p-4 md:p-6 shadow-soft">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((s) => (
            <StallTile key={s.id} stall={s} dim={s.dim} onClick={() => setSelected(s)} />
          ))}
        </div>
      </div>

      <StallModal stall={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-2">
    <span className={cn("h-3 w-3 rounded-full", color)} />
    {label}
  </span>
);

const StallTile = ({ stall, dim, onClick }: { stall: StallWithDim; dim: boolean; onClick: () => void }) => {
  const isEmpty = stall.status === "empty";
  const isDeal = stall.status === "deal";
  const isActive = stall.status === "active";
  const title = stall.brand ?? stall.vendor ?? "Available";
  const titleIsOwnerOnly = Boolean(stall.vendor && !stall.brand);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative aspect-square rounded-2xl p-3 md:p-4 text-left transition-bounce flex flex-col justify-between border",
        isActive && "bg-stall-active text-stall-active-foreground border-transparent shadow-soft hover:-translate-y-1 hover:shadow-lift",
        isDeal && "bg-stall-deal text-stall-deal-foreground border-transparent shadow-soft hover:-translate-y-1 hover:shadow-lift",
        isEmpty && "bg-stall-empty/60 text-stall-empty-foreground border-dashed border-border cursor-pointer",
        dim && "opacity-30"
      )}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider opacity-80">
        <span>Stall {String(stall.id).padStart(2, "0")}</span>
        {isDeal && <Badge className="bg-background/30 text-current border-0 backdrop-blur">Deal</Badge>}
      </div>
      <div>
        <div
          className={cn(
            "font-display text-base md:text-lg font-semibold leading-tight line-clamp-2",
            titleIsOwnerOnly && "italic",
          )}
        >
          {title}
        </div>
        {stall.vendor && stall.brand && stall.brand !== stall.vendor && (
          <div className="mt-0.5 line-clamp-1 text-xs italic opacity-90">{stall.vendor}</div>
        )}
        {stall.category && (
          <div className="mt-1 text-xs opacity-80 line-clamp-1">{stall.category}</div>
        )}
      </div>
    </button>
  );
};
