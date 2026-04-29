import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FloorMap } from "@/components/FloorMap";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Hero />
      <FloorMap />
      <Footer className="mt-0" />
    </div>
  );
}
