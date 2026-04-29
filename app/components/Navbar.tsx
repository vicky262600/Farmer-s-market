"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/deals", label: "Today's Deals" },
  { href: "/vendors", label: "Vendors" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-leaf shadow-soft transition-bounce group-hover:scale-105">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-semibold text-foreground">Farmer&apos;s Market</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                  active ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Button asChild variant="default" size="sm" className="ml-2 rounded-full">
            <Link href="/manager/login">Manager Login</Link>
          </Button>
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-smooth"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-in-up">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-smooth",
                    active ? "bg-secondary text-secondary-foreground" : "text-foreground/80 hover:bg-muted",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 rounded-full" onClick={() => setOpen(false)}>
              <Link href="/manager/login">Manager Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
