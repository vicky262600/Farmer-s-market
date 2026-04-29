import { announcements } from "@/data/market";
import { CalendarDays } from "lucide-react";

export const AnnouncementsSection = () => (
  <section className="container py-20">
    <div className="max-w-2xl mb-8">
      <h2 className="font-display text-3xl md:text-4xl font-semibold">What&apos;s happening</h2>
      <p className="mt-2 text-muted-foreground">Live music, tastings, workshops — there&apos;s always something on.</p>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {announcements.map((a) => (
        <article
          key={a.id}
          className="rounded-3xl bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <CalendarDays className="h-4 w-4" /> {a.time}
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">{a.title}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{a.body}</p>
        </article>
      ))}
    </div>
  </section>
);
