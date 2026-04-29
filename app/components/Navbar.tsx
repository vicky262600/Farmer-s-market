"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sprout, Menu, X, Search } from "lucide-react";
import { createContext, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/deals", label: "Today's Deals" },
  { href: "/vendors", label: "Vendors" },
];

const VENDOR_SEARCH_DEBOUNCE_MS = 200;

type NavSearchContextValue = {
  value: string;
  onChange: (next: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const NavSearchContext = createContext<NavSearchContextValue | null>(null);

function NavbarSearchShell({
  searchDraft,
  setSearchDraft,
  onNavigate,
  children,
}: {
  searchDraft: string;
  setSearchDraft: (v: string) => void;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVendors = pathname === "/vendors";
  const qFromUrl = searchParams.get("q") ?? "";

  const [vendorQ, setVendorQ] = useState(qFromUrl);
  const typingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestVendorInputRef = useRef("");

  const flushToUrl = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const href = trimmed ? `/vendors?q=${encodeURIComponent(trimmed)}` : "/vendors";
      router.replace(href, { scroll: false });
      queueMicrotask(() => {
        typingRef.current = false;
      });
    },
    [router],
  );

  useEffect(() => {
    if (!isVendors) return;
    if (typingRef.current) return;
    setVendorQ(qFromUrl);
  }, [isVendors, qFromUrl]);

  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname !== "/vendors") return;
      typingRef.current = false;
      setVendorQ(new URLSearchParams(window.location.search).get("q") ?? "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVendors && debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, [isVendors]);

  const value = isVendors ? vendorQ : searchDraft;

  const onChange = useCallback(
    (next: string) => {
      if (isVendors) {
        typingRef.current = true;
        latestVendorInputRef.current = next;
        setVendorQ(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          debounceRef.current = null;
          flushToUrl(latestVendorInputRef.current);
        }, VENDOR_SEARCH_DEBOUNCE_MS);
      } else {
        setSearchDraft(next);
      }
    },
    [isVendors, flushToUrl, setSearchDraft],
  );

  const onSubmitOffsite = useCallback(() => {
    const trimmed = searchDraft.trim();
    router.push(trimmed ? `/vendors?q=${encodeURIComponent(trimmed)}` : "/vendors");
    setSearchDraft("");
    onNavigate();
  }, [router, searchDraft, setSearchDraft, onNavigate]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isVendors) {
        e.preventDefault();
        onSubmitOffsite();
      }
    },
    [isVendors, onSubmitOffsite],
  );

  const ctx: NavSearchContextValue = { value, onChange, onKeyDown };

  return <NavSearchContext.Provider value={ctx}>{children}</NavSearchContext.Provider>;
}

function NavbarSearchInput({ className }: { className?: string }) {
  const ctx = useContext(NavSearchContext);
  if (!ctx) return null;
  return (
    <div className={cn("relative w-full min-w-0 md:max-w-[220px] lg:max-w-xs", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={ctx.value}
        onChange={(e) => ctx.onChange(e.target.value)}
        onKeyDown={ctx.onKeyDown}
        placeholder="Search vendors, products, stall #…"
        className="h-9 rounded-full border-border/80 bg-muted/40 pl-9 pr-3 text-sm"
        aria-label="Search vendors"
      />
    </div>
  );
}

function NavbarSearch(props: {
  searchDraft: string;
  setSearchDraft: (v: string) => void;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="relative w-full min-w-0 md:max-w-[220px] lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            disabled
            placeholder="Search vendors…"
            className="h-9 rounded-full border-border/80 bg-muted/40 pl-9 pr-3 text-sm"
            aria-label="Search vendors"
          />
        </div>
      }
    >
      <NavbarSearchShell
        searchDraft={props.searchDraft}
        setSearchDraft={props.setSearchDraft}
        onNavigate={props.onNavigate}
      >
        {props.children}
      </NavbarSearchShell>
    </Suspense>
  );
}

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const pathname = usePathname();

  return (
    <NavbarSearch searchDraft={searchDraft} setSearchDraft={setSearchDraft} onNavigate={() => setOpen(false)}>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
        <div className="container flex h-16 flex-wrap items-center gap-3 md:flex-nowrap md:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:gap-4">
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 group" onClick={() => setOpen(false)}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-leaf shadow-soft transition-bounce group-hover:scale-105">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display truncate text-xl font-semibold text-foreground">Farmer&apos;s Market</span>
            </Link>
            <NavbarSearchInput className="hidden min-w-0 flex-1 md:block md:max-w-none" />
          </div>

          <nav className="hidden md:flex shrink-0 items-center gap-1">
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
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-smooth md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 bg-background animate-fade-in-up">
            <div className="container flex flex-col gap-3 py-4">
              <NavbarSearchInput />
              <div className="flex flex-col gap-1">
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
          </div>
        )}
      </header>
    </NavbarSearch>
  );
};
