import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
import type { ExternalBlob } from "@caffeineai/object-storage";
export type { ExternalBlob } from "@caffeineai/object-storage";
export interface BlogPost {
    id: bigint;
    title: BilingualText;
    content: BilingualText;
    published: boolean;
    createdAt: Timestamp;
    slug: string;
    excerpt: BilingualText;
    image?: ExternalBlob;
}
export interface FAQ {
    id: bigint;
    question: BilingualText;
    displayOrder: bigint;
    answer: BilingualText;
    category: string;
}
export type Timestamp = bigint;
export interface ServiceArea {
    id: bigint;
    name: string;
}
export interface ContactSubmission {
    id: bigint;
    name: string;
    createdAt: Timestamp;
    message: string;
    phone: string;
}
export interface SiteConfig {
    sankalp: BilingualText;
    tagline: BilingualText;
    socialLinks: Array<SocialLink>;
    upiPayeeName?: string;
    upiNote?: string;
    upiVPA?: string;
    panditName: BilingualText;
    contactPhone: string;
}
export interface SocialLink {
    url: string;
    name: string;
}
export interface Service {
    id: bigint;
    displayOrder: bigint;
    name: BilingualText;
    description: BilingualText;
    category: ServiceCategory;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Package {
    id: bigint;
    priceMinRupees: bigint;
    displayOrder: bigint;
    name: BilingualText;
    includedItems: Array<BilingualText>;
    description: BilingualText;
    priceMaxRupees: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface BilingualText {
    en: string;
    hi: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface GalleryItem {
    id: bigint;
    title: BilingualText;
    createdAt: Timestamp;
    category: string;
    image: ExternalBlob;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface Booking {
    id: bigint;
    bookingCategory?: BookingCategory;
    languagePreference: LanguagePreference;
    paymentReferenceId?: string;
    serviceType: string;
    paymentStatus?: PaymentStatus;
    name: string;
    createdAt: Timestamp;
    email?: string;
    donorMessage?: BilingualText;
    upiVPA?: string;
    advanceAmount?: bigint;
    preferredDate: string;
    address: string;
    preferredTime: string;
    phone: string;
    specialNotes: string;
}
export interface Review {
    id: bigint;
    createdAt: Timestamp;
    reviewerName: string;
    rating: bigint;
    testimonial: BilingualText;
}
export enum BookingCategory {
    booking = "booking",
    donation = "donation"
}
export enum LanguagePreference {
    hindi = "hindi",
    bilingual = "bilingual",
    english = "english"
}
export enum PaymentStatus {
    pendingVerification = "pendingVerification",
    verified = "verified",
    notApplicable = "notApplicable",
    failed = "failed"
}
export enum ServiceCategory {
    grahaDoshShanti = "grahaDoshShanti",
    jeevanSamskar = "jeevanSamskar",
    jyotishServices = "jyotishServices",
    vedicPujaHavan = "vedicPujaHavan"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(name: string, phone: string, email: string | null, serviceType: string, preferredDate: string, preferredTime: string, address: string, languagePreference: LanguagePreference, specialNotes: string, upiVPA: string | null, advanceAmount: bigint | null, paymentStatus: PaymentStatus | null, paymentReferenceId: string | null, bookingCategory: BookingCategory | null, donorMessage: BilingualText | null): Promise<Booking>;
    createContactSubmission(name: string, phone: string, message: string): Promise<ContactSubmission>;
    createDonation(donorName: string, donorPhone: string, amount: bigint, donorMessage: BilingualText | null, paymentReferenceId: string | null): Promise<Booking>;
    createReview(reviewerName: string, rating: bigint, testimonial: BilingualText): Promise<Review>;
    execute(qJson: string): Promise<Result>;
    getBlogPost(slug: string): Promise<BlogPost | null>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getBookings(): Promise<Array<Booking>>;
    getBookingsByPhone(phone: string): Promise<Array<Booking>>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getFAQs(): Promise<Array<FAQ>>;
    getGallery(): Promise<Array<GalleryItem>>;
    getPackages(): Promise<Array<Package>>;
    getReviews(): Promise<Array<Review>>;
    getService(id: bigint): Promise<Service | null>;
    getServiceAreas(): Promise<Array<ServiceArea>>;
    getServices(): Promise<Array<Service>>;
    getServicesByCategory(category: ServiceCategory): Promise<Array<Service>>;
    getSiteConfig(): Promise<SiteConfig | null>;
    isCallerAdmin(): Promise<boolean>;
    schema(): Promise<string>;
    updateBookingPaymentStatus(bookingId: bigint, newStatus: PaymentStatus): Promise<Booking | null>;
    updateSiteConfig(upiVPA: string, upiPayeeName: string, upiNote: string): Promise<SiteConfig | null>;
}
