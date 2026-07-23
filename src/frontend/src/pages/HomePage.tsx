import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServices } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import {
  CALL_URL,
  CONTACT_PHONE,
  PANDIT_NAME,
  SERVICE_CATEGORY_LABELS,
  WHATSAPP_URL,
} from "@/utils/constants";
import type { ServiceCategoryValue } from "@/utils/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Clock,
  Flame,
  HandCoins,
  HandHeart,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import type React from "react";

/** Why-choose-us highlights (bilingual). */
interface Highlight {
  icon: React.ComponentType<{ className?: string }>;
  hi: string;
  en: string;
}

const HIGHLIGHTS: Highlight[] = [
  { icon: Star, hi: "अनुभवी वैदिक ब्राह्मण", en: "Experienced Vedic Brahmin" },
  { icon: Flame, hi: "शुद्ध वैदिक विधि", en: "Pure Vedic Method" },
  { icon: BookOpen, hi: "संस्कृत मंत्रोच्चार", en: "Sanskrit Mantra Recitation" },
  { icon: Clock, hi: "समय की पूर्ण पाबंदी", en: "Strict Punctuality" },
  { icon: MapPin, hi: "सम्पूर्ण पुणे में सेवा", en: "Service Across All Pune" },
  {
    icon: CalendarCheck,
    hi: "ऑनलाइन एवं ऑफलाइन बुकिंग",
    en: "Online & Offline Booking",
  },
  { icon: HandCoins, hi: "उचित दक्षिणा", en: "Fair Dakshina" },
  {
    icon: HandHeart,
    hi: "परिवार के अनुसार विशेष पूजा",
    en: "Custom Puja Per Family",
  },
];

/** Service categories previewed on the home page. */
const CATEGORY_PREVIEW: ServiceCategoryValue[] = [
  "vedicPujaHavan",
  "grahaDoshShanti",
  "jeevanSamskar",
  "jyotishServices",
];

/**
 * Home page — hero, welcome, why-choose-us, and service category preview.
 * All copy is bilingual via the language toggle in the store.
 */
export function HomePage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const { data: services = [] } = useServices();

  return (
    <div data-ocid="home.page" className="flex flex-col">
      <Hero t={t} />
      <Welcome t={t} />
      <WhyChooseUs t={t} />
      <ServicePreview t={t} services={services} />
    </div>
  );
}

interface SectionProps {
  t: (hi: string, en: string) => string;
}

