import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { stalls } from "@/data/market";
import { Badge } from "@/components/ui/badge";

export default function VendorsPage() {
  const vendors = stalls.filter((s) => s.vendor);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-10">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-semibold">Our vendors</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Meet the growers, bakers and makers behind every stall.</p>

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
