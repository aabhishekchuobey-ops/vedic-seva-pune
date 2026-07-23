import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/stores/useAppStore";
import { CONTACT_PHONE, SERVICE_CATEGORY_LABELS } from "@/utils/constants";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_MOTIFS,
  SERVICE_CATALOGUE,
} from "@/utils/service-content";
import type { ServiceCategoryValue } from "@/utils/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";

const VALID_CATEGORIES: ServiceCategoryValue[] = [
  "vedicPujaHavan",
  "grahaDoshShanti",
  "jeevanSamskar",
  "jyotishServices",
];

function isCategory(value: string): value is ServiceCategoryValue {
  return (VALID_CATEGORIES as string[]).includes(value);
}

/**
 * Service detail page — lists the specific pujas/rituals within a category
 * with brief descriptions, plus a Book Now CTA linking to /booking.
 */
export function ServiceDetailPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const pick = (b: { hi: string; en: string }) =>
    language === "hi" ? b.hi : b.en;
  const { category } = useParams({ from: "/services/$category" });

  // Invalid category — helpful recovery path instead of a broken view.
  if (!isCategory(category)) {
    return (
      <section
        data-ocid="service_detail.invalid"
        className="container mx-auto px-4 py-20 text-center"
      >
        <p className="font-display text-5xl text-primary">४०४</p>
        <p className="mt-4 text-lg text-muted-foreground">
          {t(
            "यह सेवा श्रेणी उपलब्ध नहीं है।",
            "This service category doesn't exist.",
          )}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/services" data-ocid="service_detail.back_to_services">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("सेवाएँ पर लौटें", "Back to Services")}
          </Link>
        </Button>
      </section>
    );
  }

  const label = SERVICE_CATEGORY_LABELS[category];
  const desc = CATEGORY_DESCRIPTIONS[category];
  const motif = CATEGORY_MOTIFS[category];
  const rituals = SERVICE_CATALOGUE.filter((s) => s.category === category);

  return (
    <div data-ocid="service_detail.page">
      {/* ---- Breadcrumb + header ---- */}
      <section className="border-b border-border bg-gradient-subtle">
        <div className="container mx-auto px-4 py-12">
          <nav
            aria-label={t("ब्रेडक्रंब", "Breadcrumb")}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link
              to="/services"
              data-ocid="service_detail.breadcrumb_services"
              className="transition-smooth hover:text-accent"
            >
              {t("सेवाएँ", "Services")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-foreground">{pick(label)}</span>
          </nav>

          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-flame text-3xl shadow-sacred"
              aria-hidden="true"
            >
              {motif}
            </span>
            <div>
              <h1 className="font-display text-3xl font-semibold text-gradient-flame md:text-4xl">
                {pick(label)}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {pick(desc)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Rituals list ---- */}
      <section
        data-ocid="service_detail.rituals_section"
        className="container mx-auto px-4 py-14"
      >
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-primary">
            {t("इस श्रेणी के अनुष्ठान", "Rituals in this category")}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t(
              "नीचे दी गई सूची में से कोई भी अनुष्ठान बुक कर सकते हैं।",
              "You can book any of the rituals listed below.",
            )}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {rituals.map((ritual, index) => (
            <Card
              key={ritual.name.en}
              data-ocid={`service_detail.ritual_card.${index + 1}`}
              className="transition-smooth hover:shadow-sacred"
            >
              <CardHeader className="gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-accent/40 text-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Badge>
                  <CardTitle className="font-display text-lg text-primary">
                    {pick(ritual.name)}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {pick(ritual.description)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Book now CTA ---- */}
      <section
        data-ocid="service_detail.cta_section"
        className="border-t border-border bg-card"
      >
        <div className="container mx-auto px-4 py-14">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-flame p-8 text-center shadow-sacred md:p-10">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
              {t("अभी बुकिंग करें", "Book This Service Now")}
            </h2>
            <p className="mt-3 text-white/90">
              {t(
                "अपनी पसंद का अनुष्ठान आज ही बुक करें — पंडित जी आपके घर पर आएँगे।",
                "Book your chosen ritual today — the pandit will come to your home.",
              )}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary shadow-sm hover:bg-background/90"
              >
                <Link to="/booking" data-ocid="service_detail.book_now_button">
                  {t("बुकिंग फॉर्म", "Booking Form")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  data-ocid="service_detail.call_button"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {CONTACT_PHONE}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
