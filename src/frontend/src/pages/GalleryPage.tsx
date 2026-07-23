import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGallery } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import type { GalleryItem } from "@/utils/types";
import { PlayCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const GALLERY_SKELETON_KEYS = [
  "gallery-skel-1",
  "gallery-skel-2",
  "gallery-skel-3",
  "gallery-skel-4",
  "gallery-skel-5",
  "gallery-skel-6",
  "gallery-skel-7",
  "gallery-skel-8",
];

/**
 * Local devotional imagery used as a curated fallback when the backend
 * gallery is empty. Each entry maps to a generated 4K image in
 * /assets/generated/. Bilingual titles follow the site convention.
 */
interface FallbackImage {
  src: string;
  title: { hi: string; en: string };
  category: { hi: string; en: string };
}

const FALLBACK_IMAGES: FallbackImage[] = [
  {
    src: "/assets/generated/rudrabhishek.dim_1280x1280.jpg",
    title: { hi: "रुद्राभिषेक", en: "Rudrabhishek" },
    category: { hi: "वैदिक पूजा", en: "Vedic Puja" },
  },
  {
    src: "/assets/generated/mahaganapati-hom.dim_1280x1280.jpg",
    title: { hi: "महागणपति होम", en: "Mahaganapati Hom" },
    category: { hi: "हवन", en: "Havan" },
  },
  {
    src: "/assets/generated/satyanarayan-mahapooja.dim_1280x1280.jpg",
    title: { hi: "सत्यनारायण महापूजा", en: "Satyanarayan Mahapooja" },
    category: { hi: "महापूजा", en: "Mahapooja" },
  },
  {
    src: "/assets/generated/griha-pravesh.dim_1280x1280.jpg",
    title: { hi: "गृह प्रवेश", en: "Griha Pravesh" },
    category: { hi: "जीवन संस्कार", en: "Jeevan Samskar" },
  },
];

/** A unified gallery card shape used for both backend and fallback items. */
interface GalleryCard {
  id: string;
  src: string;
  title: { hi: string; en: string };
  category: { hi: string; en: string };
}

/** Ritual video placeholder entries for the video gallery section. */
const VIDEO_PLACEHOLDERS: {
  title: { hi: string; en: string };
  duration: string;
}[] = [
  {
    title: { hi: "रुद्राभिषेक अनुष्ठान", en: "Rudrabhishek Anushthan" },
    duration: "12:30",
  },
  {
    title: { hi: "गणेश आरती", en: "Ganesh Aarti" },
    duration: "06:15",
  },
  {
    title: { hi: "सत्यनारायण कथा", en: "Satyanarayan Katha" },
    duration: "24:48",
  },
];

export function GalleryPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const { data, isLoading, isError } = useGallery();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Build the unified card list. Backend items take priority; when the
  // backend returns an empty list (no uploaded images yet), the curated
  // generated devotional imagery is shown so the gallery is never empty.
  const cards: GalleryCard[] = useMemo(() => {
    const backendItems = (data ?? []) as GalleryItem[];
    if (backendItems.length > 0) {
      return backendItems.map((item) => ({
        id: `backend-${item.id.toString()}`,
        src: item.image.getDirectURL(),
        title: item.title,
        category: {
          hi: item.category,
          en: item.category,
        },
      }));
    }
    return FALLBACK_IMAGES.map((img, i) => ({
      id: `fallback-${i}`,
      src: img.src,
      title: img.title,
      category: img.category,
    }));
  }, [data]);

  const activeCard =
    openIndex !== null && openIndex >= 0 && openIndex < cards.length
      ? cards[openIndex]
      : null;

  // Reset the lightbox if the underlying list changes (e.g. refetch).
  useEffect(() => {
    if (openIndex !== null && openIndex >= cards.length) {
      setOpenIndex(null);
    }
  }, [cards.length, openIndex]);

  return (
    <section data-ocid="gallery.page" className="container mx-auto px-4 py-16">
      {/* Page header */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {t("दर्शन", "Darshan")}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("गैलरी", "Gallery")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t(
            "पूजा, हवन एवं वैदिक अनुष्ठानों के पवित्र दृश्य",
            "Sacred moments from pujas, havans and Vedic ceremonies",
          )}
        </p>
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

      {/* Photo gallery grid */}
      <div
        data-ocid="gallery.photo.section"
        className="mt-12"
        aria-label={t("चित्र गैलरी", "Photo Gallery")}
      >
        <h2 className="mb-6 font-display text-2xl font-semibold text-primary">
          {t("चित्र गैलरी", "Photo Gallery")}
        </h2>

        {isLoading ? (
          <GallerySkeleton />
        ) : isError ? (
          <GalleryError t={t} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                data-ocid={`gallery.photo.item.${index}`}
                aria-label={t(
                  `${card.title.hi} — बड़े आकार में देखें`,
                  `${card.title.en} — view enlarged`,
                )}
                onClick={() => setOpenIndex(index)}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-smooth",
                  "hover:-translate-y-1 hover:shadow-sacred focus-visible:-translate-y-1 focus-visible:shadow-sacred",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={card.src}
                    alt={t(card.title.hi, card.title.en)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {t(card.category.hi, card.category.en)}
                  </span>
                  <span className="font-display text-base font-semibold text-foreground">
                    {t(card.title.hi, card.title.en)}
                  </span>
                </div>
                {/* Hover overlay hint */}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-smooth group-hover:bg-primary/10 group-hover:opacity-100">
                  <span className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                    {t("बड़ा करें", "Enlarge")}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video gallery section */}
      <div
        data-ocid="gallery.video.section"
        className="mt-16"
        aria-label={t("वीडियो गैलरी", "Video Gallery")}
      >
        <h2 className="mb-6 font-display text-2xl font-semibold text-primary">
          {t("वीडियो गैलरी", "Video Gallery")}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_PLACEHOLDERS.map((video, index) => (
            <div
              key={video.title.en}
              data-ocid={`gallery.video.item.${index}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-smooth hover:shadow-sacred"
            >
              <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-flame">
                <PlayCircle
                  className="h-14 w-14 text-white/90 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <span className="font-display text-base font-semibold text-foreground">
                  {t(video.title.hi, video.title.en)}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("वीडियो शीघ्र ही उपलब्ध होगा", "Video coming soon")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox dialog */}
      <Dialog
        open={activeCard !== null}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
      >
        <DialogContent
          data-ocid="gallery.lightbox.modal"
          className="max-w-3xl bg-background p-0 sm:max-w-3xl"
          showCloseButton
        >
          {activeCard && (
            <>
              <DialogTitle className="sr-only">
                {t(activeCard.title.hi, activeCard.title.en)}
              </DialogTitle>
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={activeCard.src}
                  alt={t(activeCard.title.hi, activeCard.title.en)}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {t(activeCard.category.hi, activeCard.category.en)}
                </span>
                <span className="font-display text-xl font-semibold text-primary">
                  {t(activeCard.title.hi, activeCard.title.en)}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** Loading skeleton matching the photo grid layout. */
function GallerySkeleton() {
  return (
    <div
      data-ocid="gallery.loading_state"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {GALLERY_SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="aspect-square w-full animate-pulse bg-muted" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Error state with a recovery hint. */
function GalleryError({
  t,
}: {
  t: (hi: string, en: string) => string;
}) {
  return (
    <div
      data-ocid="gallery.error_state"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center"
    >
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        ॐ
      </span>
      <p className="text-muted-foreground">
        {t(
          "गैलरी लोड करने में असमर्थ। कृपया पुनः प्रयास करें।",
          "Unable to load the gallery. Please try again.",
        )}
      </p>
    </div>
  );
}
