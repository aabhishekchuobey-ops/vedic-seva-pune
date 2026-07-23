import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview, useReviews } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import type { Review } from "@/utils/types";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_RATING = 5;
const SUMMARY_STAR_KEYS = ["sum-1", "sum-2", "sum-3", "sum-4", "sum-5"];
const CARD_STAR_KEYS = ["card-1", "card-2", "card-3", "card-4", "card-5"];
const REVIEW_SKELETON_KEYS = [
  "review-skel-1",
  "review-skel-2",
  "review-skel-3",
  "review-skel-4",
  "review-skel-5",
  "review-skel-6",
];

/**
 * Reviews page — displays devotee testimonials from the backend
 * (useReviews) and a form for visitors to submit their own review
 * (useCreateReview). All copy is bilingual via the language toggle.
 */
export function ReviewsPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);

  const { data, isLoading, isError } = useReviews();
  const _createReview = useCreateReview();

  const reviews = useMemo(() => (data ?? []) as Review[], [data]);

  // Average rating across all reviews.
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return sum / reviews.length;
  }, [reviews]);

  return (
    <section data-ocid="reviews.page" className="container mx-auto px-4 py-16">
      {/* Page header */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {t("भक्त अनुभव", "Devotee Experiences")}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("समीक्षाएँ", "Reviews")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t(
            "भक्तों के अनुभव एवं प्रशंसा पत्र",
            "Devotees' experiences and testimonials",
          )}
        </p>

        {reviews.length > 0 && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2 shadow-sm">
            <div className="flex" aria-hidden="true">
              {SUMMARY_STAR_KEYS.map((k, i) => (
                <Star
                  key={k}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(averageRating)
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted",
                  )}
                />
              ))}
            </div>
            <span className="font-display text-lg font-semibold text-primary">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              {t(`${reviews.length} समीक्षाएँ`, `${reviews.length} reviews`)}
            </span>
          </div>
        )}
      </div>

      {/* Decorative divider */}
      <div
        className="mx-auto mt-8 flex max-w-xs items-center gap-3"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <span className="font-display text-accent">ॐ</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      {/* Reviews list */}
      <div
        data-ocid="reviews.list.section"
        className="mt-12"
        aria-label={t("समीक्षा सूची", "Reviews list")}
      >
        <h2 className="mb-6 font-display text-2xl font-semibold text-primary">
          {t("भक्तों की समीक्षाएँ", "Devotee Reviews")}
        </h2>

        {isLoading ? (
          <ReviewsSkeleton />
        ) : isError ? (
          <ReviewsError t={t} />
        ) : reviews.length === 0 ? (
          <ReviewsEmpty t={t} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id.toString()}
                review={review}
                index={index}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submit review form */}
      <div
        data-ocid="reviews.form.section"
        className="mt-16"
        aria-label={t("अपनी समीक्षा सबमिट करें", "Submit your review")}
      >
        <h2 className="mb-6 font-display text-2xl font-semibold text-primary">
          {t("अपनी समीक्षा साझा करें", "Share Your Experience")}
        </h2>
        <ReviewForm t={t} />
      </div>
    </section>
  );
}

