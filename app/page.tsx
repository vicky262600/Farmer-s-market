import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FloorMap } from "@/components/FloorMap";
import { Footer } from "@/components/Footer";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { DealsSection } from "@/components/DealsSection";
import { VendorsGrid } from "@/components/VendorsGrid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Hero />
      <FloorMap />
      <AnnouncementsSection />
      <DealsSection />
      <section className="container py-16 md:py-20">
        <div className="max-w-2xl mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Our vendors</h2>
          <p className="mt-3 text-muted-foreground">
            Meet the growers, bakers and makers behind every stall.
          </p>
        </div>
        <VendorsGrid />
      </section>
      <Footer className="mt-0" />
    </div>
  );
}
