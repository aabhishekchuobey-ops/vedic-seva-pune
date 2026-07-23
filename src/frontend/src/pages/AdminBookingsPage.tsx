import { Badge } from "@/components/ui/badge";
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
import {
  useBookings,
  useIsCallerAdmin,
  useSiteConfig,
  useUpdateBookingPaymentStatus,
  useUpdateSiteConfig,
} from "@/hooks/useQueries";
import type {
  BilingualText,
  Booking,
  BookingCategoryValue,
  PaymentStatusValue,
} from "@/utils/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  IndianRupee,
  Lock,
  Settings,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const t = (hi: string, en: string) => `${hi} / ${en}`;

const PAYMENT_STATUS_FILTERS: {
  value: PaymentStatusValue | "all";
  label: string;
}[] = [
  { value: "all", label: t("सभी", "All") },
  { value: "pendingVerification", label: t("लंबित", "Pending") },
  { value: "verified", label: t("सत्यापित", "Verified") },
  { value: "failed", label: t("अस्वीकृत", "Failed") },
  { value: "notApplicable", label: t("लागू नहीं", "N/A") },
];

const CATEGORY_FILTERS: {
  value: BookingCategoryValue | "all";
  label: string;
}[] = [
  { value: "all", label: t("सभी", "All") },
  { value: "booking", label: t("बुकिंग", "Booking") },
  { value: "donation", label: t("दान", "Donation") },
];

function PaymentStatusBadge({ status }: { status?: PaymentStatusValue }) {
  if (!status) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        {t("लागू नहीं", "N/A")}
      </Badge>
    );
  }
  switch (status) {
    case "pendingVerification":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">
          <Clock className="w-3 h-3 mr-1" />
          {t("लंबित सत्यापन", "Pending Verification")}
        </Badge>
      );
    case "verified":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("सत्यापित", "Verified")}
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          {t("अस्वीकृत", "Failed")}
        </Badge>
      );
    case "notApplicable":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {t("लागू नहीं", "N/A")}
        </Badge>
      );
    default:
      return <Badge variant="outline">{String(status)}</Badge>;
  }
}

