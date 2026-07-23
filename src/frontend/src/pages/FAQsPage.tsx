import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFAQs } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import { CALL_URL, CONTACT_PHONE, WHATSAPP_URL } from "@/utils/constants";
import type { FAQ } from "@/utils/types";
import { Link } from "@tanstack/react-router";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import { useMemo, useState } from "react";

const FAQ_GROUP_SKELETON_KEYS = [
  "faq-group-skel-1",
  "faq-group-skel-2",
  "faq-group-skel-3",
];
const FAQ_ITEM_SKELETON_KEYS = [
  "faq-item-skel-1",
  "faq-item-skel-2",
  "faq-item-skel-3",
];

/**
 * FAQs page — accordion (shadcn) covering common questions about booking,
 * pricing, service areas, and rituals. Fetches from useFAQs hook. All
 * bilingual via the language toggle.
 */
export function FAQsPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const { data: faqs, isLoading } = useFAQs();

  // Group FAQs by category for organized display.
  const groupedFaqs = useMemo(() => {
    if (!faqs || faqs.length === 0) return [];
    const sorted = [...faqs].sort(
      (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
    );
    const groups = new Map<string, FAQ[]>();
    for (const faq of sorted) {
      const list = groups.get(faq.category) ?? [];
      list.push(faq);
      groups.set(faq.category, list);
    }
    return Array.from(groups.entries());
  }, [faqs]);

  return (
    <section data-ocid="faqs.page" className="container mx-auto px-4 py-16">
      {/* Page header */}
      <header className="mx-auto max-w-3xl text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <HelpCircle className="h-4 w-4 text-accent" aria-hidden="true" />
          {t("सहायता", "Help")}
        </div>
        <h1 className="font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("अक्सर पूछे जाने वाले प्रश्न", "Frequently Asked Questions")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t(
            "बुकिंग, मूल्य, सेवा क्षेत्र एवं अनुष्ठानों से संबंधित सामान्य प्रश्न",
            "Common questions about booking, pricing, service areas, and rituals",
          )}
        </p>
      </header>

      {/* Decorative divider */}
      <div
        className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <span className="font-display text-lg text-accent">ॐ</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      {/* FAQ content */}
      <div className="mx-auto mt-12 max-w-3xl">
        {isLoading ? (
          <FAQSkeleton />
        ) : groupedFaqs.length > 0 ? (
          <div className="flex flex-col gap-10">
            {groupedFaqs.map(([category, items], groupIndex) => (
              <FAQGroup
                key={category}
                category={category}
                items={items}
                language={language}
                groupIndex={groupIndex}
              />
            ))}
          </div>
        ) : (
          <EmptyFAQs t={t} />
        )}
      </div>

      {/* Still have questions CTA */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-gradient-subtle p-8 text-center">
        <MessageCircleQuestion
          className="mx-auto h-10 w-10 text-accent"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-display text-2xl font-semibold text-primary">
          {t("अभी भी प्रश्न हैं?", "Still have questions?")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t(
            "सीधे पंडित जी से संपर्क करें — हम आपकी सहायता के लिए तत्पर हैं।",
            "Reach out to Pandit Ji directly — we're happy to help.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
          >
            <a href={CALL_URL} data-ocid="faqs.call_button">
              📞 {CONTACT_PHONE}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="faqs.whatsapp_button"
            >
              {t("WhatsApp पर चैट", "Chat on WhatsApp")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

interface FAQGroupProps {
  category: string;
  items: FAQ[];
  language: "hi" | "en";
  groupIndex: number;
}

function FAQGroup({ category, items, language, groupIndex }: FAQGroupProps) {
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  // Map backend category strings to bilingual labels.
  const categoryLabel = useMemo(() => {
    const labels: Record<string, { hi: string; en: string }> = {
      booking: { hi: "बुकिंग", en: "Booking" },
      pricing: { hi: "मूल्य", en: "Pricing" },
      "service-areas": { hi: "सेवा क्षेत्र", en: "Service Areas" },
      rituals: { hi: "अनुष्ठान", en: "Rituals" },
      general: { hi: "सामान्य", en: "General" },
    };
    return labels[category] ?? { hi: category, en: category };
  }, [category]);

  return (
    <div data-ocid={`faqs.group.${groupIndex + 1}`}>
      <h2 className="mb-4 inline-flex items-center gap-2 font-display text-xl font-semibold text-primary">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        {t(categoryLabel.hi, categoryLabel.en)}
      </h2>
      <Accordion
        type="single"
        collapsible
        value={openValue}
        onValueChange={setOpenValue}
        className="rounded-xl border border-border bg-card px-4 shadow-sm"
      >
        {items.map((faq, index) => (
          <AccordionItem
            key={faq.id.toString()}
            value={faq.id.toString()}
            data-ocid={`faqs.item.${groupIndex + 1}.${index + 1}`}
          >
            <AccordionTrigger className="text-left font-display text-base font-medium text-foreground hover:text-accent hover:no-underline">
              {t(faq.question.hi, faq.question.en)}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {t(faq.answer.hi, faq.answer.en)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div data-ocid="faqs.loading_state" className="flex flex-col gap-10">
      {FAQ_GROUP_SKELETON_KEYS.map((groupKey) => (
        <div key={groupKey}>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="space-y-2 rounded-xl border border-border bg-card px-4 py-2">
            {FAQ_ITEM_SKELETON_KEYS.map((itemKey) => (
              <div
                key={itemKey}
                className="flex items-center justify-between py-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyFAQs({ t }: { t: (hi: string, en: string) => string }) {
  return (
    <div
      data-ocid="faqs.empty_state"
      className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center"
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl"
        aria-hidden="true"
      >
        🙏
      </span>
      <h2 className="font-display text-xl font-semibold text-primary">
        {t("प्रश्न शीघ्र ही यहाँ", "FAQs coming soon")}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t(
          "सामान्य प्रश्न शीघ्र ही प्रकाशित होंगे। अभी किसी भी प्रश्न के लिए संपर्क करें।",
          "Frequently asked questions will be published soon. Contact us for any questions now.",
        )}
      </p>
      <Link
        to="/contact"
        data-ocid="faqs.empty_state.contact_link"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-flame px-5 py-2.5 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
      >
        {t("संपर्क करें", "Contact us")}
      </Link>
    </div>
  );
}
