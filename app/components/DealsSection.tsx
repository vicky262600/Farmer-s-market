import { stalls } from "@/data/market";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export const DealsSection = () => {
  const deals = stalls.filter((s) => s.status === "deal" && s.highlights?.length);
  return (
    <section id="deals" className="bg-secondary/40 py-20">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Today&apos;s deals</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked savings, only good &apos;til close.</p>
          </div>
        </div>

        <div className="-mx-6 px-6 overflow-x-auto pb-4">
          <div className="flex gap-5 min-w-max">
            {deals.map((s) => {
              const h = s.highlights![0];
              return (
                <article
                  key={s.id}
                  className="w-72 shrink-0 rounded-3xl bg-card shadow-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-lift"
                >
                  <Badge className="rounded-full bg-stall-deal text-stall-deal-foreground border-0 mb-3">
                    <Clock className="mr-1 h-3 w-3" /> Limited time
                  </Badge>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Stall {String(s.id).padStart(2, "0")} · {s.vendor}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">{h.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold text-primary">{h.price}</span>
                    {h.oldPrice && <s className="text-muted-foreground">{h.oldPrice}</s>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