/** Hero with pandit name, greeting, tagline, CTAs, and devotional image. */
function Hero({ t }: SectionProps) {
  return (
    <section
      data-ocid="home.hero.section"
      className="relative overflow-hidden bg-gradient-subtle"
    >
      {/* Decorative gold hairline divider at top */}
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Text column */}
          <div className="flex flex-col items-start gap-5">
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 text-accent"
              data-ocid="home.hero.greeting"
            >
              🚩 {t("जय श्री राम", "Jai Shri Ram")} 🚩
            </Badge>

            <h1
              className="font-display text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl"
              data-ocid="home.hero.title"
            >
              {PANDIT_NAME.hi}
            </h1>

            <p
              className="font-display text-lg font-medium text-gradient-flame md:text-xl"
              data-ocid="home.hero.tagline"
            >
              {t(
                "वैदिक पूजा • हवन • ज्योतिष • वास्तु • संस्कार",
                "Vedic Puja • Havan • Jyotish • Vastu • Samskar",
              )}
            </p>

            <p
              className="max-w-xl text-base leading-relaxed text-muted-foreground"
              data-ocid="home.hero.subtitle"
            >
              {t(
                "शास्त्रोक्त विधि और शुद्ध भाव के साथ सम्पूर्ण पुणे में वैदिक पूजा, हवन, ज्योतिष एवं संस्कार सेवाएँ। परिवार के अनुसार विशेष पूजा की बुकिंग के लिए आज ही संपर्क करें।",
                "Scriptural rites and pure devotion across all of Pune — Vedic puja, havan, jyotish, and samskar services. Book a custom puja for your family today.",
              )}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
                data-ocid="home.hero.book_button"
              >
                <Link to="/booking">
                  {t("बुकिंग करें", "Book Now")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="home.hero.call_button"
              >
                <a href={CALL_URL}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {t("कॉल करें", "Call")} · {CONTACT_PHONE}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="home.hero.whatsapp_button"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-flame opacity-20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 shadow-sacred">
              <img
                src="/assets/generated/hero-priest-puja.dim_1024x1280.jpg"
                alt={t(
                  "वैदिक पुजारी तांबे के हवन कुंड के साथ पूजा करते हुए, मरीगोल्ड माला और स्वर्ण मंदिर प्रकाश के साथ",
                  "Vedic priest performing puja with a copper havan kund, marigold garlands, and golden temple lighting",
                )}
                className="h-full w-full object-cover"
                loading="eager"
                width={1024}
                height={1280}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Welcome / introduction section explaining the Vedic tradition and purpose. */
function Welcome({ t }: SectionProps) {
  return (
    <section
      data-ocid="home.welcome.section"
      className="bg-background py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="font-display text-3xl text-accent"
            aria-hidden="true"
          >
            ॐ
          </span>
          <h2
            className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl"
            data-ocid="home.welcome.title"
          >
            {t("हार्दिक स्वागत है", "A Warm Welcome")}
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden="true"
          />
          <p
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
            data-ocid="home.welcome.body"
          >
            {t(
              "हमारा उद्देश्य सनातन धर्म की वैदिक परंपराओं को प्रत्येक परिवार तक पहुँचाना है। वेदों में वर्णित शुद्ध विधि, संस्कृत मंत्रोच्चार और समय के पाबंदी के साथ हर संस्कार और पूजा को सम्पन्न कराया जाता है। श्रद्धा और भक्ति के साथ, परिवार के अनुरूप विशेष पूजा की व्यवस्था की जाती है ताकि हर संकल्प पूर्ण हो सके।",
              "Our purpose is to bring the Vedic traditions of Sanatan Dharma to every family. Each samskar and puja is performed with the pure method described in the Vedas, Sanskrit mantra recitation, and strict punctuality. With devotion and faith, custom pujas are arranged to suit each family so every resolve is fulfilled.",
            )}
          </p>
          <p
            className="mt-4 text-base leading-relaxed text-muted-foreground"
            data-ocid="home.welcome.body2"
          >
            {t(
              "हवन की पवित्र अग्नि, मंत्रों के उच्चारण और दक्षिणा की शुद्धता से घर-परिवार में सुख, शांति और समृद्धि का वास होता है। यही हमारी सेवा का संकल्प है।",
              "The sacred fire of the havan, the recitation of mantras, and the purity of dakshina bring happiness, peace, and prosperity to the home and family. This is the resolve of our service.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Why choose us — 8 bilingual highlights in a responsive grid. */
function WhyChooseUs({ t }: SectionProps) {
  return (
    <section
      data-ocid="home.why.section"
      className="bg-gradient-subtle py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="bg-accent/15 text-accent"
            data-ocid="home.why.badge"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {t("हमें क्यों चुनें", "Why Choose Us")}
          </Badge>
          <h2
            className="mt-4 font-display text-3xl font-semibold text-primary md:text-4xl"
            data-ocid="home.why.title"
          >
            {t(
              "वैदिक परंपरा में हमारी विशेषताएँ",
              "What Sets Us Apart in Vedic Tradition",
            )}
          </h2>
          <p
            className="mt-3 text-base text-muted-foreground"
            data-ocid="home.why.subtitle"
          >
            {t(
              "शुद्ध विधि, समय की पाबंदी और परिवार के अनुसार सेवा — यही हमारा संकल्प।",
              "Pure method, punctuality, and family-tailored service — this is our resolve.",
            )}
          </p>
        </div>

        <div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          data-ocid="home.why.list"
        >
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.en}
                data-ocid={`home.why.item.${idx + 1}`}
                className="border-accent/20 bg-card transition-smooth hover:border-accent/50 hover:shadow-sacred"
              >
                <CardHeader>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 font-display text-base font-semibold text-primary">
                    {t(item.hi, item.en)}
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ServicePreviewProps extends SectionProps {
  services: { id: bigint; category: ServiceCategoryValue }[];
}

/** Preview of service categories linking to /services. */
function ServicePreview({ t, services }: ServicePreviewProps) {
  // Count services per category for a richer preview.
  const counts = CATEGORY_PREVIEW.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = services.filter((s) => s.category === cat).length;
    return acc;
  }, {});

  return (
    <section
      data-ocid="home.services.section"
      className="bg-background py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge
            variant="secondary"
            className="bg-accent/15 text-accent"
            data-ocid="home.services.badge"
          >
            <Flame className="h-3 w-3" aria-hidden="true" />
            {t("हमारी सेवाएँ", "Our Services")}
          </Badge>
          <h2
            className="font-display text-3xl font-semibold text-primary md:text-4xl"
            data-ocid="home.services.title"
          >
            {t("सेवा श्रेणियाँ", "Service Categories")}
          </h2>
          <p
            className="max-w-2xl text-base text-muted-foreground"
            data-ocid="home.services.subtitle"
          >
            {t(
              "वैदिक पूजा से लेकर ज्योतिष परामर्श तक — हर संस्कार के लिए शुद्ध विधि।",
              "From Vedic puja to jyotish consultation — pure method for every samskar.",
            )}
          </p>
        </div>

        <div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          data-ocid="home.services.list"
        >
          {CATEGORY_PREVIEW.map((cat, idx) => {
            const label = SERVICE_CATEGORY_LABELS[cat];
            const count = counts[cat] ?? 0;
            return (
              <Link
                key={cat}
                to="/services"
                data-ocid={`home.services.item.${idx + 1}`}
                className={cn(
                  "group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-smooth",
                  "hover:border-accent/50 hover:shadow-sacred",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-flame text-white"
                    aria-hidden="true"
                  >
                    <span className="font-display text-sm font-semibold">
                      {t("ॐ", "Om")}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-smooth group-hover:text-accent group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-base font-semibold text-primary">
                  {t(label.hi, label.en)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {count > 0
                    ? t(`${count} सेवाएँ`, `${count} services`)
                    : t("विवरण देखें", "View details")}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
            data-ocid="home.services.view_all"
          >
            <Link to="/services">
              {t("सभी सेवाएँ देखें", "View All Services")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
