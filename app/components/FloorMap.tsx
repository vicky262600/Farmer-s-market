"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stalls, MARKET_GRID, isAisleCell, type Stall } from "@/data/market";
import { StallModal } from "@/components/StallModal";
import { cn } from "@/lib/utils";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.45;
const ZOOM_STEP = 0.12;
const BASE_CELL_REM = 8.4;

/** One continuous walkway: no gaps, flat fill, sharp corners. */
const AISLE_TILE_CLASS =
  "relative z-0 min-h-0 h-full w-full rounded-none bg-[oklch(0.86_0.028_88)]";

export function FloorMap() {
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<Stall | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const byCell = useMemo(() => {
    const m = new Map<string, Stall>();
    stalls.forEach((s) => m.set(`${s.mapRow}-${s.mapCol}`, s));
    return m;
  }, []);

  const changeZoom = useCallback((direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setZoom((prev) => {
        const next = prev + direction * ZOOM_STEP;
        return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(next.toFixed(2))));
      });
      return;
    }

    const prevZoom = zoom;
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number((zoom + direction * ZOOM_STEP).toFixed(2))));
    if (next === prevZoom) return;

    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    const ratio = next / prevZoom;

    setZoom(next);

    requestAnimationFrame(() => {
      viewport.scrollLeft = centerX * ratio - viewport.clientWidth / 2;
      viewport.scrollTop = centerY * ratio - viewport.clientHeight / 2;
    });
  }, [zoom]);

  return (
    <section id="market-map" className="container py-16 md:py-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Market map</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            L-shaped aisle with vendors on both sides — tap a stall for the operator, sign name, and what they sell.
            Zoom to fit your screen.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => changeZoom(-1)}
            aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => changeZoom(1)}
            aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mt-8 max-h-[min(78vh,880px)] overflow-auto rounded-3xl border border-border/80 bg-[oklch(0.93_0.02_88/0.5)] p-3 shadow-card md:p-5 touch-pan-x touch-pan-y"
      >
        <div
          className="mx-auto inline-grid origin-top-left gap-0"
          style={{
            transform: `scale(${zoom})`,
            gridTemplateRows: `repeat(${MARKET_GRID.rows}, minmax(${BASE_CELL_REM}rem, auto))`,
            gridTemplateColumns: `repeat(${MARKET_GRID.cols}, minmax(${BASE_CELL_REM}rem, 1fr))`,
          }}
        >
          {Array.from({ length: MARKET_GRID.rows }, (_, ri) =>
            Array.from({ length: MARKET_GRID.cols }, (_, ci) => {
              const row = ri + 1;
              const col = ci + 1;
              const stall = byCell.get(`${row}-${col}`);
              if (stall) {
                return (
                  <div key={stall.id} className="flex min-h-0 min-w-0 p-0.5">
                    <FloorStall stall={stall} onSelect={() => setSelected(stall)} />
                  </div>
                );
              }
              if (isAisleCell(row, col)) {
                return (
                  <div
                    key={`aisle-${row}-${col}`}
                    className={AISLE_TILE_CLASS}
                    aria-label="Aisle"
                  />
                );
              }
              return (
                <div
                  key={`plaza-${row}-${col}`}
                  className="m-0.5 min-h-[2rem] rounded-md border border-dashed border-border/20 bg-background/20"
                  aria-hidden
                />
              );
            }),
          ).flat()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground md:text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-stall-active" /> Open vendor
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-stall-deal" /> Deal today
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-border bg-stall-empty/50" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-none bg-[oklch(0.86_0.028_88)]" /> Aisle
        </span>
      </div>

      <StallModal stall={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function FloorStall({ stall, onSelect }: { stall: Stall; onSelect: () => void }) {
  const empty = stall.status === "empty";
  const deal = stall.status === "deal";
  const title = stall.brand ?? stall.vendor ?? "Available";
  const sellsLine = stall.sells?.slice(0, 4).join(" · ") ?? "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border p-1.5 text-left transition-smooth sm:p-2",
        !empty &&
          !deal &&
          "border-transparent bg-stall-active text-stall-active-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-lift",
        deal && "border-transparent bg-stall-deal text-stall-deal-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-lift",
        empty && "cursor-pointer border-dashed border-border bg-stall-empty/50 text-stall-empty-foreground hover:bg-stall-empty/70",
      )}
    >
      <div className="flex items-start justify-between gap-0.5">
        <span className="font-mono text-[0.68rem] font-semibold opacity-80 sm:text-xs">#{stall.id}</span>
        {deal && !empty && (
          <Badge className="h-4 shrink-0 border-0 bg-background/25 px-1.5 text-[0.62rem] text-current">Deal</Badge>
        )}
      </div>
      <div className="mt-0.5 min-w-0 flex-1">
        <div className="font-display text-[0.8rem] font-semibold leading-tight tracking-tight sm:text-sm">{title}</div>
        {stall.vendor && stall.brand && stall.brand !== stall.vendor && (
          <div className="mt-0.5 line-clamp-1 text-[0.68rem] opacity-85 sm:text-xs">{stall.vendor}</div>
        )}
        {sellsLine && (
          <div className="mt-1 line-clamp-2 text-[0.66rem] opacity-90 leading-snug sm:text-[0.74rem]">{sellsLine}</div>
        )}
      </div>
    </button>
  );
}
