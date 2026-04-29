import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { stalls } from "@/data/market";
import {
  closestVendorStalls,
  stallMatchesVendorSearch,
  suggestNearestToken,
} from "@/lib/vendor-search";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function VendorsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.q;
  const q = typeof raw === "string" ? raw : Array.isArray(raw) ? (raw[0] ?? "") : "";
  const exact = stalls.filter((s) => s.vendor && stallMatchesVendorSearch(s, q));
  const fuzzy =
    q.trim().length >= 2 && exact.length === 0 ? closestVendorStalls(stalls, q) : [];
  const vendors = exact.length > 0 ? exact : fuzzy;
  const usedFuzzyFallback = exact.length === 0 && fuzzy.length > 0 && q.trim().length >= 2;
  const suggestion =
    usedFuzzyFallback && vendors.length > 0 ? suggestNearestToken(q, stalls) : null;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-10">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-semibold">Our vendors</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Meet the growers, bakers and makers behind every stall.</p>

          {q.trim() && (
            <p className="mt-4 text-sm text-muted-foreground">
              {vendors.length === 0 ? (
                <>
                  No vendors match “{q.trim()}” (including close spellings). Try another name, product, or stall
                  number.
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
          )}

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
        </div>
      </main>
      <Footer />
    </div>
  );
}
