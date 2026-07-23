import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/utils/constants";
import { Link } from "@tanstack/react-router";
import { Heart, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

/**
 * Floating WhatsApp + Call + Donate buttons fixed to the bottom-right of
 * every page. Visible on all routes so devotees can always reach the pandit
 * or contribute a donation.
 */
export function FloatingActions() {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
      aria-label="Quick contact actions"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="floating.whatsapp"
        aria-label="Chat with the pandit on WhatsApp"
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-flame text-white shadow-lg transition-smooth",
          "hover:scale-105 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "animate-diya-glow",
        )}
      >
        <SiWhatsapp className="h-7 w-7" aria-hidden="true" />
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-card px-3 py-1.5 text-sm font-medium text-foreground opacity-0 shadow-md transition-smooth group-hover:opacity-100">
          WhatsApp पर चैट करें
        </span>
      </a>

      <a
        href="tel:9026828075"
        data-ocid="floating.call"
        aria-label="Call the pandit now"
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg transition-smooth",
          "hover:scale-105 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-card px-3 py-1.5 text-sm font-medium text-foreground opacity-0 shadow-md transition-smooth group-hover:opacity-100">
          अभी कॉल करें
        </span>
      </a>

      <Link
        to="/donate"
        data-ocid="floating.donate"
        aria-label="Make a donation"
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full",
          "bg-accent text-accent-foreground shadow-lg transition-smooth",
          "hover:scale-105 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Heart className="h-6 w-6" aria-hidden="true" />
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-card px-3 py-1.5 text-sm font-medium text-foreground opacity-0 shadow-md transition-smooth group-hover:opacity-100">
          दान करें · Donate
        </span>
      </Link>
    </div>
  );
}
