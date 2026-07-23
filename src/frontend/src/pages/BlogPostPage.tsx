import type { ExternalBlob } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/hooks/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import { CALL_URL, CONTACT_PHONE, WHATSAPP_URL } from "@/utils/constants";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";
import { useMemo } from "react";

/**
 * Blog post detail page (route /blog/$slug) — displays formatted rich-text
 * content from the blog post. Fetches via useBlogPost hook using the slug
 * param. All bilingual via the language toggle.
 */
export function BlogPostPage() {
  const language = useAppStore((s) => s.language);
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post, isLoading, isError } = useBlogPost(slug);

  if (isLoading) {
    return <BlogPostSkeleton t={t} />;
  }

  if (isError || !post) {
    return <NotFoundState t={t} />;
  }

  return <BlogPostContent post={post} language={language} />;
}

interface BlogPostContentProps {
  post: NonNullable<ReturnType<typeof useBlogPost>["data"]>;
  language: "hi" | "en";
}

function BlogPostContent({ post, language }: BlogPostContentProps) {
  const t = (hi: string, en: string) => (language === "hi" ? hi : en);
  const imageUrl = useExternalBlobUrl(post.image);
  const content = language === "hi" ? post.content.hi : post.content.en;

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
    <article
      data-ocid="blog_post.page"
      className="container mx-auto px-4 py-16"
    >
      {/* Back link */}
      <Link
        to="/blog"
        data-ocid="blog_post.back_link"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("सभी लेख", "All articles")}
      </Link>

      {/* Header */}
      <header className="mx-auto mt-6 max-w-3xl text-center">
        <h1 className="font-display text-3xl font-semibold leading-tight text-gradient-flame md:text-4xl lg:text-5xl">
          {t(post.title.hi, post.title.en)}
        </h1>
        {formattedDate && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
            <time>{formattedDate}</time>
          </div>
        )}
      </header>

      {/* Cover image */}
      {imageUrl && (
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl shadow-lg">
          <img
            src={imageUrl}
            alt={t(post.title.hi, post.title.en)}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      {/* Excerpt lead */}
      <p className="mx-auto mt-10 max-w-3xl text-lg font-medium leading-relaxed text-foreground/90">
        {t(post.excerpt.hi, post.excerpt.en)}
      </p>

      {/* Rich-text content */}
      <div
        className="prose prose-lg mx-auto mt-8 max-w-3xl prose-headings:font-display prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground prose-img:rounded-xl prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-muted-foreground dark:prose-invert"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: blog content is authored rich-text HTML stored in the backend.
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Footer CTA */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-gradient-subtle p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-primary">
          {t("पूजा बुक करना चाहते हैं?", "Want to book a puja?")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t(
            "पंडित अभिषेक शास्त्री जी से सीधे संपर्क करें — कॉल या WhatsApp।",
            "Reach out to Pandit Abhishek Shastri Ji directly — call or WhatsApp.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
          >
            <a href={CALL_URL} data-ocid="blog_post.call_button">
              📞 {CONTACT_PHONE}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="blog_post.whatsapp_button"
            >
              {t("WhatsApp पर चैट", "Chat on WhatsApp")}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function BlogPostSkeleton({ t }: { t: (hi: string, en: string) => string }) {
  return (
    <section
      data-ocid="blog_post.loading_state"
      className="container mx-auto px-4 py-16"
    >
      <Skeleton className="h-4 w-32" />
      <div className="mx-auto mt-6 max-w-3xl text-center">
        <Skeleton className="mx-auto h-12 w-full" />
        <Skeleton className="mx-auto mt-4 h-4 w-40" />
      </div>
      <Skeleton className="mx-auto mt-10 aspect-[16/9] max-w-4xl rounded-2xl" />
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="sr-only">{t("लोड हो रहा है", "Loading")}</div>
    </section>
  );
}

function NotFoundState({ t }: { t: (hi: string, en: string) => string }) {
  return (
    <section
      data-ocid="blog_post.error_state"
      className="container mx-auto px-4 py-24"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span
          className="font-display text-6xl text-accent/50"
          aria-hidden="true"
        >
          ॐ
        </span>
        <h1 className="font-display text-3xl font-semibold text-primary">
          {t("लेख नहीं मिला", "Article not found")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(
            "यह लेख उपलब्ध नहीं है या हटा दिया गया है।",
            "This article is unavailable or has been removed.",
          )}
        </p>
        <Button
          asChild
          className="bg-gradient-flame text-white shadow-sacred hover:opacity-90"
        >
          <Link to="/blog" data-ocid="blog_post.error_state.back">
            {t("ब्लॉग पर वापस", "Back to blog")}
          </Link>
        </Button>
      </div>
    </section>
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

/** Loading indicator re-exported for parent clarity. */
export function BlogPostLoadingIndicator() {
  return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
}
