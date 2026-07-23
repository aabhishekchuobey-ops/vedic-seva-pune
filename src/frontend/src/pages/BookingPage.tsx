import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, usePackages, useServices } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import {
  CALL_URL,
  CONTACT_PHONE,
  PANDIT_NAME,
  UPI_NOTE,
  UPI_PAYEE_NAME,
  UPI_VPA,
  WHATSAPP_URL,
  buildUpiDeepLink,
} from "@/utils/constants";
import {
  BookingCategory,
  type BookingCategoryValue,
  type BookingDraft,
  LanguagePreference,
  type LanguagePreferenceValue,
  PaymentStatus,
  type PaymentStatusValue,
} from "@/utils/types";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  MessageCircle,
  Phone,
  QrCode,
  Smartphone,
  Zap,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/** Booking option metadata (bilingual). */
interface BookingOption {
  id: BookingType;
  icon: typeof Zap;
  hi: string;
  en: string;
  hiDesc: string;
  enDesc: string;
}

type BookingType = "sameDay" | "advance" | "whatsapp";

const BOOKING_OPTIONS: BookingOption[] = [
  {
    id: "sameDay",
    icon: Zap,
    hi: "समान दिन बुकिंग",
    en: "Same Day Booking",
    hiDesc: "आज ही पंडित जी की सेवा चाहिए — तुरंत बुक करें।",
    enDesc: "Need Pandit Ji's service today — book instantly.",
  },
  {
    id: "advance",
    icon: CalendarClock,
    hi: "अग्रिम बुकिंग",
    en: "Advance Booking",
    hiDesc: "अपनी शुभ तिथि के लिए पहले से आरक्षण करें।",
    enDesc: "Reserve your auspicious date in advance.",
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    hi: "व्हाट्सएप बुकिंग",
    en: "WhatsApp Booking",
    hiDesc: "सीधे व्हाट्सएप पर संदेश भेकर बुक करें।",
    enDesc: "Book directly by sending a WhatsApp message.",
  },
];

/** Form values for the booking form (validated via react-hook-form rules). */
interface FormValues {
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  preferredDate: string;
  preferredTime?: string;
  address: string;
  languagePreference: LanguagePreferenceValue;
  specialNotes?: string;
}

/** Summary of a submitted booking shown in the confirmation view. */
interface SubmittedBooking {
  name: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  paymentStatus: PaymentStatusValue;
  advanceAmount?: number;
}

