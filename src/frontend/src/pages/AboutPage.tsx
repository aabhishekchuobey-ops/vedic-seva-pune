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
  CALL_URL,
  CONTACT_PHONE,
  PANDIT_NAME,
  SANKALP,
  SERVICE_AREAS,
  WHATSAPP_URL,
} from "@/utils/constants";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Flame,
  GraduationCap,
  HandHeart,
  Languages,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import type React from "react";

/** Expertise areas (bilingual). */
interface Expertise {
  icon: React.ComponentType<{ className?: string }>;
  hi: string;
  en: string;
  detail: { hi: string; en: string };
}

const EXPERTISE: Expertise[] = [
  {
    icon: Flame,
    hi: "वैदिक पूजा एवं हवन",
    en: "Vedic Puja & Havan",
    detail: {
      hi: "शास्त्रोक्त विधि से गृह पूजा, सत्यनारायण कथा, लक्ष्मी पूजन एवं हवन।",
      en: "Scriptural griha puja, Satyanarayan Katha, Lakshmi Pujan, and havan.",
    },
  },
  {
    icon: Sparkles,
    hi: "ग्रह दोष शांति",
    en: "Graha Dosh Shanti",
    detail: {
      hi: "नवग्रह शांति, मंगल दोष, काल सर्प दोष एवं पितृ दोष शांति पूजा।",
      en: "Navagraha Shanti, Mangal Dosh, Kaal Sarp Dosh, and Pitra Dosh Shanti puja.",
    },
  },
  {
    icon: HandHeart,
    hi: "जीवन संस्कार",
    en: "Jeevan Samskar",
    detail: {
      hi: "नामकरण, अन्नप्राशन, जनेऊ, विवाह एवं अंतिम संस्कार सहित सोलह संस्कार।",
      en: "Namkaran, Annaprashan, Janeu, Vivah, and Antim Sanskar — the sixteen samskaras.",
    },
  },
  {
    icon: BookOpen,
    hi: "ज्योतिष सेवाएँ",
    en: "Jyotish Services",
    detail: {
      hi: "वैदिक ज्योतिष परामर्श, राशि विश्लेषण एवं शुभ मुहूर्त निर्धारण।",
      en: "Vedic jyotish consultation, rashi analysis, and auspicious muhurat selection.",
    },
  },
];

/** Service philosophy points (bilingual). */
const PHILOSOPHY: { hi: string; en: string }[] = [
  {
    hi: "सनातन धर्म की वैदिक परंपराओं को प्रत्येक परिवार तक पहुँचाना।",
    en: "To bring the Vedic traditions of Sanatan Dharma to every family.",
  },
  {
    hi: "शास्त्रोक्त विधि और संस्कृत मंत्रोच्चार की शुद्धता बनाए रखना।",
    en: "To preserve the purity of scriptural rites and Sanskrit mantra recitation.",
  },
  {
    hi: "परिवार के अनुसार विशेष पूजा और उचित दक्षिणा की व्यवस्था करना।",
    en: "To arrange custom pujas and fair dakshina suited to each family.",
  },
  {
    hi: "समय की पूर्ण पाबंदी और भक्ति भाव के साथ हर संकल्प पूर्ण करना।",
    en: "To fulfill every resolve with strict punctuality and devotional spirit.",
  },
];

/**
 * About page — background, expertise, and service philosophy of
 * Pandit Abhishek Shastri. All copy is bilingual via the language toggle.
 */
