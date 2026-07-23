import type { LanguageCode, ServiceCategoryValue } from "./types";

/** Pandit name (bilingual). */
export const PANDIT_NAME = {
  hi: "पंडित अभिषेक शास्त्री जी",
  en: "Pandit Abhishek Shastri Ji",
};

/** Tagline shown in the header (bilingual). */
export const TAGLINE = {
  hi: "वैदिक पूजा · हवन · ज्योतिष सेवाएँ · पुणे",
  en: "Vedic Puja · Havan · Jyotish Services · Pune",
};

/** Sankalp statement shown in the footer (bilingual). */
export const SANKALP = {
  hi: "शास्त्रोक्त विधि से, शुद्ध भाव के साथ — हर पूजा एक संकल्प की ओर।",
  en: "Through scriptural rites, with pure devotion — every puja is a step toward a sacred resolve.",
};

/** Primary contact number for calls and WhatsApp. */
export const CONTACT_PHONE = "9026828075";

/** Prefilled devotional greeting for WhatsApp. */
const WHATSAPP_GREETING =
  "जय श्री राम 🙏\n" +
  "पंडित अभिषेक शास्त्री जी की पूजा/हवन सेवा के लिए बुकिंग या जानकारी चाहिए।\n\n" +
  "Jai Shri Ram 🙏\n" +
  "I would like to book or learn about Pandit Abhishek Shastri Ji's puja/havan services.";

/** WhatsApp deep link with prefilled greeting. */
export const WHATSAPP_URL = `https://wa.me/91${CONTACT_PHONE}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;

/** Direct telephone link. */
export const CALL_URL = `tel:${CONTACT_PHONE}`;

/** UPI Virtual Payment Address linked to 9026828075 (GPay/PhonePe/Paytm). */
export const UPI_VPA = "9026828075@okbiz";

/** Display name of the UPI payee. */
export const UPI_PAYEE_NAME = "Pandit Abhishek Shastri";

/** Default note attached to UPI payment requests. */
export const UPI_NOTE = "Daan / Seva / Puja booking";

/** Suggested donation amounts in rupees. */
export const DONATION_SUGGESTED_AMOUNTS = [51, 101, 251, 501, 1001];

/**
 * Build a UPI deep link for a payment.
 * @param vpa - UPI Virtual Payment Address (pa)
 * @param payeeName - Payee display name (pn)
 * @param amount - Amount in rupees (am); omit for open amounts
 * @param note - Transaction note (tn)
 * @returns A `upi://pay?...` URL with URL-encoded values.
 */
export function buildUpiDeepLink(
  vpa: string,
  payeeName: string,
  amount?: number | bigint,
  note?: string,
): string {
  const params = new URLSearchParams();
  params.set("pa", vpa);
  params.set("pn", payeeName);
  if (amount !== undefined && amount !== null) {
    params.set("am", String(amount));
    params.set("cu", "INR");
  }
  if (note) {
    params.set("tn", note);
  }
  return `upi://pay?${params.toString()}`;
}

/** Pune service areas covered by the pandit. */
export const SERVICE_AREAS = [
  "Kharadi",
  "Wagholi",
  "Hadapsar",
  "Magarpatta",
  "Hinjewadi",
  "Baner",
  "Aundh",
  "Pimpri",
  "Chinchwad",
  "Viman Nagar",
  "Kalyani Nagar",
  "Lohegaon",
  "All Pune",
];

/** Social media links. */
export const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://facebook.com/" },
  { name: "Instagram", url: "https://instagram.com/" },
  { name: "YouTube", url: "https://youtube.com/" },
];

/** Primary navigation items (bilingual labels). */
export interface NavItem {
  to: string;
  label: { hi: string; en: string };
  /** When true, the link is only shown to authenticated admins. */
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: { hi: "मुख्य पृष्ठ", en: "Home" } },
  { to: "/about", label: { hi: "परिचय", en: "About" } },
  { to: "/services", label: { hi: "सेवाएँ", en: "Services" } },
  { to: "/booking", label: { hi: "बुकिंग", en: "Booking" } },
  { to: "/donate", label: { hi: "दान", en: "Donate" } },
  { to: "/my-bookings", label: { hi: "मेरी बुकिंग", en: "My Bookings" } },
  { to: "/gallery", label: { hi: "गैलरी", en: "Gallery" } },
  { to: "/reviews", label: { hi: "समीक्षाएँ", en: "Reviews" } },
  { to: "/blog", label: { hi: "ब्लॉग", en: "Blog" } },
  { to: "/faqs", label: { hi: "प्रश्न", en: "FAQs" } },
  { to: "/contact", label: { hi: "संपर्क", en: "Contact" } },
  {
    to: "/admin/bookings",
    label: { hi: "व्यवस्थापक बुकिंग", en: "Admin Bookings" },
    adminOnly: true,
  },
];

/** Service category labels (bilingual). */
export const SERVICE_CATEGORY_LABELS: Record<
  ServiceCategoryValue,
  { hi: string; en: string }
> = {
  vedicPujaHavan: { hi: "वैदिक पूजा एवं हवन", en: "Vedic Puja & Havan" },
  grahaDoshShanti: { hi: "ग्रह दोष शांति", en: "Graha Dosh Shanti" },
  jeevanSamskar: { hi: "जीवन संस्कार", en: "Jeevan Samskar" },
  jyotishServices: { hi: "ज्योतिष सेवाएँ", en: "Jyotish Services" },
};

/** localStorage key for the language preference. */
export const LANGUAGE_STORAGE_KEY = "priest-site-language";

/** localStorage key for the booking draft. */
export const BOOKING_DRAFT_STORAGE_KEY = "priest-site-booking-draft";

/** Default UI language — Hindi. */
export const DEFAULT_LANGUAGE: LanguageCode = "hi";
