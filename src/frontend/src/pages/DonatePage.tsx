import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDonation, useSiteConfig } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import {
  CONTACT_PHONE,
  DONATION_SUGGESTED_AMOUNTS,
  UPI_NOTE,
  UPI_PAYEE_NAME,
  UPI_VPA,
  WHATSAPP_URL,
  buildUpiDeepLink,
} from "@/utils/constants";
import type { BilingualText } from "@/utils/types";
import { Check, Heart, QrCode, Smartphone, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/** Local form state for the donation page. */
interface DonationForm {
  amount: string;
  donorName: string;
  donorPhone: string;
  donorMessage: string;
  paymentReferenceId: string;
}

/** Submitted donation summary shown in the thank-you view. */
interface SubmittedDonation {
  donorName: string;
  donorPhone: string;
  amount: bigint;
  donorMessage: BilingualText;
  paymentReferenceId: string;
}

const EMPTY_FORM: DonationForm = {
  amount: "",
  donorName: "",
  donorPhone: "",
  donorMessage: "",
  paymentReferenceId: "",
};

export function DonatePage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  const { data: siteConfig } = useSiteConfig();
  const createDonation = useCreateDonation();

  const [form, setForm] = useState<DonationForm>(EMPTY_FORM);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [submitted, setSubmitted] = useState<SubmittedDonation | null>(null);

  // Resolve UPI details from site config, falling back to constants.
  const vpa = siteConfig?.upiVPA ?? UPI_VPA;
  const payeeName = siteConfig?.upiPayeeName ?? UPI_PAYEE_NAME;
  const note = siteConfig?.upiNote ?? UPI_NOTE;

  const amountNum = useMemo(() => {
    const parsed = Number(form.amount);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [form.amount]);

  const upiLink = useMemo(
    () => buildUpiDeepLink(vpa, payeeName, amountNum || undefined, note),
    [vpa, payeeName, amountNum, note],
  );

  // Generate the QR code from the UPI deep link whenever it changes.
  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const QRCode = await import("qrcode");
        const dataUrl = await QRCode.toDataURL(upiLink, {
          margin: 1,
          width: 240,
          color: { dark: "#3d1f0a", light: "#fffaf2" },
        });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    }
    void generate();
    return () => {
      cancelled = true;
    };
  }, [upiLink]);

  function setField<K extends keyof DonationForm>(
    key: K,
    value: DonationForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function selectAmount(amount: number) {
    setForm((prev) => ({ ...prev, amount: String(amount) }));
  }

  async function handleConfirmDonation() {
    if (amountNum <= 0) {
      toast.error(t("कृपया राशि दर्ज करें", "Please enter an amount"));
      return;
    }
    const donorMessage: BilingualText = {
      hi: form.donorMessage.trim(),
      en: form.donorMessage.trim(),
    };
    try {
      await createDonation.mutateAsync({
        donorName: form.donorName.trim(),
        donorPhone: form.donorPhone.trim(),
        amount: BigInt(amountNum),
        donorMessage,
        paymentReferenceId: form.paymentReferenceId.trim() || undefined,
      });
      setSubmitted({
        donorName: form.donorName.trim(),
        donorPhone: form.donorPhone.trim(),
        amount: BigInt(amountNum),
        donorMessage,
        paymentReferenceId: form.paymentReferenceId.trim(),
      });
      setForm(EMPTY_FORM);
      toast.success(t("दान दर्ज हो गया! 🙏", "Donation recorded! 🙏"), {
        description: t(
          "आपके योगदान के लिए ढेरों धन्यवाद।",
          "Thank you so much for your contribution.",
        ),
      });
    } catch (err) {
      toast.error(t("दान दर्ज करने में विफल", "Failed to record donation"), {
        description:
          err instanceof Error
            ? err.message
            : t("कृपया पुनः प्रयास करें।", "Please try again."),
      });
    }
  }

  function openUpiDeepLink() {
    if (amountNum <= 0) {
      toast.error(t("कृपया पहले राशि दर्ज करें", "Please enter an amount first"));
      return;
    }
    window.open(upiLink, "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <ThankYouView
        t={t}
        donation={submitted}
        onNewDonation={() => setSubmitted(null)}
      />
    );
  }

  return (
    <section
      data-ocid="donate.page"
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-flame text-3xl text-white shadow-sacred"
          aria-hidden="true"
        >
          ॐ
        </span>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-flame px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sacred">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {t("सेवा दक्षिणा", "Seva Dakshina")}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">
          {t("दान करें", "Make a Donation")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t(
            "आपका दान पूजा-हवन, वैदिक अनुष्ठान एवं सामाजिक कार्यों में सहयोग करता है। सेवा दक्षिणा स्वीकार कर पुण्य अर्जित करें। जय श्री राम 🙏",
            "Your donation supports puja, havan, Vedic rituals, and community service. Offer your seva dakshina and earn blessings. Jai Shri Ram 🙏",
          )}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Left: donation form */}
        <Card
          data-ocid="donate.form.card"
          className="border-border shadow-sacred"
        >
          <CardHeader>
            <CardTitle className="font-display text-2xl text-primary">
              {t("दान राशि चुनें", "Choose Donation Amount")}
            </CardTitle>
            <CardDescription>
              {t(
                "नीचे दी गई राशियों में से चुनें या अपनी इच्छानुसार राशि दर्ज करें।",
                "Pick from the suggested amounts or enter your own.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Suggested amounts */}
            <div
              data-ocid="donate.suggested_amounts"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {DONATION_SUGGESTED_AMOUNTS.map((amt, idx) => {
                const selected = form.amount === String(amt);
                return (
                  <button
                    key={amt}
                    type="button"
                    data-ocid={`donate.suggested_amount.item.${idx}`}
                    onClick={() => selectAmount(amt)}
                    aria-pressed={selected}
                    className={`relative flex flex-col items-center justify-center rounded-lg border px-4 py-4 transition-smooth ${
                      selected
                        ? "border-accent bg-accent/10 shadow-sacred"
                        : "border-border bg-background hover:border-accent hover:bg-muted"
                    }`}
                  >
                    <span className="font-display text-xl font-semibold text-primary">
                      ₹{amt}
                    </span>
                    {selected && (
                      <span
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-flame text-white"
                        aria-hidden="true"
                      >
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom amount */}
            <div className="grid gap-2">
              <Label htmlFor="donate-amount" className="text-foreground">
                {t("अपनी राशि दर्ज करें (₹)", "Enter Custom Amount (₹)")}
              </Label>
              <Input
                id="donate-amount"
                data-ocid="donate.form.amount"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder={t("उदा. 251", "e.g. 251")}
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
              />
            </div>

            {/* Donor name + phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="donate-name" className="text-foreground">
                  {t("नाम (वैकल्पिक)", "Name (optional)")}
                </Label>
                <Input
                  id="donate-name"
                  data-ocid="donate.form.name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("आपका नाम", "Your name")}
                  value={form.donorName}
                  onChange={(e) => setField("donorName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="donate-phone" className="text-foreground">
                  {t("फ़ोन (वैकल्पिक)", "Phone (optional)")}
                </Label>
                <Input
                  id="donate-phone"
                  data-ocid="donate.form.phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t("10 अंकों का नंबर", "10-digit number")}
                  value={form.donorPhone}
                  onChange={(e) => setField("donorPhone", e.target.value)}
                />
              </div>
            </div>

            {/* Donor message */}
            <div className="grid gap-2">
              <Label htmlFor="donate-message" className="text-foreground">
                {t("संदेश (वैकल्पिक)", "Message (optional)")}
              </Label>
              <Textarea
                id="donate-message"
                data-ocid="donate.form.message"
                rows={3}
                placeholder={t(
                  "अपनी भावना या संकल्प यहाँ लिखें...",
                  "Share your sentiment or sankalp here...",
                )}
                value={form.donorMessage}
                onChange={(e) => setField("donorMessage", e.target.value)}
              />
            </div>

            {/* Payment reference (optional) */}
            <div className="grid gap-2">
              <Label htmlFor="donate-ref" className="text-foreground">
                {t("UPI रेफरेंस आईडी (वैकल्पिक)", "UPI Reference ID (optional)")}
              </Label>
              <Input
                id="donate-ref"
                data-ocid="donate.form.reference"
                type="text"
                placeholder={t(
                  "भुगतान का 12-अंकीय UTR / संदर्भ",
                  "12-digit UTR / payment reference",
                )}
                value={form.paymentReferenceId}
                onChange={(e) => setField("paymentReferenceId", e.target.value)}
              />
            </div>

            {/* Confirm donation */}
            <Button
              type="button"
              data-ocid="donate.confirm_button"
              size="lg"
              disabled={createDonation.isPending || amountNum <= 0}
              onClick={handleConfirmDonation}
              className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
            >
              <Heart className="size-4" aria-hidden="true" />
              {createDonation.isPending
                ? t("दर्ज हो रहा है...", "Recording...")
                : t("मैंने दान कर दिया", "I have donated")}
            </Button>
          </CardContent>
        </Card>

        {/* Right: UPI payment panel */}
        <div className="flex flex-col gap-6">
          <Card
            data-ocid="donate.upi.card"
            className="border-border shadow-sacred"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl text-primary">
                <Smartphone className="size-5 text-accent" aria-hidden="true" />
                {t("UPI / GPay से भुगतान करें", "Pay via UPI / GPay")}
              </CardTitle>
              <CardDescription>
                {t(
                  "नीचे दिए गए बटन पर क्लिक करें या QR कोड स्कैन करें।",
                  "Tap the button below or scan the QR code.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* Pay button */}
              <Button
                type="button"
                data-ocid="donate.upi.pay_button"
                size="lg"
                onClick={openUpiDeepLink}
                disabled={amountNum <= 0}
                className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
              >
                <Smartphone className="size-4" aria-hidden="true" />
                {amountNum > 0
                  ? t(`₹${amountNum} भुगतान करें`, `Pay ₹${amountNum}`)
                  : t("राशि चुनें", "Select an amount")}
              </Button>

              {/* QR code */}
              <div
                data-ocid="donate.upi.qr"
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-5"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <QrCode className="size-4" aria-hidden="true" />
                  {t("QR कोड स्कैन करें", "Scan QR Code")}
                </span>
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={t("UPI भुगतान QR कोड", "UPI payment QR code")}
                    width={240}
                    height={240}
                    className="rounded-md border border-border bg-white"
                  />
                ) : (
                  <div className="flex h-[240px] w-[240px] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                    {t("QR लोड हो रहा है...", "Loading QR...")}
                  </div>
                )}
              </div>

              {/* Manual UPI details */}
              <Alert
                data-ocid="donate.upi.manual"
                className="border-accent/40 bg-accent/5"
              >
                <AlertTitle className="font-display text-lg text-primary">
                  {t("मैन्युअल UPI विवरण", "Manual UPI Details")}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <dl className="grid gap-2">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">
                        {t("UPI ID:", "UPI ID:")}
                      </dt>
                      <dd className="font-mono font-medium text-foreground">
                        {vpa}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">
                        {t("प्राप्तकर्ता:", "Payee:")}
                      </dt>
                      <dd className="font-medium text-foreground">
                        {payeeName}
                      </dd>
                    </div>
                    {amountNum > 0 && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">
                          {t("राशि:", "Amount:")}
                        </dt>
                        <dd className="font-medium text-foreground">
                          ₹{amountNum}
                        </dd>
                      </div>
                    )}
                  </dl>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/** Thank-you / confirmation view shown after a donation is recorded. */
function ThankYouView({
  t,
  donation,
  onNewDonation,
}: {
  t: (hi: string, en: string) => string;
  donation: SubmittedDonation;
  onNewDonation: () => void;
}) {
  const shareText = t(
    `जय श्री राम 🙏\nमैंने दान दिया: ₹${donation.amount}\nUPI रेफरेंस: ${donation.paymentReferenceId || "-"}\n${donation.donorMessage.hi}`,
    `Jai Shri Ram 🙏\nI donated: ₹${donation.amount}\nUPI reference: ${donation.paymentReferenceId || "-"}\n${donation.donorMessage.en}`,
  );
  const shareUrl = `https://wa.me/91${CONTACT_PHONE}?text=${encodeURIComponent(shareText)}`;

  return (
    <section
      data-ocid="donate.thank_you.page"
      className="container mx-auto px-4 py-16"
    >
      <div className="mx-auto max-w-2xl">
        <Card
          data-ocid="donate.thank_you.card"
          className="border-accent/40 shadow-sacred"
        >
          <CardHeader className="text-center">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-flame text-white shadow-sacred"
              aria-hidden="true"
            >
              <Check className="size-8" />
            </span>
            <CardTitle className="mt-4 font-display text-3xl text-primary">
              {t("दान स्वीकृत! 🙏", "Donation Received! 🙏")}
            </CardTitle>
            <CardDescription className="text-base">
              {t(
                "आपके योगदान के लिए ढेरों धन्यवाद। शीघ्र ही पुष्टि की जाएगी।",
                "Thank you so much for your contribution. It will be verified shortly.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Donation summary */}
            <div
              data-ocid="donate.thank_you.summary"
              className="rounded-lg border border-border bg-muted/40 p-4"
            >
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("आपका दान", "Your Donation")}
              </h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">
                    {t("राशि:", "Amount:")}
                  </dt>
                  <dd className="font-display text-lg font-semibold text-primary">
                    ₹{donation.amount.toString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t("स्थिति:", "Status:")}
                  </dt>
                  <dd className="font-medium text-warning">
                    {t("पुष्टि अपेक्षित", "Pending Verification")}
                  </dd>
                </div>
                {donation.donorName && (
                  <div>
                    <dt className="text-muted-foreground">
                      {t("नाम:", "Name:")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {donation.donorName}
                    </dd>
                  </div>
                )}
                {donation.paymentReferenceId && (
                  <div>
                    <dt className="text-muted-foreground">
                      {t("रेफरेंस:", "Reference:")}
                    </dt>
                    <dd className="font-mono font-medium text-foreground">
                      {donation.paymentReferenceId}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* WhatsApp share */}
            <Alert
              data-ocid="donate.thank_you.share"
              className="border-accent/40 bg-accent/5"
            >
              <AlertTitle className="font-display text-lg text-primary">
                {t("UPI रेफरेंस साझा करें", "Share UPI Reference")}
              </AlertTitle>
              <AlertDescription className="text-sm">
                <p className="leading-relaxed">
                  {t(
                    `अपने UPI भुगतान का संदर्भ व्हाट्सएप ${CONTACT_PHONE} पर साझा करें ताकि पंडित जी इसे शीघ्र पुष्टि कर सकें।`,
                    `Share your UPI payment reference on WhatsApp ${CONTACT_PHONE} so Pandit Ji can verify it quickly.`,
                  )}
                </p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="donate.thank_you.whatsapp"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-flame px-5 py-2.5 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
                >
                  {t("व्हाट्सएप पर साझा करें", "Share on WhatsApp")}
                </a>
              </AlertDescription>
            </Alert>

            <Button
              type="button"
              variant="outline"
              data-ocid="donate.thank_you.new_donation"
              onClick={onNewDonation}
              className="self-center"
            >
              {t("एक और दान करें", "Make Another Donation")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
