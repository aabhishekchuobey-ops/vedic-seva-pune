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
import {
  CONTACT_PHONE,
  SERVICE_AREAS,
  SERVICE_CATEGORY_LABELS,
} from "@/utils/constants";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_MOTIFS,
  PACKAGE_CATALOGUE,
} from "@/utils/service-content";
import type { ServiceCategoryValue } from "@/utils/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

const CATEGORY_ORDER: ServiceCategoryValue[] = [
  "vedicPujaHavan",
  "grahaDoshShanti",
  "jeevanSamskar",
  "jyotishServices",
];

/** Formats a price range into a bilingual display string. */
function formatPrice(
  min: number,
  max: number | null,
  lang: "hi" | "en",
): string {
  const fmt = (n: number) =>
    `₹${n.toLocaleString(lang === "hi" ? "en-IN" : "en-IN")}`;
  if (max === null) return `${fmt(min)}+`;
  return `${fmt(min)}–${fmt(max)}`;
}

/**
 * Services page — four clickable category cards, the Puja Packages & Pricing
 * section, and the Pune service-areas section. All bilingual via the language
 * toggle.
 */
export function ServicesPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const pick = (b: { hi: string; en: string }) =>
    language === "hi" ? b.hi : b.en;

  return (
    <div data-ocid="services.page">
      {/* ---- Page header ---- */}
      <section className="border-b border-border bg-gradient-subtle">
        <div className="container mx-auto px-4 py-14 text-center">
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {t("पुणे · वैदिक परंपरा", "Pune · Vedic Tradition")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
            {t("हमारी सेवाएँ", "Our Services")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t(
              "वैदिक पूजा, हवन, ग्रह शांति, जीवन संस्कार एवं ज्योतिष सेवाएँ — शास्त्रोक्त विधि से, आपके घर पर।",
              "Vedic puja, havan, graha shanti, life samskaras, and jyotish services — by scripture, at your home.",
            )}
          </p>
        </div>
      </section>

      {/* ---- Service categories ---- */}
      <section
        data-ocid="services.categories_section"
        className="container mx-auto px-4 py-14"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-primary">
            {t("सेवा श्रेणियाँ", "Service Categories")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t(
              "किसी भी श्रेणी पर क्लिक कर विस्तृत पूजा-अनुष्ठान सूची देखें।",
              "Click any category to view the full list of rituals.",
            )}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((category, index) => {
            const label = SERVICE_CATEGORY_LABELS[category];
            const desc = CATEGORY_DESCRIPTIONS[category];
            const motif = CATEGORY_MOTIFS[category];
            return (
              <Link
                key={category}
                to="/services/$category"
                params={{ category }}
                data-ocid={`services.category_card.${index + 1}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                <Card className="h-full transition-smooth group-hover:shadow-sacred group-hover:-translate-y-1 group-focus-visible:shadow-sacred">
                  <CardHeader className="gap-3">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-flame text-2xl shadow-sacred"
                      aria-hidden="true"
                    >
                      {motif}
                    </span>
                    <CardTitle className="font-display text-xl text-primary">
                      {pick(label)}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {pick(desc)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-smooth group-hover:gap-2.5">
                      {t("विवरण देखें", "View details")}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---- Puja packages & pricing ---- */}
      <section
        data-ocid="services.packages_section"
        className="border-y border-border bg-card"
      >
        <div className="container mx-auto px-4 py-14">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-primary">
              {t("पूजा पैकेज एवं मूल्य", "Puja Packages & Pricing")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t(
                "सामग्री एवं डक्षिणा सहित संपूर्ण पैकेज — कोई छिपा शुल्क नहीं।",
                "Complete packages including materials and dakshina — no hidden charges.",
              )}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PACKAGE_CATALOGUE.map((pkg, index) => (
              <Card
                key={pkg.name.en}
                data-ocid={`services.package_card.${index + 1}`}
                className="flex h-full flex-col"
              >
                <CardHeader className="gap-2">
                  <CardTitle className="font-display text-lg text-primary">
                    {pick(pkg.name)}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {pick(pkg.description)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-flame text-white"
                    >
                      {formatPrice(
                        pkg.priceMinRupees,
                        pkg.priceMaxRupees,
                        language,
                      )}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("शामिल वस्तुएँ", "Included items")}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {pkg.includedItems.map((item) => (
                        <li
                          key={item.en}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          <span>{pick(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
            >
              <Link to="/booking" data-ocid="services.book_now_button">
                {t("अभी बुकिंग करें", "Book Now")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("अथवा कॉल करें", "Or call")}{" "}
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="font-medium text-accent hover:underline"
                data-ocid="services.call_link"
              >
                {CONTACT_PHONE}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Service areas ---- */}
      <section
        data-ocid="services.areas_section"
        className="container mx-auto px-4 py-14"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-primary">
            {t("सेवा क्षेत्र", "Service Areas")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t(
              "पुणे के प्रमुख क्षेत्रों में घर/स्थल पर पूजा सेवा उपलब्ध है।",
              "On-site puja service available across major areas of Pune.",
            )}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SERVICE_AREAS.map((area, index) => (
              <li
                key={area}
                data-ocid={`services.area_item.${index + 1}`}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm transition-smooth hover:border-accent hover:shadow-sacred"
              >
                <MapPin
                  className="size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="min-w-0 truncate">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
