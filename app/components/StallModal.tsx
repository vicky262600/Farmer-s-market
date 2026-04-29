"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tag } from "lucide-react";
import type { Stall } from "@/data/market";
import { cn } from "@/lib/utils";

export const StallModal = ({ stall, onClose }: { stall: Stall | null; onClose: () => void }) => (
  <Dialog open={!!stall} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="rounded-3xl max-w-lg">
      {stall && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="rounded-full">Stall {String(stall.id).padStart(2, "0")}</Badge>
              {stall.status === "deal" && (
                <Badge className="rounded-full bg-stall-deal text-stall-deal-foreground border-0">
                  <Sparkles className="mr-1 h-3 w-3" /> Today&apos;s deals
                </Badge>
              )}
            </div>
            <DialogTitle
              className={cn(
                "font-display text-2xl",
                stall.vendor && !stall.brand && "italic",
              )}
            >
              {stall.brand ?? stall.vendor ?? "Available stall"}
            </DialogTitle>
            {stall.vendor && stall.brand && stall.brand !== stall.vendor && (
              <p className="text-sm text-muted-foreground">
                Run by <span className="italic text-foreground/80">{stall.vendor}</span>
              </p>
            )}
            <DialogDescription className="text-base text-foreground/70">
              {stall.description}
            </DialogDescription>
          </DialogHeader>

          {stall.sells && (
            <div className="mt-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">What they sell</div>
              <div className="flex flex-wrap gap-1.5">
                {stall.sells.map((p) => (
                  <span key={p} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm">{p}</span>
                ))}
              </div>
            </div>
          )}

          {stall.highlights && (
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Price highlights</div>
              <ul className="space-y-2">
                {stall.highlights.map((h) => (
                  <li key={h.name} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                    <span className="font-medium">{h.name}</span>
                    <span className="flex items-center gap-2">
                      {h.oldPrice && <s className="text-sm text-muted-foreground">{h.oldPrice}</s>}
                      <span className="font-display text-lg font-semibold text-primary">{h.price}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stall.status === "deal" && (
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-stall-deal/15 text-stall-deal-foreground px-4 py-3 text-sm">
              <Tag className="h-4 w-4" /> Limited-time deal — while stocks last today only.
            </div>
          )}
        </>
      )}
    </DialogContent>
  </Dialog>
);