function CategoryBadge({ category }: { category?: BookingCategoryValue }) {
  if (category === "donation") {
    return (
      <Badge className="bg-accent/15 text-accent border-accent/30 hover:bg-accent/15">
        <IndianRupee className="w-3 h-3 mr-1" />
        {t("दान", "Donation")}
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100">
      <Users className="w-3 h-3 mr-1" />
      {t("बुकिंग", "Booking")}
    </Badge>
  );
}

function formatDate(ts: bigint | number | Date | undefined): string {
  if (ts === undefined || ts === null) return "—";
  try {
    const ms =
      typeof ts === "bigint"
        ? Number(ts) / 1_000_000
        : typeof ts === "number"
          ? ts > 1e12
            ? ts
            : ts * 1000
          : ts.getTime();
    return new Date(ms).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

function formatAmount(amount?: bigint | number): string {
  if (amount === undefined || amount === null) return "—";
  const n = typeof amount === "bigint" ? Number(amount) : amount;
  return `₹${n.toLocaleString("en-IN")}`;
}

function renderBilingual(text?: BilingualText): string {
  if (!text) return "—";
  return `${text.hi} / ${text.en}`;
}

export function AdminBookingsPage() {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const isAdminQuery = useIsCallerAdmin();
  const isAdmin = isAdminQuery.data === true;

  const bookingsQuery = useBookings();
  const siteConfigQuery = useSiteConfig();

  const updatePayment = useUpdateBookingPaymentStatus();
  const updateSiteConfig = useUpdateSiteConfig();

  const [statusFilter, setStatusFilter] = useState<PaymentStatusValue | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<
    BookingCategoryValue | "all"
  >("all");

  const [upiVPA, setUpiVPA] = useState("");
  const [upiPayeeName, setUpiPayeeName] = useState("");
  const [upiNote, setUpiNote] = useState("");
  const [configLoaded, setConfigLoaded] = useState(false);

  // Pre-fill site config once available
  const siteConfig = siteConfigQuery.data;
  if (siteConfig && !configLoaded) {
    setUpiVPA(siteConfig.upiVPA ?? "");
    setUpiPayeeName(siteConfig.upiPayeeName ?? "");
    setUpiNote(siteConfig.upiNote ?? "");
    setConfigLoaded(true);
  }

  const bookings: Booking[] = bookingsQuery.data ?? [];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.paymentStatus !== statusFilter) {
        return false;
      }
      if (categoryFilter !== "all" && b.bookingCategory !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [bookings, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(
      (b) => b.paymentStatus === "pendingVerification",
    ).length;
    const verified = bookings.filter(
      (b) => b.paymentStatus === "verified",
    ).length;
    const donations = bookings.filter((b) => b.bookingCategory === "donation");
    const totalDonations = donations.reduce(
      (sum, b) => sum + Number(b.advanceAmount ?? 0n),
      0,
    );
    return { total, pending, verified, totalDonations };
  }, [bookings]);

  // --- Admin gate ---
  if (isInitializing || isAdminQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <span className="text-5xl text-accent">ॐ</span>
          <p className="text-muted-foreground">
            {t("लोड हो रहा है...", "Loading...")}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-accent/30 shadow-subtle">
          <CardHeader className="text-center space-y-3">
            <span className="text-5xl text-accent">ॐ</span>
            <CardTitle className="text-2xl text-primary">
              {t("साइन इन आवश्यक", "Sign-in Required")}
            </CardTitle>
            <CardDescription>
              {t(
                "बुकिंग प्रबंधन देखने के लिए कृपया Internet Identity से लॉगिन करें।",
                "Please sign in with Internet Identity to access booking management.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => login()}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Lock className="w-4 h-4 mr-2" />
              {t(
                "Internet Identity से लॉगिन करें",
                "Sign in with Internet Identity",
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-red-200 shadow-subtle">
          <CardHeader className="text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <CardTitle className="text-2xl text-red-700">
              {t("पहुँच अस्वीकृत", "Access Denied")}
            </CardTitle>
            <CardDescription>
              {t(
                "आप व्यवस्थापक नहीं हैं। इस पृष्ठ तक पहुँच केवल व्यवस्थापकों के लिए सीमित है।",
                "You are not an admin. Access to this page is restricted to administrators only.",
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // --- Handlers ---
  const handleVerify = async (bookingId: bigint) => {
    try {
      await updatePayment.mutateAsync({ bookingId, newStatus: "verified" });
      toast.success(t("भुगतान सत्यापित हो गया", "Payment verified successfully"));
    } catch {
      toast.error(t("सत्यापन विफल", "Verification failed"));
    }
  };

  const handleDecline = async (bookingId: bigint) => {
    try {
      await updatePayment.mutateAsync({ bookingId, newStatus: "failed" });
      toast.success(t("भुगतान अस्वीकृत किया गया", "Payment declined"));
    } catch {
      toast.error(t("अस्वीकरण विफल", "Decline failed"));
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateSiteConfig.mutateAsync({
        upiVPA,
        upiPayeeName,
        upiNote,
      });
      toast.success(t("सेटिंग्स सहेजी गईं", "Settings saved"));
    } catch {
      toast.error(t("सेटिंग्स सहेजना विफल", "Failed to save settings"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Devotional Header */}
      <header className="bg-gradient-flame border-b border-accent/30 shadow-subtle">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl text-primary">ॐ</span>
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">
            {t("बुकिंग प्रबंधन", "Booking Management")}
          </h1>
          <p className="text-accent-foreground mt-1">
            {t(
              "भुगतान सत्यापित करें, बुकिंग देखें और साइट सेटिंग्स प्रबंधित करें",
              "Verify payments, view bookings and manage site settings",
            )}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Statistics Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-accent/30 shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("कुल बुकिंग", "Total Bookings")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("लंबित भुगतान", "Pending Payments")}
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("सत्यापित भुगतान", "Verified Payments")}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {stats.verified}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/30 shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("कुल दान", "Total Donations")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatAmount(stats.totalDonations)}
                  </p>
                </div>
                <IndianRupee className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Filter Bar */}
        <section>
          <Card className="border-accent/30 shadow-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Filter className="w-5 h-5" />
                {t("फ़िल्टर", "Filters")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-accent">
                  {t("भुगतान स्थिति", "Payment Status")}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_STATUS_FILTERS.map((f) => (
                    <Button
                      key={f.value}
                      size="sm"
                      variant={statusFilter === f.value ? "default" : "outline"}
                      onClick={() => setStatusFilter(f.value)}
                      className={
                        statusFilter === f.value
                          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                          : "border-accent/40 text-accent"
                      }
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-accent">
                  {t("बुकिंग श्रेणी", "Booking Category")}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_FILTERS.map((f) => (
                    <Button
                      key={f.value}
                      size="sm"
                      variant={
                        categoryFilter === f.value ? "default" : "outline"
                      }
                      onClick={() => setCategoryFilter(f.value)}
                      className={
                        categoryFilter === f.value
                          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                          : "border-accent/40 text-accent"
                      }
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bookings List */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("बुकिंग सूची", "Bookings List")} ({filteredBookings.length})
          </h2>

          {bookingsQuery.isLoading ? (
            <Card className="border-accent/30 shadow-subtle">
              <CardContent className="py-12 text-center">
                <span className="text-4xl text-accent inline-block animate-pulse">
                  ॐ
                </span>
                <p className="text-muted-foreground mt-3">
                  {t("बुकिंग लोड हो रही हैं...", "Loading bookings...")}
                </p>
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card className="border-accent/30 shadow-subtle">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {t("कोई बुकिंग नहीं मिली।", "No bookings found.")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((b) => (
                <Card
                  key={Number(b.id)}
                  className="border-accent/30 shadow-subtle"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            #{Number(b.id)}
                          </span>
                          <CategoryBadge category={b.bookingCategory} />
                          <PaymentStatusBadge status={b.paymentStatus} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              {t("नाम", "Name")}:{" "}
                            </span>
                            <span className="font-medium">{b.name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("फ़ोन", "Phone")}:{" "}
                            </span>
                            <span className="font-medium">{b.phone}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("सेवा", "Service")}:{" "}
                            </span>
                            <span className="font-medium">{b.serviceType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("तिथि", "Date")}:{" "}
                            </span>
                            <span className="font-medium">
                              {b.preferredDate ?? "—"}
                            </span>
                          </div>
                          {b.preferredTime && (
                            <div>
                              <span className="text-muted-foreground">
                                {t("समय", "Time")}:{" "}
                              </span>
                              <span className="font-medium">
                                {b.preferredTime}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">
                              {t("अग्रिम राशि", "Advance Amount")}:{" "}
                            </span>
                            <span className="font-medium">
                              {formatAmount(b.advanceAmount)}
                            </span>
                          </div>
                          {b.paymentReferenceId && (
                            <div>
                              <span className="text-muted-foreground">
                                {t("UPI संदर्भ", "UPI Reference")}:{" "}
                              </span>
                              <span className="font-mono text-xs">
                                {b.paymentReferenceId}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">
                              {t("बनाई गई", "Created")}:{" "}
                            </span>
                            <span className="font-medium">
                              {formatDate(b.createdAt)}
                            </span>
                          </div>
                        </div>
                        {b.donorMessage && (
                          <div className="text-sm bg-accent/10 border border-accent/20 rounded p-2">
                            <span className="text-muted-foreground">
                              {t("दाता संदेश", "Donor Message")}:{" "}
                            </span>
                            <span>{renderBilingual(b.donorMessage)}</span>
                          </div>
                        )}
                        {b.specialNotes && (
                          <div className="text-sm text-muted-foreground">
                            <span>{t("विशेष नोट", "Notes")}: </span>
                            {b.specialNotes}
                          </div>
                        )}
                      </div>

                      {b.paymentStatus === "pendingVerification" && (
                        <div className="flex flex-col gap-2 md:w-44">
                          <Button
                            size="sm"
                            onClick={() => handleVerify(b.id)}
                            disabled={updatePayment.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t("सत्यापित करें", "Verify")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(b.id)}
                            disabled={updatePayment.isPending}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t("अस्वीकार करें", "Decline")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* SiteConfig Editor */}
        <section>
          <Card className="border-accent/30 shadow-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Settings className="w-5 h-5" />
                {t("साइट सेटिंग्स", "Site Settings")}
              </CardTitle>
              <CardDescription>
                {t(
                  "UPI भुगतान विवरण कॉन्फ़िगर करें",
                  "Configure UPI payment details",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteConfigQuery.isLoading ? (
                <p className="text-muted-foreground text-center py-4">
                  {t("सेटिंग्स लोड हो रही हैं...", "Loading settings...")}
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="upi-vpa" className="text-accent">
                      {t("UPI VPA", "UPI VPA")}
                    </Label>
                    <Input
                      id="upi-vpa"
                      value={upiVPA}
                      onChange={(e) => setUpiVPA(e.target.value)}
                      placeholder="9026828075@okbiz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi-payee" className="text-accent">
                      {t("प्राप्तकर्ता नाम", "Payee Name")}
                    </Label>
                    <Input
                      id="upi-payee"
                      value={upiPayeeName}
                      onChange={(e) => setUpiPayeeName(e.target.value)}
                      placeholder={t("पंडित जी", "Pandit Ji")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi-note" className="text-accent">
                      {t("भुगतान नोट", "Payment Note")}
                    </Label>
                    <Textarea
                      id="upi-note"
                      value={upiNote}
                      onChange={(e) => setUpiNote(e.target.value)}
                      placeholder={t("सेवा अर्पण", "Seva Arpan")}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={updateSiteConfig.isPending}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {updateSiteConfig.isPending
                      ? t("सहेज रहे हैं...", "Saving...")
                      : t("सेटिंग्स सहेजें", "Save Settings")}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
