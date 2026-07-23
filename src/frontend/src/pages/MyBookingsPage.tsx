import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookingsByPhone } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { CONTACT_PHONE, WHATSAPP_URL } from "@/utils/constants";
import {
  type Booking,
  PaymentStatus,
  type PaymentStatusValue,
} from "@/utils/types";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  MessageCircle,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

/** Payment status display metadata (bilingual label + tailwind classes + icon). */
interface PaymentStatusMeta {
  hi: string;
  en: string;
  /** Badge container classes — colored per the required status palette. */
  badge: string;
  /** Dot indicator classes matching the badge hue. */
  dot: string;
  icon: typeof Clock;
}

const PAYMENT_STATUS_META: Record<PaymentStatusValue, PaymentStatusMeta> = {
  [PaymentStatus.pendingVerification]: {
    hi: "सत्यापन लंबित",
    en: "Pending Verification",
    badge:
      "border-amber-400/40 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    icon: Clock,
  },
  [PaymentStatus.verified]: {
    hi: "सत्यापित",
    en: "Verified",
    badge:
      "border-green-500/40 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-300",
    dot: "bg-green-500",
    icon: CheckCircle,
  },
  [PaymentStatus.failed]: {
    hi: "विफल",
    en: "Failed",
    badge:
      "border-red-500/40 bg-red-100 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500",
    icon: XCircle,
  },
  [PaymentStatus.notApplicable]: {
    hi: "लागू नहीं",
    en: "Not Applicable",
    badge: "border-border bg-muted text-muted-foreground dark:bg-muted/40",
    dot: "bg-muted-foreground",
    icon: Clock,
  },
};

/** Default status when a booking has no paymentStatus set. */
const DEFAULT_STATUS: PaymentStatusValue = PaymentStatus.notApplicable;

const BOOKING_SKELETON_KEYS = ["mb-skel-1", "mb-skel-2", "mb-skel-3"];

/**
 * My Bookings page — devotee self-service lookup.
 * Visitors enter the phone number used at booking time and retrieve
 * all matching bookings/donations from the backend via
 * useBookingsByPhone. All copy is bilingual via the language toggle,
 * defaulting to Hindi.
 */
export function MyBookingsPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  const [phoneInput, setPhoneInput] = useState("");
  /** The phone number actually submitted — drives the query. */
  const [submittedPhone, setSubmittedPhone] = useState("");

  const { data, isLoading, isError } = useBookingsByPhone(submittedPhone);
  const bookings = useMemo(() => (data ?? []) as Booking[], [data]);

  const hasSearched = submittedPhone.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phoneInput.trim();
    if (trimmed.length === 0) return;
    setSubmittedPhone(trimmed);
  }

  return (
    <section
      data-ocid="my-bookings.page"
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* Devotional header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-flame px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sacred">
          🕉 {t("मेरी बुकिंग", "My Bookings")}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("मेरी बुकिंग", "My Bookings")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t(
            "बुकिंग के समय दिए गए अपने फ़ोन नंबर से अपनी सभी बुकिंग एवं दान रिकॉर्ड देखें।",
            "Look up all your bookings and donation records using the phone number you provided at booking time.",
          )}
        </p>
      </div>

      {/* Decorative Om divider */}
      <div
        className="mx-auto mt-8 flex max-w-xs items-center gap-3"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <span className="font-display text-accent">ॐ</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      {/* Search form */}
      <div className="mx-auto mt-10 max-w-2xl">
        <form
          data-ocid="my-bookings.search.form"
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <Label
            htmlFor="my-bookings-phone"
            data-ocid="my-bookings.search.phone.label"
            className="text-foreground"
          >
            {t("फ़ोन नंबर", "Phone Number")}
          </Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              id="my-bookings-phone"
              data-ocid="my-bookings.search.phone.input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phoneInput}
              maxLength={15}
              placeholder={t(
                "10 अंकों का मोबाइल नंबर दर्ज करें",
                "Enter your 10-digit mobile number",
              )}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              data-ocid="my-bookings.search.submit_button"
              disabled={phoneInput.trim().length === 0}
              className="bg-gradient-flame text-white shadow-sacred hover:opacity-90 sm:w-auto"
            >
              <Search className="size-4" aria-hidden="true" />
              {t("खोजें", "Search")}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t(
              "वही नंबर दर्ज करें जो बुकिंग/दान के समय दिया था।",
              "Enter the same number you used while booking or donating.",
            )}
          </p>
        </form>
      </div>

      {/* Results region */}
      <div
        data-ocid="my-bookings.results.section"
        className="mx-auto mt-10 max-w-3xl"
        aria-label={t("बुकिंग परिणाम", "Booking results")}
      >
        {!hasSearched ? (
          <SearchPrompt t={t} />
        ) : isLoading ? (
          <BookingsSkeleton t={t} />
        ) : isError ? (
          <BookingsError t={t} />
        ) : bookings.length === 0 ? (
          <BookingsEmpty t={t} />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t(
                `${bookings.length} बुकिंग मिली`,
                `${bookings.length} booking${bookings.length > 1 ? "s" : ""} found`,
              )}
            </p>
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking.id.toString()}
                booking={booking}
                index={index}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment status legend */}
      <PaymentStatusLegend t={t} />
    </section>
  );
}

