"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getExpectedManagerPassword, isManagerLoggedIn, setManagerSession } from "@/lib/manager-auth";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isManagerLoggedIn()) router.replace("/manager");
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === getExpectedManagerPassword()) {
      setManagerSession(true);
      router.push("/manager");
      router.refresh();
    } else {
      setError("That password is not correct.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/60 bg-background/90 px-4 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold hover:opacity-80">
            SVFM
          </Link>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/">Back to site</Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl font-semibold">Manager sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Changes are saved in this browser only (local demo). Default password is{" "}
            <span className="font-mono text-foreground">market</span> unless{" "}
            <code className="rounded bg-muted px-1 text-xs">NEXT_PUBLIC_MANAGER_PASSWORD</code> is set.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mgr-password">Password</Label>
              <Input
                id="mgr-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full rounded-full">
              Sign in
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
