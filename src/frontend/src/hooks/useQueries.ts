import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  BilingualText,
  BlogPost,
  Booking,
  BookingCategoryValue,
  BookingDraft,
  ContactSubmission,
  DonationDraft,
  FAQ,
  GalleryItem,
  LanguagePreferenceValue,
  Package,
  PaymentStatusValue,
  Review,
  Service,
  ServiceArea,
  ServiceCategoryValue,
  SiteConfig,
} from "../utils/types";

/** All services offered by the pandit. */
export function useServices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getServices()) as Service[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Services filtered by category. */
export function useServicesByCategory(category: ServiceCategoryValue | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["services", category],
    queryFn: async () => {
      if (!actor || category === null) return [];
      return (await actor.getServicesByCategory(
        category as never,
      )) as Service[];
    },
    enabled: !!actor && !isFetching && category !== null,
  });
}

/** A single service by id. */
export function useService(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["service", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return (await actor.getService(id)) as Service | null;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

/** All puja packages. */
export function usePackages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getPackages()) as Package[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** All bookings (admin view). */
export function useBookings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getBookings()) as Booking[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Create a new booking request. */
export function useCreateBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: BookingDraft) => {
      if (!actor) throw new Error("Actor not ready");
      const email = draft.email.trim() === "" ? null : draft.email.trim();
      return (await actor.createBooking(
        draft.name,
        draft.phone,
        email,
        draft.serviceType,
        draft.preferredDate,
        draft.preferredTime,
        draft.address,
        draft.languagePreference as never,
        draft.specialNotes,
        draft.upiVPA ?? null,
        draft.advanceAmount ?? null,
        (draft.paymentStatus as never) ?? null,
        draft.paymentReferenceId ?? null,
        (draft.bookingCategory as never) ?? null,
        draft.donorMessage ?? null,
      )) as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsByPhone"] });
    },
  });
}

/** Create a new donation record. */
export function useCreateDonation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: DonationDraft) => {
      if (!actor) throw new Error("Actor not ready");
      return (await actor.createDonation(
        draft.donorName,
        draft.donorPhone,
        draft.amount,
        draft.donorMessage ?? null,
        draft.paymentReferenceId ?? null,
      )) as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsByPhone"] });
    },
  });
}

/** Bookings matching a given phone number (devotee self-service lookup). */
export function useBookingsByPhone(phone: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookingsByPhone", phone],
    queryFn: async () => {
      if (!actor || phone.trim() === "") return [];
      return (await actor.getBookingsByPhone(phone)) as Booking[];
    },
    enabled: !!actor && !isFetching && phone.trim().length > 0,
  });
}

/** Admin-only: update a booking's payment verification status. */
export function useUpdateBookingPaymentStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      newStatus,
    }: {
      bookingId: bigint;
      newStatus: PaymentStatusValue;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return (await actor.updateBookingPaymentStatus(
        bookingId,
        newStatus as never,
      )) as Booking | null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsByPhone"] });
    },
  });
}

/** Admin-only: update the site-wide UPI configuration. */
export function useUpdateSiteConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      upiVPA,
      upiPayeeName,
      upiNote,
    }: {
      upiVPA: string;
      upiPayeeName: string;
      upiNote: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return (await actor.updateSiteConfig(
        upiVPA,
        upiPayeeName,
        upiNote,
      )) as SiteConfig | null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteConfig"] });
    },
  });
}

/** Whether the current caller is an authenticated admin. */
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (await actor.isCallerAdmin()) as boolean;
    },
    enabled: !!actor && !isFetching,
  });
}

/** Gallery images. */
export function useGallery() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getGallery()) as GalleryItem[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Devotee reviews. */
export function useReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getReviews()) as Review[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submit a new review. */
export function useCreateReview() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewerName,
      rating,
      testimonial,
    }: {
      reviewerName: string;
      rating: bigint;
      testimonial: BilingualText;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return (await actor.createReview(
        reviewerName,
        rating,
        testimonial,
      )) as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

/** All published blog posts. */
export function useBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getBlogPosts()) as BlogPost[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** A single blog post by slug. */
export function useBlogPost(slug: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      if (!actor) return null;
      return (await actor.getBlogPost(slug)) as BlogPost | null;
    },
    enabled: !!actor && !isFetching && slug.length > 0,
  });
}

/** FAQs. */
export function useFAQs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getFAQs()) as FAQ[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Contact form submissions (admin view). */
export function useContactSubmissions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getContactSubmissions()) as ContactSubmission[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submit a contact form. */
export function useCreateContactSubmission() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      message,
    }: {
      name: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return (await actor.createContactSubmission(
        name,
        phone,
        message,
      )) as ContactSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSubmissions"] });
    },
  });
}

/** Pune service areas. */
export function useServiceAreas() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["serviceAreas"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getServiceAreas()) as ServiceArea[];
    },
    enabled: !!actor && !isFetching,
  });
}

/** Site-wide configuration. */
export function useSiteConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["siteConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return (await actor.getSiteConfig()) as SiteConfig | null;
    },
    enabled: !!actor && !isFetching,
  });
}

/** Re-export for convenience. */
export type {
  BookingCategoryValue,
  LanguagePreferenceValue,
  PaymentStatusValue,
};