export function AboutPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  return (
    <div data-ocid="about.page" className="flex flex-col">
      {/* Hero / intro */}
      <section
        data-ocid="about.intro.section"
        className="relative overflow-hidden bg-gradient-subtle"
      >
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 text-accent"
              data-ocid="about.intro.badge"
            >
              🚩 {t("जय श्री राम", "Jai Shri Ram")} 🚩
            </Badge>
            <h1
              className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl"
              data-ocid="about.intro.title"
            >
              {t("परिचय", "About")}
            </h1>
            <p
              className="mt-3 font-display text-xl text-gradient-flame"
              data-ocid="about.intro.name"
            >
              {PANDIT_NAME.hi}
            </p>
            <div
              className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
              aria-hidden="true"
            />
            <p
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
              data-ocid="about.intro.body"
            >
              {t(
                "पंडित अभिषेक शास्त्री जी एक अनुभवी वैदिक ब्राह्मण हैं, जो सनातन धर्म की परंपराओं के अनुसार शुद्ध विधि से पूजा, हवन, ज्योतिष एवं संस्कार सम्पन्न कराते हैं। वर्षों के अभ्यास और शास्त्रीय ज्ञान के साथ, उनका उद्देश्य हर परिवार तक वैदिक परंपरा को पहुँचाना है।",
                "Pandit Abhishek Shastri Ji is an experienced Vedic Brahmin who performs puja, havan, jyotish, and samskaras with pure method according to the traditions of Sanatan Dharma. With years of practice and scriptural knowledge, his purpose is to bring the Vedic tradition to every family.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Background */}
      <section
        data-ocid="about.background.section"
        className="bg-background py-16 md:py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <BackgroundCard
              icon={GraduationCap}
              title={t("शिक्षा एवं ज्ञान", "Education & Knowledge")}
              body={t(
                "वेद, उपनिषद एवं ज्योतिष शास्त्र का गहन अध्ययन। संस्कृत मंत्रोच्चार और शास्त्रोक्त विधि में पारंगत।",
                "Deep study of the Vedas, Upanishads, and Jyotish Shastra. Fluent in Sanskrit mantra recitation and scriptural rites.",
              )}
              ocid="about.background.item.1"
            />
            <BackgroundCard
              icon={Star}
              title={t("अनुभव", "Experience")}
              body={t(
                "वर्षों से पुणे और आसपास के क्षेत्रों में सैकड़ों पूजा, हवन एवं संस्कार सम्पन्न कराए। हर परिवार की आस्था का सम्मान।",
                "For years, has performed hundreds of pujas, havans, and samskaras across Pune and nearby areas. Honoring every family's faith.",
              )}
              ocid="about.background.item.2"
            />
            <BackgroundCard
              icon={MapPin}
              title={t("सेवा क्षेत्र", "Service Area")}
              body={t(
                "सम्पूर्ण पुणे में सेवा — खड़की, वाघोली, हड़पसर, हिंजवड़ी, बानेर, पिंपरी चिंचवड़ सहित सभी प्रमुख क्षेत्र।",
                "Service across all of Pune — Kharadi, Wagholi, Hadapsar, Hinjewadi, Baner, Pimpri-Chinchwad, and all major areas.",
              )}
              ocid="about.background.item.3"
            />
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section
        data-ocid="about.expertise.section"
        className="bg-gradient-subtle py-16 md:py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="bg-accent/15 text-accent"
              data-ocid="about.expertise.badge"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t("विशेषज्ञता", "Expertise")}
            </Badge>
            <h2
              className="mt-4 font-display text-3xl font-semibold text-primary md:text-4xl"
              data-ocid="about.expertise.title"
            >
              {t("वैदिक ज्ञान के क्षेत्र", "Areas of Vedic Expertise")}
            </h2>
            <p
              className="mt-3 text-base text-muted-foreground"
              data-ocid="about.expertise.subtitle"
            >
              {t(
                "पूजा, हवन, ज्योतिष, वास्तु एवं संस्कार — हर विधि में शुद्धता।",
                "Puja, havan, jyotish, vastu, and samskaras — purity in every rite.",
              )}
            </p>
          </div>

          <div
            className="mt-10 grid gap-4 sm:grid-cols-2"
            data-ocid="about.expertise.list"
          >
            {EXPERTISE.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.en}
                  data-ocid={`about.expertise.item.${idx + 1}`}
                  className="border-accent/20 bg-card transition-smooth hover:border-accent/50 hover:shadow-sacred"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="font-display text-lg font-semibold text-primary">
                        {t(item.hi, item.en)}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {t(item.detail.hi, item.detail.en)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service philosophy */}
      <section
        data-ocid="about.philosophy.section"
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
              data-ocid="about.philosophy.title"
            >
              {t("सेवा दर्शन", "Service Philosophy")}
            </h2>
            <div
              className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
              aria-hidden="true"
            />
            <p
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
              data-ocid="about.philosophy.sankalp"
            >
              {t(SANKALP.hi, SANKALP.en)}
            </p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2"
            data-ocid="about.philosophy.list"
          >
            {PHILOSOPHY.map((point, idx) => (
              <div
                key={point.en}
                data-ocid={`about.philosophy.item.${idx + 1}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <span
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-flame text-xs font-semibold text-white"
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {t(point.hi, point.en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-ocid="about.cta.section"
        className="bg-gradient-subtle py-16 md:py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border border-accent/30 bg-card p-8 text-center shadow-sacred">
            <h2
              className="font-display text-2xl font-semibold text-primary md:text-3xl"
              data-ocid="about.cta.title"
            >
              {t("अपनी पूजा बुक करें", "Book Your Puja")}
            </h2>
            <p
              className="max-w-xl text-base text-muted-foreground"
              data-ocid="about.cta.body"
            >
              {t(
                "परिवार के अनुसार विशेष पूजा, हवन या संस्कार की बुकिंग के लिए आज ही संपर्क करें। सम्पूर्ण पुणे में सेवा उपलब्ध।",
                "Contact today to book a custom puja, havan, or samskara for your family. Service available across all of Pune.",
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
                data-ocid="about.cta.book_button"
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
                data-ocid="about.cta.call_button"
              >
                <a href={CALL_URL}>
                  {t("कॉल करें", "Call")} · {CONTACT_PHONE}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="about.cta.whatsapp_button"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface BackgroundCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  ocid: string;
}

function BackgroundCard({
  icon: Icon,
  title,
  body,
  ocid,
}: BackgroundCardProps) {
  return (
    <Card
      data-ocid={ocid}
      className="border-accent/20 bg-card transition-smooth hover:border-accent/50 hover:shadow-sacred"
    >
      <CardHeader>
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <CardTitle className="mt-3 font-display text-lg font-semibold text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {body}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
