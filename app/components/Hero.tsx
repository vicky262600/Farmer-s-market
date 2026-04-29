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

    <div className="relative container py-24 md:py-36 max-w-3xl text-primary-foreground animate-fade-in-up">
      <span className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur px-4 py-1.5 text-sm font-medium border border-primary-foreground/20">
        <Leaf className="h-4 w-4" /> Open every Saturday & Wednesday
      </span>
      <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-[1.05]">
        Welcome to your <em className="not-italic text-accent">local</em> farmer&apos;s market
      </h1>
      <p className="mt-5 text-lg md:text-xl text-primary-foreground/90 max-w-xl">
        Find fresh produce, meet local vendors, and discover today&apos;s best deals — all under one open sky.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lift">
          <Link href="/vendors">
            Explore vendors <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full bg-background/10 border-primary-foreground/40 text-primary-foreground hover:bg-background/20 hover:text-primary-foreground"
        >
          <Link href="/deals">View today&apos;s deals</Link>
        </Button>
      </div>
    </div>
  </section>
);