export function BookingPage() {
  const language = useAppStore((s) => s.language);
  const bookingDraft = useAppStore((s) => s.bookingDraft);
  const setBookingDraft = useAppStore((s) => s.setBookingDraft);
  const resetBookingDraft = useAppStore((s) => s.resetBookingDraft);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: packages = [] } = usePackages();
  const createBooking = useCreateBooking();

  const [bookingType, setBookingType] = useState<BookingType>("sameDay");
  const [submittedBooking, setSubmittedBooking] =
    useState<SubmittedBooking | null>(null);
  // Pending form values held while the advance payment step is shown.
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      name: bookingDraft.name,
      phone: bookingDraft.phone,
      email: bookingDraft.email,
      serviceType: bookingDraft.serviceType,
      preferredDate: bookingDraft.preferredDate,
      preferredTime: bookingDraft.preferredTime,
      address: bookingDraft.address,
      languagePreference: bookingDraft.languagePreference,
      specialNotes: bookingDraft.specialNotes,
    },
  });

  // Keep the persisted draft in sync as the user edits.
  useEffect(() => {
    const sub = form.watch((value) => {
      setBookingDraft({
        name: value.name ?? "",
        phone: value.phone ?? "",
        email: value.email ?? "",
        serviceType: value.serviceType ?? "",
        preferredDate: value.preferredDate ?? "",
        preferredTime: value.preferredTime ?? "",
        address: value.address ?? "",
        languagePreference:
          (value.languagePreference as LanguagePreferenceValue) ??
          LanguagePreference.Hindi,
        specialNotes: value.specialNotes ?? "",
      } satisfies BookingDraft);
    });
    return () => sub.unsubscribe();
  }, [form, setBookingDraft]);

  const today = new Date().toISOString().split("T")[0];

  // Watched at the top level so the memo below re-runs when the service changes.
  const serviceType = form.watch("serviceType");

  /** Resolve the package whose name matches the selected service, if any. */
  const selectedPackage = useMemo(
    () =>
      serviceType
        ? (packages.find((p) => p.name.en === serviceType) ?? null)
        : null,
    [packages, serviceType],
  );

  /** Submit the booking to the backend with the given payment fields. */
  async function submitBooking(
    values: FormValues,
    paymentStatus: PaymentStatusValue,
    advanceAmount?: number,
  ) {
    const draft: BookingDraft = {
      name: values.name,
      phone: values.phone,
      email: values.email ?? "",
      serviceType: values.serviceType,
      preferredDate: values.preferredDate,
      preferredTime: values.preferredTime ?? "",
      address: values.address,
      languagePreference: values.languagePreference,
      specialNotes: values.specialNotes ?? "",
      upiVPA: advanceAmount ? UPI_VPA : undefined,
      advanceAmount: advanceAmount ? BigInt(advanceAmount) : undefined,
      paymentStatus,
      bookingCategory: BookingCategory.booking,
    };
    await createBooking.mutateAsync(draft);
    setSubmittedBooking({
      name: values.name,
      serviceType: values.serviceType,
      preferredDate: values.preferredDate,
      preferredTime: values.preferredTime ?? "",
      paymentStatus,
      advanceAmount,
    });
    resetBookingDraft();
    form.reset({
      name: "",
      phone: "",
      email: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      address: "",
      languagePreference: LanguagePreference.Hindi,
      specialNotes: "",
    });
  }

  async function onSubmit(values: FormValues) {
    try {
      if (bookingType === "advance") {
        // Hold the values and show the payment step before recording.
        setPendingValues(values);
        return;
      }
      // sameDay: record immediately without payment.
      await submitBooking(values, PaymentStatus.notApplicable);
      toast.success(t("बुकिंग अनुरोध भेजा गया!", "Booking request sent!"), {
        description: t(
          "पंडित जी शीघ्र ही संपर्क करेंगे।",
          "Pandit Ji will contact you shortly.",
        ),
      });
    } catch (err) {
      toast.error(t("बुकिंग विफल हुई", "Booking failed"), {
        description:
          err instanceof Error
            ? err.message
            : t("कृपया पुनः प्रयास करें या कॉल करें।", "Please try again or call."),
      });
    }
  }

  /** Confirm payment was made — record booking with pendingVerification. */
  async function onConfirmPaid(amount: number) {
    if (!pendingValues) return;
    try {
      await submitBooking(
        pendingValues,
        PaymentStatus.pendingVerification,
        amount,
      );
      setPendingValues(null);
      toast.success(t("बुकिंग दर्ज हो गई! 🙏", "Booking recorded! 🙏"), {
        description: t(
          "भुगतान सत्यापन की प्रतीक्षा में है।",
          "Payment is pending verification.",
        ),
      });
    } catch (err) {
      toast.error(t("बुकिंग विफल हुई", "Booking failed"), {
        description:
          err instanceof Error
            ? err.message
            : t("कृपया पुनः प्रयास करें।", "Please try again."),
      });
    }
  }

  /** Skip payment now — record booking without payment. */
  async function onPayLater() {
    if (!pendingValues) return;
    try {
      await submitBooking(pendingValues, PaymentStatus.notApplicable);
      setPendingValues(null);
      toast.success(t("बुकिंग अनुरोध भेजा गया!", "Booking request sent!"), {
        description: t("आप बाद में भुगतान कर सकते हैं।", "You can pay later."),
      });
    } catch (err) {
      toast.error(t("बुकिंग विफल हुई", "Booking failed"), {
        description:
          err instanceof Error
            ? err.message
            : t("कृपया पुनः प्रयास करें।", "Please try again."),
      });
    }
  }

  // Payment step (advance bookings only).
  if (pendingValues) {
    return (
      <PaymentView
        t={t}
        values={pendingValues}
        pkg={selectedPackage}
        isSubmitting={createBooking.isPending}
        onConfirmPaid={onConfirmPaid}
        onPayLater={onPayLater}
        onBack={() => setPendingValues(null)}
      />
    );
  }

  if (submittedBooking) {
    return (
      <ConfirmationView
        t={t}
        booking={submittedBooking}
        onNewBooking={() => setSubmittedBooking(null)}
      />
    );
  }

  return (
    <section
      data-ocid="booking.page"
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* Page header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-flame px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sacred">
          🕉 {t("बुकिंग", "Booking")}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">
          {t("पूजा/हवन बुकिंग", "Puja / Havan Booking")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t(
            "अपनी शुभ तिथि के लिए पंडित अभिषेक शास्त्री जी की सेवा आरक्षित करें।",
            "Reserve Pandit Abhishek Shastri Ji's service for your auspicious occasion.",
          )}
        </p>
      </div>

      {/* Booking options */}
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
        {BOOKING_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = bookingType === opt.id;
          return (
            <Card
              key={opt.id}
              data-ocid={`booking.option.${opt.id}`}
              className={`border-border bg-card shadow-sm transition-smooth hover:shadow-md hover:border-accent ${
                isActive
                  ? "border-primary ring-2 ring-primary/30 shadow-md"
                  : ""
              }`}
            >
              <CardContent className="flex flex-col items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-semibold text-primary">
                  {t(opt.hi, opt.en)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(opt.hiDesc, opt.enDesc)}
                </p>
                {opt.id === "whatsapp" ? (
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`booking.option.${opt.id}.action`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    {t("व्हाट्सएप पर बुक करें", "Book on WhatsApp")}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType(opt.id);
                      document
                        .getElementById("booking-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-ocid={`booking.option.${opt.id}.action`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                  >
                    {t("नीचे फॉर्म भरें", "Fill the form below")}
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Booking form */}
      <div id="booking-form" className="mx-auto mt-12 max-w-3xl scroll-mt-24">
        <Card data-ocid="booking.form.card" className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-primary">
              {t("बुकिंग विवरण", "Booking Details")}
            </CardTitle>
            <CardDescription>
              {bookingType === "advance"
                ? t(
                    "अग्रिम बुकिंग — फॉर्म जमा करने के बाद अग्रिम राशि का भुगतान चरण दिखेगा।",
                    "Advance booking — after submitting the form, an advance payment step will appear.",
                  )
                : t(
                    "निम्नलिखित विवरण भरें — चिह्नित फ़ील्ड अनिवार्य हैं।",
                    "Fill in the details below — fields marked with * are required.",
                  )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-5"
                noValidate
              >
                {/* Name + Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{
                      required: t("नाम आवश्यक है", "Name is required"),
                      minLength: {
                        value: 2,
                        message: t(
                          "नाम कम से कम 2 अक्षर का होना चाहिए",
                          "Name must be at least 2 characters",
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          {t("नाम *", "Name *")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-ocid="booking.form.name"
                            placeholder={t("आपका पूरा नाम", "Your full name")}
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{
                      required: t(
                        "फ़ोन नंबर आवश्यक है",
                        "Phone number is required",
                      ),
                      pattern: {
                        value: /^[0-9+\-\s]{10,15}$/,
                        message: t(
                          "मान्य फ़ोन नंबर दर्ज करें",
                          "Enter a valid phone number",
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          {t("फ़ोन *", "Phone *")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-ocid="booking.form.phone"
                            type="tel"
                            inputMode="tel"
                            placeholder={t(
                              "10 अंकों का मोबाइल नंबर",
                              "10-digit mobile number",
                            )}
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email (optional) */}
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t(
                        "मान्य ईमेल पता दर्ज करें",
                        "Enter a valid email address",
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        {t("ईमेल (वैकल्पिक)", "Email (optional)")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-ocid="booking.form.email"
                          type="email"
                          placeholder={t("आपका ईमेल पता", "Your email address")}
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "पुष्टिकरण के लिए — आवश्यक नहीं।",
                          "For confirmation — not required.",
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service type */}
                <FormField
                  control={form.control}
                  name="serviceType"
                  rules={{
                    required: t("सेवा प्रकार चुनें", "Please select a service type"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        {t("पूजा/सेवा प्रकार *", "Puja / Service Type *")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={servicesLoading}
                      >
                        <FormControl>
                          <SelectTrigger
                            data-ocid="booking.form.serviceType"
                            className="w-full"
                          >
                            <SelectValue
                              placeholder={
                                servicesLoading
                                  ? t(
                                      "सेवाएँ लोड हो रही हैं...",
                                      "Loading services...",
                                    )
                                  : t("एक सेवा चुनें", "Select a service")
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((svc) => (
                            <SelectItem
                              key={svc.id.toString()}
                              value={svc.name.en}
                              data-ocid={`booking.form.serviceType.option.${svc.id}`}
                            >
                              {t(svc.name.hi, svc.name.en)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date + Time */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    rules={{
                      required: t("तिथि चुनें", "Please select a preferred date"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          {t("तिथि *", "Preferred Date *")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-ocid="booking.form.preferredDate"
                            type="date"
                            min={today}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          {t("समय (वैकल्पिक)", "Preferred Time (optional)")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-ocid="booking.form.preferredTime"
                            type="time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  rules={{
                    required: t("पता आवश्यक है", "Address is required"),
                    minLength: {
                      value: 5,
                      message: t(
                        "पता कम से कम 5 अक्षर का होना चाहिए",
                        "Address must be at least 5 characters",
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        {t("पता/स्थान *", "Address / Venue *")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          data-ocid="booking.form.address"
                          rows={2}
                          placeholder={t(
                            "पूजा स्थल का पूरा पता (पुणे क्षेत्र)",
                            "Full address of the puja venue (Pune area)",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "वर्तमान में केवल पुणे क्षेत्र की सेवा उपलब्ध है।",
                          "Currently serving the Pune area only.",
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language preference */}
                <FormField
                  control={form.control}
                  name="languagePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        {t("भाषा", "Language Preference")}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          data-ocid="booking.form.languagePreference"
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid gap-2 sm:grid-cols-3"
                        >
                          {(
                            [
                              {
                                value: LanguagePreference.Hindi,
                                hi: "हिंदी",
                                en: "Hindi",
                              },
                              {
                                value: LanguagePreference.English,
                                hi: "अंग्रेज़ी",
                                en: "English",
                              },
                              {
                                value: LanguagePreference.Bilingual,
                                hi: "द्विभाषी",
                                en: "Bilingual",
                              },
                            ] as const
                          ).map((opt) => (
                            <label
                              key={opt.value}
                              htmlFor={`lang-${opt.value}`}
                              data-ocid={`booking.form.languagePreference.option.${opt.value}`}
                              className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition-smooth hover:border-accent hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                            >
                              <RadioGroupItem
                                id={`lang-${opt.value}`}
                                value={opt.value}
                              />
                              <span className="font-medium text-foreground">
                                {t(opt.hi, opt.en)}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Special notes */}
                <FormField
                  control={form.control}
                  name="specialNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        {t("विशेष नोट्स (वैकल्पिक)", "Special Notes (optional)")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          data-ocid="booking.form.specialNotes"
                          rows={3}
                          placeholder={t(
                            "कोई विशेष आवश्यकता, संकल्प, या जानकारी...",
                            "Any special requirements, sankalp, or information...",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    data-ocid="booking.form.submit"
                    size="lg"
                    disabled={createBooking.isPending}
                    className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
                  >
                    {createBooking.isPending
                      ? t("भेजा जा रहा है...", "Submitting...")
                      : bookingType === "advance"
                        ? t("अग्रिम बुकिंग जारी रखें", "Continue to Advance Booking")
                        : t("बुकिंग अनुरोध भेजें", "Submit Booking Request")}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {bookingType === "advance"
                      ? t(
                          "अगले चरण में अग्रिम राशि का भुगतान होगा।",
                          "The next step collects the advance payment.",
                        )
                      : t(
                          "सबमिट करने पर पंडित जी आपसे संपर्क करेंगे।",
                          "On submission, Pandit Ji will contact you.",
                        )}
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/** Payment step shown after the advance booking form is submitted. */
function PaymentView({
  t,
  values,
  pkg,
  isSubmitting,
  onConfirmPaid,
  onPayLater,
  onBack,
}: {
  t: (hi: string, en: string) => string;
  values: FormValues;
  pkg: { priceMinRupees: bigint; priceMaxRupees: bigint } | null;
  isSubmitting: boolean;
  onConfirmPaid: (amount: number) => void;
  onPayLater: () => void;
  onBack: () => void;
}) {
  const min = pkg ? Number(pkg.priceMinRupees) : 101;
  const max = pkg ? Number(pkg.priceMaxRupees) : 1001;
  const [amount, setAmount] = useState<number>(min);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrError, setQrError] = useState<string>("");

  // Clamp the amount if the package changes.
  useEffect(() => {
    setAmount((prev) => {
      if (prev < min) return min;
      if (prev > max) return max;
      return prev;
    });
  }, [min, max]);

  const upiLink = useMemo(
    () => buildUpiDeepLink(UPI_VPA, UPI_PAYEE_NAME, amount, UPI_NOTE),
    [amount],
  );

  // Generate the QR code client-side whenever the UPI link changes.
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(upiLink, {
      margin: 1,
      width: 240,
      color: { dark: "#3b1d0a", light: "#fffaf0" },
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url);
          setQrError("");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setQrError(
            err instanceof Error
              ? err.message
              : t("QR कोड बनाने में विफल", "Failed to generate QR code"),
          );
          setQrDataUrl("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [upiLink, t]);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      setAmount(min);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(Math.max(parsed, min), max);
    setAmount(clamped);
  }

  function handlePayClick() {
    // Open the UPI deep-link in a new window; on mobile this triggers the
    // UPI app chooser. On desktop it may show "no handler" — the QR code
    // and manual entry cover that case.
    window.open(upiLink, "_blank", "noopener,noreferrer");
  }

  async function handleCopyVpa() {
    try {
      await navigator.clipboard.writeText(UPI_VPA);
      toast.success(t("UPI ID कॉपी हुई", "UPI ID copied"));
    } catch {
      toast.error(t("कॉपी विफल", "Copy failed"));
    }
  }

  return (
    <section
      data-ocid="booking.payment.page"
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          data-ocid="booking.payment.back"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t("फॉर्म पर वापस", "Back to form")}
        </button>

        <Card
          data-ocid="booking.payment.card"
          className="border-accent/40 shadow-md"
        >
          <CardHeader className="text-center">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred"
              aria-hidden="true"
            >
              <CreditCard className="size-8" />
            </span>
            <CardTitle className="mt-4 font-display text-3xl text-primary">
              🕉 {t("अग्रिम भुगतान", "Advance Payment")}
            </CardTitle>
            <CardDescription className="text-base">
              {t(
                `${values.name} जी, अपनी बुकिंग की पुष्टि के लिए अग्रिम राशि का भुगतान करें।`,
                `${values.name}, please pay the advance amount to confirm your booking.`,
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Amount editor */}
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <label
                htmlFor="advance-amount"
                className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {t("अग्रिम राशि (₹)", "Advance Amount (₹)")}
              </label>
              <Input
                id="advance-amount"
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={amount}
                onChange={handleAmountChange}
                data-ocid="booking.payment.amount"
                className="mt-2 text-lg font-semibold text-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {pkg
                  ? t(
                      `पैकेज श्रेणी: ₹${min} – ₹${max}`,
                      `Package range: ₹${min} – ₹${max}`,
                    )
                  : t(
                      `सुझाया गया: ₹${min} – ₹${max}`,
                      `Suggested: ₹${min} – ₹${max}`,
                    )}
              </p>
            </div>

            {/* UPI deep-link button */}
            <Button
              type="button"
              onClick={handlePayClick}
              data-ocid="booking.payment.upi_button"
              size="lg"
              className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
            >
              <Smartphone className="size-5" aria-hidden="true" />
              {t("UPI / GPay से भुगतान करें", "Pay via UPI / GPay")}
            </Button>

            {/* QR code */}
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <QrCode className="size-4" aria-hidden="true" />
                {t("QR कोड स्कैन करें", "Scan the QR Code")}
              </div>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={t("UPI भुगतान QR कोड", "UPI payment QR code")}
                  data-ocid="booking.payment.qr_code"
                  width={240}
                  height={240}
                  className="rounded-md border border-border shadow-sm"
                />
              ) : qrError ? (
                <p
                  data-ocid="booking.payment.qr_error"
                  className="text-sm text-destructive"
                >
                  {qrError}
                </p>
              ) : (
                <div
                  data-ocid="booking.payment.qr_loading"
                  className="flex h-[240px] w-[240px] items-center justify-center rounded-md border border-border bg-muted text-sm text-muted-foreground"
                >
                  {t("QR कोड बन रहा है...", "Generating QR code...")}
                </div>
              )}
              <p className="text-center text-xs text-muted-foreground">
                {t(
                  "किसी भी UPI ऐप (GPay, PhonePe, Paytm) से स्कैन करें।",
                  "Scan with any UPI app (GPay, PhonePe, Paytm).",
                )}
              </p>
            </div>

            {/* Manual UPI entry */}
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("मैन्युअल एंट्री", "Manual Entry")}
              </h3>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">
                    {t("UPI ID:", "UPI ID:")}
                  </dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono font-medium text-foreground">
                      {UPI_VPA}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      data-ocid="booking.payment.copy_vpa"
                      aria-label={t("UPI ID कॉपी करें", "Copy UPI ID")}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:border-accent hover:text-accent"
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </button>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">
                    {t("प्राप्तकर्ता:", "Payee:")}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {UPI_PAYEE_NAME}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">
                    {t("राशि:", "Amount:")}
                  </dt>
                  <dd className="font-medium text-foreground">₹{amount}</dd>
                </div>
              </dl>
            </div>

            {/* Confirm / pay later */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => onConfirmPaid(amount)}
                data-ocid="booking.payment.confirm_paid"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
              >
                <Check className="size-5" aria-hidden="true" />
                {isSubmitting
                  ? t("दर्ज किया जा रहा है...", "Recording...")
                  : t("मैंने भुगतान कर दिया है", "I have paid")}
              </Button>
              <Button
                type="button"
                onClick={onPayLater}
                data-ocid="booking.payment.pay_later"
                size="lg"
                variant="outline"
                disabled={isSubmitting}
              >
                <Clock className="size-5" aria-hidden="true" />
                {t("बाद में भुगतान करें", "Pay later")}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {t(
                  "“मैंने भुगतान कर दिया है” चुनने पर बुकिंग सत्यापन की प्रतीक्षा में दर्ज होगी। “बाद में भुगतान करें” से बिना भुगतान बुकिंग होगी।",
                  "Choosing “I have paid” records the booking pending verification. “Pay later” records it without payment.",
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/** Confirmation view shown after a successful booking submission. */
function ConfirmationView({
  t,
  booking,
  onNewBooking,
}: {
  t: (hi: string, en: string) => string;
  booking: SubmittedBooking;
  onNewBooking: () => void;
}) {
  const isPendingVerification =
    booking.paymentStatus === PaymentStatus.pendingVerification;
  const isNotApplicable = booking.paymentStatus === PaymentStatus.notApplicable;

  // WhatsApp prefilled message to share the UPI reference.
  const shareText = encodeURIComponent(
    `जय श्री राम 🙏\nमैंने ${booking.serviceType} के लिए अग्रिम भुगतान किया है।\nबुकिंग तिथि: ${booking.preferredDate}\nकृपया सत्यापन करें।\n\nJai Shri Ram 🙏\nI have made the advance payment for ${booking.serviceType}.\nBooking date: ${booking.preferredDate}\nPlease verify.`,
  );
  const shareWhatsappUrl = `https://wa.me/91${CONTACT_PHONE}?text=${shareText}`;

  return (
    <section
      data-ocid="booking.confirmation.page"
      className="container mx-auto px-4 py-16"
    >
      <div className="mx-auto max-w-2xl">
        <Card
          data-ocid="booking.confirmation.card"
          className="border-accent/40 shadow-md"
        >
          <CardHeader className="text-center">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred"
              aria-hidden="true"
            >
              <CheckCircle2 className="size-8" />
            </span>
            <CardTitle className="mt-4 font-display text-3xl text-primary">
              {t("बुकिंग प्राप्त हुई! 🙏", "Booking Received! 🙏")}
            </CardTitle>
            <CardDescription className="text-base">
              {t(
                `${booking.name} जी, आपका अनुरोध प्राप्त हो गया है।`,
                `${booking.name}, your request has been received.`,
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Booking summary */}
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("आपकी बुकिंग", "Your Booking")}
              </h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">
                    {t("सेवा:", "Service:")}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {booking.serviceType}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t("तिथि:", "Date:")}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {booking.preferredDate}
                  </dd>
                </div>
                {booking.preferredTime && (
                  <div>
                    <dt className="text-muted-foreground">
                      {t("समय:", "Time:")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {booking.preferredTime}
                    </dd>
                  </div>
                )}
                {booking.advanceAmount !== undefined && (
                  <div>
                    <dt className="text-muted-foreground">
                      {t("अग्रिम राशि:", "Advance:")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      ₹{booking.advanceAmount}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Payment status */}
            <Alert
              data-ocid="booking.confirmation.payment_status"
              className={
                isPendingVerification
                  ? "border-warning/50 bg-warning/10"
                  : "border-accent/40 bg-accent/5"
              }
            >
              <CreditCard
                className={`size-4 ${isPendingVerification ? "text-warning" : "text-accent"}`}
                aria-hidden="true"
              />
              <AlertTitle className="font-display text-lg text-primary">
                {t("भुगतान स्थिति", "Payment Status")}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {isPendingVerification
                  ? t(
                      "सत्यापन की प्रतीक्षा में — कृपया अपनी UPI लेन-देन संदर्भ संख्या व्हाट्सएप पर 9026828075 पर साझा करें ताकि पंडित जी भुगतान सत्यापित कर सकें।",
                      "Pending verification — please share your UPI transaction reference id on WhatsApp at 9026828075 so Pandit Ji can verify the payment.",
                    )
                  : isNotApplicable
                    ? t(
                        "कोई अग्रिम भुगतान नहीं — पंडित जी आपसे संपर्क करेंगे।",
                        "No advance payment — Pandit Ji will contact you.",
                      )
                    : t(
                        "भुगतान सत्यापित हो गया है। 🙏",
                        "Payment has been verified. 🙏",
                      )}
              </AlertDescription>
            </Alert>

            {/* Follow-up contact */}
            <Alert
              data-ocid="booking.confirmation.contact"
              className="border-accent/40 bg-accent/5"
            >
              <Phone className="size-4 text-accent" aria-hidden="true" />
              <AlertTitle className="font-display text-lg text-primary">
                {t("अगला कदम — संपर्क करें", "Next Step — Get in Touch")}
              </AlertTitle>
              <AlertDescription className="text-sm">
                <p className="leading-relaxed">
                  {t(
                    `${PANDIT_NAME.hi} जल्द ही आपसे संपर्क करेंगे। तत्काल पुष्टि के लिए सीधे कॉल या व्हाट्सएप करें:`,
                    `${PANDIT_NAME.en} will contact you soon. For immediate confirmation, call or WhatsApp directly:`,
                  )}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={CALL_URL}
                    data-ocid="booking.confirmation.call"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-flame px-5 py-2.5 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
                  >
                    <Phone className="size-4" aria-hidden="true" />📞{" "}
                    {CONTACT_PHONE}
                  </a>
                  {isPendingVerification ? (
                    <a
                      href={shareWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="booking.confirmation.share_reference"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-background px-5 py-2.5 text-sm font-semibold text-accent transition-smooth hover:bg-accent hover:text-accent-foreground"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      {t("UPI संदर्भ साझा करें", "Share UPI Reference")}
                    </a>
                  ) : (
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="booking.confirmation.whatsapp"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-background px-5 py-2.5 text-sm font-semibold text-accent transition-smooth hover:bg-accent hover:text-accent-foreground"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      {t("व्हाट्सएप", "WhatsApp")}
                    </a>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <Button
              type="button"
              variant="outline"
              data-ocid="booking.confirmation.new_booking"
              onClick={onNewBooking}
              className="self-center"
            >
              {t("नई बुकिंग करें", "Make Another Booking")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
