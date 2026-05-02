"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isManagerLoggedIn } from "@/lib/manager-auth";

export function ManagerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const ok = isManagerLoggedIn();
    setAllowed(ok);
    setReady(true);
    if (!ok) router.replace("/manager/login");
  }, [router]);

  useEffect(() => {
    const onAuth = () => {
      if (!isManagerLoggedIn()) router.replace("/manager/login");
    };
    window.addEventListener("fm-manager-auth", onAuth);
    return () => window.removeEventListener("fm-manager-auth", onAuth);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading manager…
      </div>
    );
  }
  if (!allowed) return null;
  return <>{children}</>;
}
