"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  closestVendorStalls,
  stallMatchesVendorSearch,
  suggestNearestToken,
} from "@/lib/vendor-search";
import { useMergedStalls } from "@/hooks/use-merged-market";

export function VendorsGrid({ query: q }: { query: string }) {
  const stalls = useMergedStalls();

  const { vendors, usedFuzzyFallback, suggestion } = useMemo(() => {
    const exact = stalls.filter((s) => s.vendor && stallMatchesVendorSearch(s, q));
    const fuzzy =
      q.trim().length >= 2 && exact.length === 0 ? closestVendorStalls(stalls, q) : [];
    const vendors = exact.length > 0 ? exact : fuzzy;
    const usedFuzzyFallback = exact.length === 0 && fuzzy.length > 0 && q.trim().length >= 2;
    const suggestion =
      usedFuzzyFallback && vendors.length > 0 ? suggestNearestToken(q, stalls) : null;
    return { vendors, usedFuzzyFallback, suggestion };
  }, [stalls, q]);

  return (
    <>
      {q.trim() ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {vendors.length === 0 ? (
            <>
              No vendors match “{q.trim()}” (including close spellings). Try another name, product, or stall number.
            </>
          ) : usedFuzzyFallback ? (
            <>
              No exact match for “{q.trim()}”. Showing the {vendors.length} closest vendor
              {vendors.length === 1 ? "" : "s"} we could find.
              {suggestion ? (
                <span className="mt-1 block text-foreground/90">
                  Did you mean <span className="font-medium text-foreground">{suggestion}</span>?
                </span>
              ) : null}
            </>
          ) : (
            <>
              {vendors.length} vendor{vendors.length === 1 ? "" : "s"} matching “{q.trim()}”.
            </>
          )}
        </p>
      ) : null}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pb-20">
        {vendors.map((v) => (
          <article
            key={v.id}
            className="rounded-3xl bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>Stall {String(v.id).padStart(2, "0")}</span>
              {v.status === "deal" && (
                <Badge className="bg-stall-deal text-stall-deal-foreground border-0">Deals today</Badge>
              )}
            </div>
            <h2 className="mt-2 font-display text-xl font-semibold">{v.brand ?? v.vendor}</h2>
            {v.brand && v.vendor && v.brand !== v.vendor && (
              <p className="text-sm text-muted-foreground">{v.vendor}</p>
            )}
            <div className="mt-1 text-sm text-primary">{v.category}</div>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{v.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {v.sells?.map((p) => (
                <span key={p} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs">
                  {p}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
