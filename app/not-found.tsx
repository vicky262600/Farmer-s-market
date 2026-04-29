import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground text-center max-w-sm">That path does not exist on this market site.</p>
      <Button asChild className="mt-8 rounded-full">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
