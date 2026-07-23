import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContactSubmission } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import {
  CALL_URL,
  CONTACT_PHONE,
  SERVICE_AREAS,
  SOCIAL_LINKS,
  WHATSAPP_URL,
} from "@/utils/constants";
import { MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

/**
 * Contact page — contact form (name, phone, message) submitting via
 * useCreateContactSubmission hook. Displays phone number 9026828075
 * prominently. Embeds Google Maps showing Pune service area (iframe with
 * Pune-centered Google Maps embed URL). Social media links section. All
 * bilingual via the language toggle.
 */
export function ContactPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  return (
    <section data-ocid="contact.page" className="container mx-auto px-4 py-16">
      {/* Page header */}
      <header className="mx-auto max-w-3xl text-center animate-fade-up">
        <h1 className="font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("संपर्क करें", "Contact Us")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t(
            "पंडित अभिषेक शास्त्री जी से संपर्क के लिए — कॉल, WhatsApp, या फॉर्म भरें",
            "Get in touch with Pandit Abhishek Shastri Ji — call, WhatsApp, or fill the form",
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

      {/* Prominent phone banner */}
      <div className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-flame p-8 text-center text-white shadow-sacred sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium uppercase tracking-wide text-white/80">
              {t("सीधे कॉल करें", "Call directly")}
            </p>
            <a
              href={CALL_URL}
              data-ocid="contact.phone_banner"
              className="font-display text-3xl font-bold tracking-wide text-white transition-smooth hover:underline md:text-4xl"
            >
              📞 {CONTACT_PHONE}
            </a>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="contact.whatsapp_banner"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-smooth hover:bg-white/25"
          >
            {t("WhatsApp पर चैट", "Chat on WhatsApp")}
          </a>
        </div>
      </div>

      {/* Form + info grid */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
        <ContactForm t={t} />
        <ContactInfo t={t} language={language} />
      </div>

      {/* Map */}
      <div className="mx-auto mt-12 max-w-5xl">
        <h2 className="mb-4 inline-flex items-center gap-2 font-display text-2xl font-semibold text-primary">
          <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
          {t("हमारा सेवा क्षेत्र — पुणे", "Our Service Area — Pune")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border shadow-md">
          <iframe
            title={t("पुणे सेवा क्षेत्र मानचित्र", "Pune service area map")}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d121058.0!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            data-ocid="contact.map"
            className="block w-full"
          />
        </div>
      </div>

      {/* Social links */}
      <div className="mx-auto mt-12 max-w-3xl text-center">
        <h2 className="font-display text-xl font-semibold text-primary">
          {t("सोशल मीडिया पर जुड़ें", "Connect on social media")}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`contact.social.${link.name.toLowerCase()}`}
              aria-label={link.name}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-smooth hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SocialIcon name={link.name} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ContactFormProps {
  t: (hi: string, en: string) => string;
}

function ContactForm({ t }: ContactFormProps) {
  const createSubmission = useCreateContactSubmission();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    message?: string;
  }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (name.trim().length < 2) {
      next.name = t("कृपया अपना नाम दर्ज करें", "Please enter your name");
    }
    const phoneTrimmed = phone.trim();
    // Accept Indian 10-digit numbers, optional +91 prefix.
    const phoneOk = /^(\+?91)?[6-9]\d{9}$/.test(
      phoneTrimmed.replace(/[\s-]/g, ""),
    );
    if (!phoneOk) {
      next.phone = t(
        "कृपया एक वैध 10-अंकीय फ़ोन नंबर दर्ज करें",
        "Please enter a valid 10-digit phone number",
      );
    }
    if (message.trim().length < 5) {
      next.message = t(
        "कृपया अपना संदेश दर्ज करें (कम से कम 5 अक्षर)",
        "Please enter your message (at least 5 characters)",
      );
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createSubmission.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      toast.success(
        t(
          "धन्यवाद! आपका संदेश प्राप्त हुआ। पंडित जी शीघ्र संपर्क करेंगे।",
          "Thank you! Your message has been received. Pandit Ji will contact you soon.",
        ),
      );
      setName("");
      setPhone("");
      setMessage("");
      setErrors({});
    } catch {
      toast.error(
        t(
          "संदेश भेजने में त्रुटि हुई। कृपया कॉल करें या पुनः प्रयास करें।",
          "Error sending message. Please call or try again.",
        ),
      );
    }
  };

  const isSubmitting = createSubmission.isPending;

  return (
    <Card data-ocid="contact.form_card" className="h-fit">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-semibold text-primary">
          {t("संदेश भेजें", "Send a Message")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name" data-ocid="contact.name_label">
              {t("नाम", "Name")}
            </Label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("आपका पूरा नाम", "Your full name")}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                data-ocid="contact.name_input"
                className="pl-9"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p
                className="text-sm text-destructive"
                data-ocid="contact.name_error"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-phone" data-ocid="contact.phone_label">
              {t("फ़ोन नंबर", "Phone Number")}
            </Label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("10-अंकीय मोबाइल नंबर", "10-digit mobile number")}
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
                data-ocid="contact.phone_input"
                className="pl-9"
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p
                className="text-sm text-destructive"
                data-ocid="contact.phone_error"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message" data-ocid="contact.message_label">
              {t("संदेश", "Message")}
            </Label>
            <div className="relative">
              <MessageSquare
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t(
                  "अपना प्रश्न या बुकिंग विवरण यहाँ लिखें...",
                  "Write your query or booking details here...",
                )}
                disabled={isSubmitting}
                aria-invalid={!!errors.message}
                data-ocid="contact.message_input"
                className="min-h-32 pl-9 pt-2"
              />
            </div>
            {errors.message && (
              <p
                className="text-sm text-destructive"
                data-ocid="contact.message_error"
              >
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            data-ocid="contact.submit_button"
            className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {isSubmitting
              ? t("भेजा जा रहा है...", "Sending...")
              : t("संदेश भेजें", "Send Message")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface ContactInfoProps {
  t: (hi: string, en: string) => string;
  language: "hi" | "en";
}

function ContactInfo({ t, language }: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Quick contact methods */}
      <Card data-ocid="contact.info_card">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-semibold text-primary">
            {t("संपर्क विवरण", "Contact Details")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <a
            href={CALL_URL}
            data-ocid="contact.info_call"
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4 transition-smooth hover:border-accent hover:bg-secondary"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-flame text-white"
              aria-hidden="true"
            >
              <Phone className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {t("कॉल", "Call")}
              </span>
              <span className="font-display text-lg font-semibold text-primary">
                {CONTACT_PHONE}
              </span>
            </span>
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="contact.info_whatsapp"
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4 transition-smooth hover:border-accent hover:bg-secondary"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
              aria-hidden="true"
            >
              <MessageSquare className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {t("WhatsApp", "WhatsApp")}
              </span>
              <span className="font-display text-lg font-semibold text-primary">
                {t("चैट प्रारंभ करें", "Start a chat")}
              </span>
            </span>
          </a>
        </CardContent>
      </Card>

      {/* Service areas */}
      <Card data-ocid="contact.areas_card">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-primary">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            {t("सेवा क्षेत्र", "Service Areas")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {t(
              "हम पुणे एवं आसपास के क्षेत्रों में सेवाएँ प्रदान करते हैं:",
              "We provide services across Pune and surrounding areas:",
            )}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="flex items-center gap-2 text-foreground"
                data-ocid={`contact.area.${area.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground italic">
            {t(
              "अन्य क्षेत्रों के लिए कृपया संपर्क करें।",
              "For other areas, please contact us.",
            )}
          </p>
        </CardContent>
      </Card>

      {/* Social links */}
      <Card data-ocid="contact.social_card">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-semibold text-primary">
            {t("सोशल मीडिया", "Social Media")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`contact.social_card.${link.name.toLowerCase()}`}
                aria-label={link.name}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:border-accent hover:bg-secondary"
              >
                <SocialIcon name={link.name} />
                {link.name}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* sr-only language hint for assistive tech */}
      <span className="sr-only">{language === "hi" ? "हिन्दी" : "English"}</span>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const className = "h-5 w-5";
  switch (name.toLowerCase()) {
    case "facebook":
      return <SiFacebook className={className} aria-hidden="true" />;
    case "instagram":
      return <SiInstagram className={className} aria-hidden="true" />;
    case "youtube":
      return <SiYoutube className={className} aria-hidden="true" />;
    default:
      return null;
  }
}
