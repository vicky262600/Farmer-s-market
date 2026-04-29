import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-10">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-semibold">Announcements</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Events, tastings, and updates from the market.</p>
        </div>
        <AnnouncementsSection />
      </main>
      <Footer />
    </div>
  );
}
