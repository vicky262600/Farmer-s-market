import { Sprout, MapPin, Clock, Mail, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => (
  <footer className={cn("mt-24 border-t border-border/60 bg-secondary/40", className)}>
    <div className="container py-14 grid gap-10 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-leaf shadow-soft">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-semibold">Farmer&apos;s Market</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A community of growers, makers and neighbours — every Saturday under the old oak.
        </p>
      </div>

      <div>
        <h4 className="font-display text-base mb-3">Market hours</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary" /> Sat 8:00 – 14:00</li>
          <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary" /> Wed 16:00 – 20:00</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-base mb-3">Find us</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> 14 Riverbend Lane, Oakville</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> hello@farmersmarket.local</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-base mb-3">Follow</h4>
        <div className="flex gap-2">
          <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-soft hover:shadow-card transition-smooth hover:-translate-y-0.5">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Facebook" className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-soft hover:shadow-card transition-smooth hover:-translate-y-0.5">
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Farmer&apos;s Market · Grown with care, sold with love.
    </div>
  </footer>
);
