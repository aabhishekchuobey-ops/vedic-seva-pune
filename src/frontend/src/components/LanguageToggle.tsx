import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { Languages } from "lucide-react";

/**
 * Hindi / English language toggle.
 * Reads and writes the persisted language preference in the Zustand store.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const language = useAppStore((s) => s.language);
  const toggleLanguage = useAppStore((s) => s.toggleLanguage);

  const isHindi = language === "hi";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      data-ocid="language.toggle"
      aria-label={
        isHindi
          ? "Switch to English / अंग्रेज़ी पर स्विच करें"
          : "Switch to Hindi / हिंदी पर स्विच करें"
      }
      aria-pressed={!isHindi}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5",
        "text-sm font-medium text-foreground transition-smooth",
        "hover:border-accent hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Languages className="h-4 w-4 text-accent" aria-hidden="true" />
      <span className="font-body tabular-nums">{isHindi ? "EN" : "हिं"}</span>
    </button>
  );
}
