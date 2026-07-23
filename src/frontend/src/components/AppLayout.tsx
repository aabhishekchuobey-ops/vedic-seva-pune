import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import type React from "react";
import { useIsCallerAdmin } from "../hooks/useQueries";
import { useAppStore } from "../stores/useAppStore";
import {
  CALL_URL,
  CONTACT_PHONE,
  NAV_ITEMS,
  PANDIT_NAME,
  SANKALP,
  SERVICE_AREAS,
  SOCIAL_LINKS,
  TAGLINE,
} from "../utils/constants";
import { FloatingActions } from "./FloatingActions";
import { LanguageToggle } from "./LanguageToggle";

/**
 * App shell for the priest services site.
 * Header (pandit name, tagline, language toggle, nav) + footer
 * (contact phone, service areas, social links, sankalp) + floating actions.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <Header t={t} />
      <main className="flex-1 bg-background">{children}</main>
      <Footer t={t} />
      <FloatingActions />
    </div>
  );
}

interface HeaderProps {
  t: (hi: string, en: string) => string;
}

function Header({ t }: HeaderProps) {
  const { location } = useRouterState();
  const { data: isAdmin } = useIsCallerAdmin();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const visibleNav = NAV_ITEMS.filter((item) =>
    item.adminOnly ? Boolean(isAdmin) : true,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      {/* Top accent strip — saffron to gold */}
      <div className="h-1 w-full bg-gradient-flame" aria-hidden="true" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Brand */}
          <Link
            to="/"
            data-ocid="nav.brand"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred"
              aria-hidden="true"
            >
              <span className="font-display text-xl font-semibold leading-none text-white">
                ॐ
              </span>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-primary">
                {PANDIT_NAME.hi}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                {t(TAGLINE.hi, TAGLINE.en)}
              </span>
            </span>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Primary navigation */}
        <nav
          aria-label={t("मुख्य नेविगेशन", "Primary navigation")}
          className="flex items-center gap-1 overflow-x-auto pb-2"
        >
          {visibleNav.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={`nav.${item.to.replace("/", "") || "home"}`}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-smooth",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted hover:text-primary",
                )}
              >
                {t(item.label.hi, item.label.en)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

interface FooterProps {
  t: (hi: string, en: string) => string;
}

function Footer({ t }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "priest-site",
  )}`;

  return (
    <footer className="border-t border-border bg-card">
      <div className="h-1 w-full bg-gradient-flame" aria-hidden="true" />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Sankalp + contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold text-primary">
              {t("संकल्प", "Sankalp")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(SANKALP.hi, SANKALP.en)}
            </p>
            <a
              href={CALL_URL}
              data-ocid="footer.call"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-flame px-4 py-2 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
            >
              📞 {CONTACT_PHONE}
            </a>
            <Link
              to="/donate"
              data-ocid="footer.donate"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-smooth hover:bg-accent/20"
            >
              🪷 {t("दान करें", "Make a Donation")}
            </Link>
          </div>

          {/* Service areas */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold text-primary">
              {t("सेवा क्षेत्र", "Service Areas")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold text-primary">
              {t("संपर्क बनाएँ", "Connect")}
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`footer.social.${link.name.toLowerCase()}`}
                    className="text-muted-foreground transition-smooth hover:text-accent hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>
            © {currentYear} {PANDIT_NAME.en}.{" "}
            {t("सर्वाधिकार सुरक्षित।", "All rights reserved.")}
          </p>
          <p className="mt-1">
            {t("प्रेम से बनाया गया", "Built with love using")}{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
