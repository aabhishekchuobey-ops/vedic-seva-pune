import type { ExternalBlob } from "../backend";

/** Bilingual text — Hindi (Devanagari) + English. */
export interface BilingualText {
  hi: string;
  en: string;
}

/** Payment verification state for a booking or donation. */
export const PaymentStatus = {
  pendingVerification: "pendingVerification",
  verified: "verified",
  failed: "failed",
  notApplicable: "notApplicable",
} as const;

export type PaymentStatusValue =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Whether a record is a service booking or a donation. */
export const BookingCategory = {
  booking: "booking",
  donation: "donation",
} as const;

export type BookingCategoryValue =
  (typeof BookingCategory)[keyof typeof BookingCategory];

/** Service categories offered by the pandit. */
export const ServiceCategory = {
  VedicPujaHavan: "vedicPujaHavan",
  GrahaDoshShanti: "grahaDoshShanti",
  JeevanSamskar: "jeevanSamskar",
  JyotishServices: "jyotishServices",
} as const;

export type ServiceCategoryValue =
  (typeof ServiceCategory)[keyof typeof ServiceCategory];

/** Language preference for a booking. */
export const LanguagePreference = {
  Hindi: "hindi",
  English: "english",
  Bilingual: "bilingual",
} as const;

export type LanguagePreferenceValue =
  (typeof LanguagePreference)[keyof typeof LanguagePreference];

/** UI language for the site toggle (defaults to Hindi). */
export type LanguageCode = "hi" | "en";

/** A devotional service offered by the pandit. */
export interface Service {
  id: bigint;
  category: ServiceCategoryValue;
  name: BilingualText;
  description: BilingualText;
  displayOrder: bigint;
}

/** A bundled puja package with a price range. */
export interface Package {
  id: bigint;
  name: BilingualText;
  priceMinRupees: bigint;
  priceMaxRupees: bigint;
  includedItems: BilingualText[];
  description: BilingualText;
  displayOrder: bigint;
}

/** A booking request submitted by a devotee. */
export interface Booking {
  id: bigint;
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  languagePreference: LanguagePreferenceValue;
  specialNotes: string;
  createdAt: bigint;
  /** UPI VPA used for the advance payment, if any. */
  upiVPA?: string;
  /** Advance amount in rupees, if any. */
  advanceAmount?: bigint;
  /** Payment verification state. */
  paymentStatus?: PaymentStatusValue;
  /** UPI transaction reference id, if any. */
  paymentReferenceId?: string;
  /** Whether this record is a booking or a donation. */
  bookingCategory?: BookingCategoryValue;
  /** Optional message from a donor. */
  donorMessage?: BilingualText;
}

/** A gallery image showcasing past ceremonies. */
export interface GalleryItem {
  id: bigint;
  image: ExternalBlob;
  title: BilingualText;
  category: string;
  createdAt: bigint;
}

/** A devotee review/testimonial. */
export interface Review {
  id: bigint;
  reviewerName: string;
  rating: bigint;
  testimonial: BilingualText;
  createdAt: bigint;
}

/** A published blog post on Vedic topics. */
export interface BlogPost {
  id: bigint;
  title: BilingualText;
  excerpt: BilingualText;
  content: BilingualText;
  image?: ExternalBlob;
  slug: string;
  published: boolean;
  createdAt: bigint;
}

/** A frequently asked question. */
export interface FAQ {
  id: bigint;
  question: BilingualText;
  answer: BilingualText;
  category: string;
  displayOrder: bigint;
}

/** A contact form submission. */
export interface ContactSubmission {
  id: bigint;
  name: string;
  phone: string;
  message: string;
  createdAt: bigint;
}

/** A Pune service area covered by the pandit. */
export interface ServiceArea {
  id: bigint;
  name: string;
}

/** A social media link. */
export interface SocialLink {
  name: string;
  url: string;
}

/** Site-wide configuration. */
export interface SiteConfig {
  panditName: BilingualText;
  tagline: BilingualText;
  contactPhone: string;
  socialLinks: SocialLink[];
  sankalp: BilingualText;
  /** UPI Virtual Payment Address for advance payments and donations. */
  upiVPA?: string;
  /** Display name of the UPI payee. */
  upiPayeeName?: string;
  /** Default note attached to UPI payment requests. */
  upiNote?: string;
}

/** Draft state for the booking form, persisted locally between pages. */
export interface BookingDraft {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  languagePreference: LanguagePreferenceValue;
  specialNotes: string;
  /** UPI VPA used for the advance payment, if any. */
  upiVPA?: string;
  /** Advance amount in rupees, if any. */
  advanceAmount?: bigint;
  /** Payment verification state. */
  paymentStatus?: PaymentStatusValue;
  /** UPI transaction reference id, if any. */
  paymentReferenceId?: string;
  /** Whether this record is a booking or a donation. */
  bookingCategory?: BookingCategoryValue;
  /** Optional message from a donor. */
  donorMessage?: BilingualText;
}

export const EMPTY_BOOKING_DRAFT: BookingDraft = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  preferredDate: "",
  preferredTime: "",
  address: "",
  languagePreference: LanguagePreference.Hindi,
  specialNotes: "",
};

/** Draft state for the donation form. */
export interface DonationDraft {
  donorName: string;
  donorPhone: string;
  amount: bigint;
  donorMessage?: BilingualText;
  paymentReferenceId?: string;
}

export const EMPTY_DONATION_DRAFT: DonationDraft = {
  donorName: "",
  donorPhone: "",
  amount: 0n,
};