/** A single review testimonial card. */
function ReviewCard({
  review,
  index,
  t,
}: {
  review: Review;
  index: number;
  t: (hi: string, en: string) => string;
}) {
  const rating = Number(review.rating);
  return (
    <article
      data-ocid={`reviews.item.${index}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-smooth hover:shadow-sacred"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-flame font-display text-base font-semibold text-white"
            aria-hidden="true"
          >
            {review.reviewerName.charAt(0).toUpperCase()}
          </span>
          <span className="font-display text-base font-semibold text-foreground">
            {review.reviewerName}
          </span>
        </div>
        <div
          className="flex"
          aria-label={t(`${rating} में से 5 तारा`, `${rating} out of 5 stars`)}
        >
          {CARD_STAR_KEYS.map((k, i) => (
            <Star
              key={k}
              className={cn(
                "h-4 w-4",
                i < rating
                  ? "fill-accent text-accent"
                  : "fill-muted text-muted",
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t(review.testimonial.hi, review.testimonial.en)}
      </p>
    </article>
  );
}

/** Form for visitors to submit a new review. */
function ReviewForm({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  const createReview = useCreateReview();

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [testimonialHi, setTestimonialHi] = useState("");
  const [testimonialEn, setTestimonialEn] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPending = createReview.isPending;

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (reviewerName.trim().length < 2) {
      next.reviewerName = t("कृपया अपना नाम दर्ज करें", "Please enter your name");
    }
    if (rating < 1 || rating > MAX_RATING) {
      next.rating = t("कृपया 1 से 5 तारा चुनें", "Please select 1 to 5 stars");
    }
    if (testimonialHi.trim().length < 5 && testimonialEn.trim().length < 5) {
      next.testimonial = t(
        "कृपया कम से कम एक भाषा में अपना अनुभव लिखें",
        "Please write your experience in at least one language",
      );
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReview.mutateAsync({
        reviewerName: reviewerName.trim(),
        rating: BigInt(rating),
        testimonial: {
          hi: testimonialHi.trim() || testimonialEn.trim(),
          en: testimonialEn.trim() || testimonialHi.trim(),
        },
      });
      toast.success(
        t("आपकी समीक्षा के लिए धन्यवाद! 🙏", "Thank you for your review! 🙏"),
      );
      setReviewerName("");
      setRating(0);
      setHoverRating(0);
      setTestimonialHi("");
      setTestimonialEn("");
      setErrors({});
    } catch (_err) {
      toast.error(
        t(
          "समीक्षा सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।",
          "Error submitting review. Please try again.",
        ),
      );
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <form
      data-ocid="reviews.form"
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6">
        {/* Reviewer name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reviewer-name" data-ocid="reviews.form.name.label">
            {t("आपका नाम", "Your Name")}
          </Label>
          <Input
            id="reviewer-name"
            data-ocid="reviews.form.name.input"
            type="text"
            value={reviewerName}
            maxLength={60}
            placeholder={t("उदा. राहुल शर्मा", "e.g. Rahul Sharma")}
            aria-invalid={!!errors.reviewerName}
            aria-describedby={
              errors.reviewerName ? "reviewer-name-error" : undefined
            }
            onChange={(e) => setReviewerName(e.target.value)}
          />
          {errors.reviewerName && (
            <p
              id="reviewer-name-error"
              data-ocid="reviews.form.name.error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.reviewerName}
            </p>
          )}
        </div>

        {/* Rating star selector */}
        <div className="flex flex-col gap-2">
          <Label data-ocid="reviews.form.rating.label">
            {t("रेटिंग", "Rating")}
          </Label>
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label={t("तारा रेटिंग चुनें", "Select star rating")}
          >
            {Array.from({ length: MAX_RATING }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  data-ocid={`reviews.form.rating.star.${value}`}
                  // biome-ignore lint/a11y/useSemanticElements: custom star rating widget needs button semantics.
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={t(
                    `${value} तारा`,
                    `${value} star${value > 1 ? "s" : ""}`,
                  )}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(value)}
                  onBlur={() => setHoverRating(0)}
                  className="rounded-md p-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      value <= displayRating
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted",
                    )}
                  />
                </button>
              );
            })}
          </div>
          {errors.rating && (
            <p
              data-ocid="reviews.form.rating.error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.rating}
            </p>
          )}
        </div>

        {/* Testimonial — Hindi */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="testimonial-hi"
            data-ocid="reviews.form.testimonial_hi.label"
          >
            {t("अनुभव (हिंदी)", "Testimonial (Hindi)")}
          </Label>
          <Textarea
            id="testimonial-hi"
            data-ocid="reviews.form.testimonial_hi.input"
            value={testimonialHi}
            maxLength={500}
            placeholder={t("अपना अनुभव यहाँ लिखें…", "Write your experience here…")}
            aria-invalid={!!errors.testimonial}
            aria-describedby={
              errors.testimonial ? "testimonial-error" : undefined
            }
            onChange={(e) => setTestimonialHi(e.target.value)}
          />
        </div>

        {/* Testimonial — English */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="testimonial-en"
            data-ocid="reviews.form.testimonial_en.label"
          >
            {t("अनुभव (अंग्रेज़ी)", "Testimonial (English)")}
          </Label>
          <Textarea
            id="testimonial-en"
            data-ocid="reviews.form.testimonial_en.input"
            value={testimonialEn}
            maxLength={500}
            placeholder="Write your experience here…"
            aria-invalid={!!errors.testimonial}
            aria-describedby={
              errors.testimonial ? "testimonial-error" : undefined
            }
            onChange={(e) => setTestimonialEn(e.target.value)}
          />
          {errors.testimonial && (
            <p
              id="testimonial-error"
              data-ocid="reviews.form.testimonial.error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.testimonial}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t(
              "कम से कम एक भाषा में अनुभव आवश्यक है।",
              "At least one language testimonial is required.",
            )}
          </p>
          <Button
            type="submit"
            data-ocid="reviews.form.submit_button"
            disabled={isPending}
            className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
          >
            {isPending
              ? t("सबमिट हो रहा है…", "Submitting…")
              : t("समीक्षा सबमिट करें", "Submit Review")}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Loading skeleton for the reviews grid. */
function ReviewsSkeleton() {
  return (
    <div
      data-ocid="reviews.loading_state"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {REVIEW_SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

/** Empty state — no reviews yet. */
function ReviewsEmpty({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="reviews.empty_state"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center"
    >
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        ॐ
      </span>
      <p className="font-display text-lg font-semibold text-primary">
        {t("अभी कोई समीक्षा नहीं है", "No reviews yet")}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t(
          "पहली समीक्षा साझा करने वाले भक्त बनें — नीचे दिए गए फ़ॉर्म का उपयोग करें।",
          "Be the first devotee to share a review — use the form below.",
        )}
      </p>
    </div>
  );
}

/** Error state for the reviews list. */
function ReviewsError({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="reviews.error_state"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center"
    >
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        ॐ
      </span>
      <p className="text-muted-foreground">
        {t(
          "समीक्षाएँ लोड करने में असमर्थ। कृपया पुनः प्रयास करें।",
          "Unable to load reviews. Please try again.",
        )}
      </p>
    </div>
  );
}
