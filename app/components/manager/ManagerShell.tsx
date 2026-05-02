"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Megaphone, Store, Tag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setManagerSession } from "@/lib/manager-auth";

const nav = [
  { href: "/manager", label: "Overview", icon: LayoutDashboard },
  { href: "/manager/stalls", label: "Stalls & vendors", icon: Store },
  { href: "/manager/deals", label: "Deals", icon: Tag },
  { href: "/manager/announcements", label: "Announcements", icon: Megaphone },
];

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = () => {
    setManagerSession(false);
    router.push("/manager/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/manager" className="font-display text-lg font-semibold">
              Manager
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {nav.map((item) => {
                const active = item.href === "/manager" ? pathname === "/manager" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-smooth",
                      active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground">
              <Link href="/">View site</Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut className="mr-1 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
      <div className="container py-8">{children}</div>
    </div>
  );
}
