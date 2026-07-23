import type { ExternalBlob } from "@/backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import type { BlogPost } from "@/utils/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useMemo } from "react";

/**
 * Blog listing page — article cards (title, excerpt, image) linking to
 * full blog post pages at /blog/$slug. All bilingual via the language toggle.
 */
export function BlogPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <section data-ocid="blog.page" className="container mx-auto px-4 py-16">
      {/* Page header */}
      <header className="mx-auto max-w-3xl text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
          {t("वैदिक ज्ञान", "Vedic Knowledge")}
        </div>
        <h1 className="font-display text-4xl font-semibold text-gradient-flame md:text-5xl">
          {t("ब्लॉग", "Blog")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t(
            "वैदिक ज्ञान, पूजा विधि एवं आध्यात्मिक लेखों का संग्रह",
            "A collection of Vedic knowledge, puja rituals, and spiritual articles",
          )}
        </p>
      </header>

      {/* Decorative divider */}
      <div
        className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <span className="font-display text-lg text-accent">ॐ</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      {/* Content */}
      <div className="mt-12">
        {isLoading ? (
          <BlogGridSkeleton />
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard
                key={post.slug}
                post={post}
                language={language}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState t={t} />
        )}
      </div>
    </section>
  );
}

interface BlogCardProps {
  post: BlogPost;
  language: "hi" | "en";
  index: number;
}

function BlogCard({ post, language, index }: BlogCardProps) {
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const imageUrl = useExternalBlobUrl(post.image);
  const formattedDate = useMemo(() => {
    try {
      return new Date(Number(post.createdAt)).toLocaleDateString(
        language === "hi" ? "hi-IN" : "en-IN",
        { year: "numeric", month: "long", day: "numeric" },
      );
    } catch {
      return "";
    }
  }, [post.createdAt, language]);

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      data-ocid={`blog.card.${index + 1}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full overflow-hidden py-0 transition-smooth hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={t(post.title.hi, post.title.en)}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-subtle">
              <span
                className="font-display text-4xl text-accent/40"
                aria-hidden="true"
              >
                ॐ
              </span>
            </div>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-6">
          {formattedDate && (
            <time className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {formattedDate}
            </time>
          )}
          <CardTitle className="font-display text-xl font-semibold leading-snug text-primary transition-smooth group-hover:text-accent">
            {t(post.title.hi, post.title.en)}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {t(post.excerpt.hi, post.excerpt.en)}
          </CardDescription>
          <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {t("पूरा लेख पढ़ें", "Read full article")}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}

function BlogGridSkeleton() {
  return (
    <div
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      data-ocid="blog.loading_state"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list, never reordered.
        <Card key={`blog-skeleton-${i}`} className="overflow-hidden py-0">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ t }: { t: (hi: string, en: string) => string }) {
  return (
    <div
      data-ocid="blog.empty_state"
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center"
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl"
        aria-hidden="true"
      >
        📜
      </span>
      <h2 className="font-display text-xl font-semibold text-primary">
        {t("लेख शीघ्र ही आ रहे हैं", "Articles coming soon")}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t(
          "वैदिक ज्ञान एवं पूजा विधि पर लेख शीघ्र ही प्रकाशित होंगे। कृपया पुनः देखें।",
          "Articles on Vedic knowledge and puja rituals will be published soon. Please check back.",
        )}
      </p>
      <Link
        to="/contact"
        data-ocid="blog.empty_state.contact_link"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-flame px-5 py-2.5 text-sm font-semibold text-white shadow-sacred transition-smooth hover:opacity-90"
      >
        {t("पंडित जी से संपर्क करें", "Contact Pandit Ji")}
      </Link>
    </div>
  );
}

/**
 * Resolves the direct URL for an optional ExternalBlob image.
 * Returns null when no image is present.
 */
function useExternalBlobUrl(blob: ExternalBlob | undefined): string | null {
  return useMemo(() => {
    if (!blob) {
      return null;
    }
    try {
      return blob.getDirectURL();
    } catch {
      return null;
    }
  }, [blob]);
}

/** Loading indicator used by parent — re-exported for clarity. */
export function BlogLoadingIndicator() {
  return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
}
