import Link from "next/link";
import { LayoutDashboard, Megaphone, Store, Tag } from "lucide-react";

const cards = [
  {
    href: "/manager/stalls",
    title: "Stalls & vendors",
    body: "Edit vendor names, brands, categories, products, and stall copy.",
    icon: Store,
  },
  {
    href: "/manager/deals",
    title: "Deals",
    body: "Mark stalls as deal day and set the headline price line shoppers see.",
    icon: Tag,
  },
  {
    href: "/manager/announcements",
    title: "Announcements",
    body: "Post what’s on at the market — music, tastings, closures.",
    icon: Megaphone,
  },
];

export default function ManagerHomePage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold">Market manager</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Updates apply on the public site in this browser only. Nothing is sent to a server.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                <span className="mt-4 text-sm font-medium text-primary">Open →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
