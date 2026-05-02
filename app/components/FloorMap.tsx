"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MARKET_GRID, isAisleCell, type Stall } from "@/data/market";
import { useMergedStalls } from "@/hooks/use-merged-market";
import { StallModal } from "@/components/StallModal";
import { cn } from "@/lib/utils";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.45;
const ZOOM_STEP = 0.12;
const BASE_CELL_REM = 8.4;

/** One continuous walkway: no gaps, flat fill, sharp corners. */
const AISLE_TILE_CLASS =
  "relative z-0 min-h-0 h-full w-full rounded-none bg-[oklch(0.86_0.028_88)]";

function pinchDistance(touches: TouchList) {
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(value.toFixed(3))));
}

export function FloorMap() {
  const stalls = useMergedStalls();
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<Stall | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const pinchRef = useRef<{ d0: number; z0: number } | null>(null);

  const centerHorizontalScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) {
      el.scrollLeft = 0;
      return;
    }
    el.scrollLeft = max / 2;
  }, []);

  useLayoutEffect(() => {
    centerHorizontalScroll();
    const id = requestAnimationFrame(() => centerHorizontalScroll());
    return () => cancelAnimationFrame(id);
  }, [centerHorizontalScroll, stalls]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => centerHorizontalScroll());
    ro.observe(el);
    const inner = el.firstElementChild;
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, [centerHorizontalScroll]);

  useEffect(() => {
    const onResize = () => centerHorizontalScroll();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerHorizontalScroll]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = { d0: pinchDistance(e.touches), z0: zoomRef.current };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const { d0, z0 } = pinchRef.current;
        const d = pinchDistance(e.touches);
        if (d0 < 1) return;
        setZoom(clampZoom(z0 * (d / d0)));
      }
    };

    const onTouchEndOrCancel = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchRef.current = null;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEndOrCancel, { passive: true });
    el.addEventListener("touchcancel", onTouchEndOrCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEndOrCancel);
      el.removeEventListener("touchcancel", onTouchEndOrCancel);
    };
  }, []);

  const byCell = useMemo(() => {
    const m = new Map<string, Stall>();
    stalls.forEach((s) => m.set(`${s.mapRow}-${s.mapCol}`, s));
    return m;
  }, [stalls]);

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
    <section
      id="market-map"
      className="border-b border-border/60 bg-muted py-16 pb-10 md:py-20 md:pb-12"
    >
      <div className="container">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Market map</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            L-shaped aisle with vendors on both sides — tap a stall for the operator, sign name, and what they sell.
            Pinch with two fingers on the map to zoom (or use the buttons).
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
        className="mt-8 max-h-[min(78vh,880px)] overflow-auto rounded-3xl border border-border/80 bg-background/80 p-3 shadow-card md:p-5 touch-pan-x touch-pan-y"
      >
        <div className="flex w-max min-w-full justify-center">
        <div
          className="inline-grid origin-top-left gap-0"
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
                  <div key={stall.id} className="flex min-h-0 min-w-0 p-px">
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
                  className="m-0.5 min-h-[2rem] rounded-md border-0 bg-transparent"
                  aria-hidden
                />
              );
            }),
          ).flat()}
        </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground md:mt-4 md:gap-4 md:text-sm">
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
      </div>
    </section>
  );
}

function FloorStall({ stall, onSelect }: { stall: Stall; onSelect: () => void }) {
  const empty = stall.status === "empty";
  const deal = stall.status === "deal";
  const title = stall.brand ?? stall.vendor ?? "Available";
  /** Headline is the owner only when there is no separate trading name */
  const titleIsOwnerOnly = Boolean(stall.vendor && !stall.brand);
  const sellsLine = stall.sells?.slice(0, 4).join(" · ") ?? "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border-0 p-1.5 text-left outline-none ring-0 transition-smooth focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-2",
        !empty &&
          !deal &&
          "bg-stall-active text-stall-active-foreground shadow-none hover:-translate-y-0.5 hover:shadow-none",
        deal && "bg-stall-deal text-stall-deal-foreground shadow-none hover:-translate-y-0.5 hover:shadow-none",
        empty && "cursor-pointer bg-stall-empty/50 text-stall-empty-foreground hover:bg-stall-empty/70",
      )}
    >
      <div className="flex items-start justify-between gap-0.5">
        <span className="font-mono text-[0.9375rem] font-semibold leading-none opacity-80 sm:text-base">#{stall.id}</span>
        {deal && !empty && (
          <Badge className="flex h-[1.125rem] shrink-0 items-center border-0 bg-background/25 px-1.5 text-[0.65rem] leading-none text-current sm:h-5 sm:px-2 sm:text-xs">
            Deal
          </Badge>
        )}
      </div>
      <div className="mt-0.5 min-w-0 flex-1">
        <div
          className={cn(
            "font-display text-lg font-semibold leading-tight tracking-tight line-clamp-2 sm:text-xl",
            titleIsOwnerOnly && "italic",
          )}
        >
          {title}
        </div>
        {stall.vendor && stall.brand && stall.brand !== stall.vendor && (
          <div className="mt-0.5 line-clamp-1 text-base italic leading-tight opacity-85 sm:text-lg">{stall.vendor}</div>
        )}
        {sellsLine && (
          <div className="mt-0.5 line-clamp-2 text-base leading-tight opacity-90 sm:text-lg">{sellsLine}</div>
        )}
      </div>
    </button>
  );
}