/** A single booking/donation card. */
function BookingCard({
  booking,
  index,
  t,
}: {
  booking: Booking;
  index: number;
  t: (hi: string, en: string) => string;
}) {
  const status: PaymentStatusValue = booking.paymentStatus ?? DEFAULT_STATUS;
  const meta = PAYMENT_STATUS_META[status];
  const StatusIcon = meta.icon;

  const isDonation = booking.bookingCategory === "donation";
  const advanceAmount =
    booking.advanceAmount !== undefined && booking.advanceAmount !== null
      ? Number(booking.advanceAmount)
      : null;

  // WhatsApp deep link with a booking-specific prefilled message.
  const whatsappMessage = isDonation
    ? `जय श्री राम 🙏\nमेरा दान रिकॉर्ड (ID: #${booking.id}) के बारे में जानकारी चाहिए।\n\nJai Shri Ram 🙏\nI would like information about my donation record (ID: #${booking.id}).`
    : `जय श्री राम 🙏\nमेरी बुकिंग (ID: #${booking.id}) — ${booking.serviceType} — के बारे में जानकारी चाहिए।\n\nJai Shri Ram 🙏\nI would like information about my booking (ID: #${booking.id}) — ${booking.serviceType}.`;
  const bookingWhatsappUrl = `https://wa.me/91${CONTACT_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article
      data-ocid={`my-bookings.item.${index}`}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-smooth hover:shadow-sacred sm:p-6"
    >
      {/* Header row: booking id + category + payment status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-sm font-semibold text-primary"
            aria-label={t("बुकिंग आईडी", "Booking ID")}
          >
            #{booking.id.toString()}
          </span>
          <Badge
            variant="outline"
            data-ocid={`my-bookings.item.${index}.category`}
            className={
              isDonation
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-primary/30 bg-primary/5 text-primary"
            }
          >
            {isDonation ? t("दान", "Donation") : t("बुकिंग", "Booking")}
          </Badge>
        </div>
        <Badge
          data-ocid={`my-bookings.item.${index}.payment_status`}
          className={cn("gap-1.5", meta.badge)}
        >
          <StatusIcon className="size-3" aria-hidden="true" />
          {t(meta.hi, meta.en)}
        </Badge>
      </div>

      {/* Service type */}
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
        {booking.serviceType}
      </h3>

      {/* Date / time */}
      <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-accent" aria-hidden="true" />
          <span>
            {booking.preferredDate || t("तिथि नहीं दी गई", "No date provided")}
          </span>
        </div>
        {booking.preferredTime && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-accent" aria-hidden="true" />
            <span>{booking.preferredTime}</span>
          </div>
        )}
      </div>

      {/* Advance amount + UPI reference */}
      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("अग्रिम राशि", "Advance Amount")}
          </p>
          <p className="mt-1 font-display text-base font-semibold text-foreground">
            {advanceAmount !== null
              ? `₹${advanceAmount}`
              : t("लागू नहीं", "Not applicable")}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("UPI संदर्भ आईडी", "UPI Reference ID")}
          </p>
          <p className="mt-1 break-words font-mono text-sm text-foreground">
            {booking.paymentReferenceId
              ? booking.paymentReferenceId
              : t("प्रदान नहीं किया गया", "Not provided")}
          </p>
        </div>
      </div>

      {/* WhatsApp contact action */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <a
          href={bookingWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`my-bookings.item.${index}.whatsapp_button`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-background px-4 py-2 text-sm font-semibold text-accent transition-smooth hover:bg-accent hover:text-accent-foreground"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {t("व्हाट्सएप पर पूछें", "Ask on WhatsApp")}
        </a>
      </div>
    </article>
  );
}

/** Loading skeleton for the bookings list. */
function BookingsSkeleton({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="my-bookings.loading_state"
      className="flex flex-col gap-4"
      aria-label={t("बुकिंग लोड हो रही है", "Loading bookings")}
    >
      {BOOKING_SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Empty state — no bookings found for the phone number. */
function BookingsEmpty({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="my-bookings.empty_state"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center"
    >
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        ॐ
      </span>
      <p className="font-display text-lg font-semibold text-primary">
        {t("कोई बुकिंग नहीं मिली", "No bookings found")}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t(
          "इस फ़ोन नंबर से कोई बुकिंग या दान रिकॉर्ड नहीं मिला। नई बुकिंग करने के लिए नीचे दिए गए लिंक का उपयोग करें।",
          "No booking or donation record found for this phone number. Use the link below to make a new booking.",
        )}
      </p>
      <Link
        to="/booking"
        data-ocid="my-bookings.empty_state.booking_link"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-flame px-5 py-2.5 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
      >
        <Calendar className="size-4" aria-hidden="true" />
        {t("बुकिंग पृष्ठ पर जाएँ", "Go to Booking Page")}
      </Link>
    </div>
  );
}

/** Error state — the lookup failed. */
function BookingsError({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="my-bookings.error_state"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center"
    >
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        ॐ
      </span>
      <p className="font-display text-lg font-semibold text-primary">
        {t("लुकअप विफल हुआ", "Lookup Failed")}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t(
          "बुकिंग लाने में असमर्थ। कृपया कुछ क्षण बाद पुनः प्रयास करें या सीधे संपर्क करें।",
          "Unable to fetch bookings. Please try again in a moment or contact us directly.",
        )}
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="my-bookings.error_state.whatsapp_link"
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent bg-background px-5 py-2.5 text-sm font-semibold text-accent transition-smooth hover:bg-accent hover:text-accent-foreground"
      >
        <Phone className="size-4" aria-hidden="true" />
        {t("संपर्क करें", "Contact Us")}
      </a>
    </div>
  );
}

/** Pre-search prompt — shown before the user submits a phone number. */
function SearchPrompt({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="my-bookings.search_prompt"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred"
        aria-hidden="true"
      >
        <Search className="size-6" />
      </span>
      <p className="font-display text-lg font-semibold text-primary">
        {t("अपनी बुकिंग खोजें", "Find Your Bookings")}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t(
          "ऊपर अपना फ़ोन नंबर दर्ज करें और अपनी सभी बुकिंग एवं दान रिकॉर्ड देखें।",
          "Enter your phone number above to view all your bookings and donation records.",
        )}
      </p>
    </div>
  );
}

/** Bilingual legend explaining each payment status. */
function PaymentStatusLegend({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  const items: {
    status: PaymentStatusValue;
    hiDesc: string;
    enDesc: string;
  }[] = [
    {
      status: PaymentStatus.pendingVerification,
      hiDesc: "भुगतान प्राप्त हुआ है और पंडित जी द्वारा सत्यापन लंबित है।",
      enDesc: "Payment received, awaiting verification by Pandit Ji.",
    },
    {
      status: PaymentStatus.verified,
      hiDesc: "भुगतान सत्यापित हो गया है।",
      enDesc: "Payment has been verified.",
    },
    {
      status: PaymentStatus.failed,
      hiDesc: "भुगतान विफल हो गया या सत्यापन अस्वीकृत हो गया। कृपया संपर्क करें।",
      enDesc: "Payment failed or verification declined. Please contact us.",
    },
    {
      status: PaymentStatus.notApplicable,
      hiDesc: "इस रिकॉर्ड के लिए कोई अग्रिम भुगतान लागू नहीं है।",
      enDesc: "No advance payment applies to this record.",
    },
  ];

  return (
    <div
      data-ocid="my-bookings.legend.section"
      className="mx-auto mt-12 max-w-3xl"
      aria-label={t("भुगतान स्थिति विवरण", "Payment status legend")}
    >
      <h2 className="font-display text-xl font-semibold text-primary">
        {t("भुगतान स्थिति विवरण", "Payment Status Legend")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const meta = PAYMENT_STATUS_META[item.status];
          const Icon = meta.icon;
          return (
            <li
              key={item.status}
              data-ocid={`my-bookings.legend.item.${item.status}`}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  meta.badge,
                )}
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {t(meta.hi, meta.en)}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t(item.hiDesc, item.enDesc)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
