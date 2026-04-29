import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function ManagerLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-16 max-w-md">
        <h1 className="font-display text-3xl font-semibold">Manager login</h1>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          Stall manager tools are not wired up in this demo. Check back later, or return to the public site.
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
