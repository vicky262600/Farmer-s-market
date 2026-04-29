import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";

const HERO_IMAGE = "/471974470_581027661555876_1107480301316284348_n.jpg";

export const Hero = () => (
  <section className="relative flex flex-1 flex-col overflow-hidden min-h-[480px] md:min-h-[560px]">
    <div className="absolute inset-0">
      <Image
        src={HERO_IMAGE}
        alt="A vibrant outdoor farmer's market with colorful produce"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
    </div>

    <div className="relative container py-24 md:py-36 max-w-3xl text-[oklch(0.98_0.01_95)] animate-fade-in-up">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/20 backdrop-blur px-4 py-1.5 text-sm font-medium border border-white/25">
        <Leaf className="h-4 w-4" /> Open every Saturday & Wednesday
      </span>
      <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-[1.05]">
        Welcome to your <em className="not-italic text-[oklch(0.82_0.1_78)]">local</em> farmer&apos;s market
      </h1>
      <p className="mt-5 text-lg md:text-xl text-[oklch(0.98_0.01_95_/_0.9)] max-w-xl">
        Find fresh produce, meet local vendors, and discover today&apos;s best deals — all under one open sky.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-[oklch(0.82_0.1_78)] text-[oklch(0.3_0.045_55)] hover:bg-[oklch(0.82_0.1_78_/_0.9)] shadow-lift"
        >
          <Link href="/vendors">
            Explore vendors <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full border-white/40 bg-white/10 text-[oklch(0.98_0.01_95)] hover:bg-white/20 hover:text-[oklch(0.98_0.01_95)]"
        >
          <Link href="/deals">View today&apos;s deals</Link>
        </Button>
      </div>
    </div>
  </section>
);
