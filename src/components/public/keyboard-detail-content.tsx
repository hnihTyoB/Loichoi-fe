"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Download, Heart, Images, MonitorSmartphone, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { DownloadButton, type DownloadState } from "@/components/public/download-button";
import { KeyboardGrid, KeyboardGridSkeleton } from "@/components/public/keyboard-grid";
import { RichTextContent } from "@/components/public/rich-text-content";
import { StatePanel } from "@/components/public/state-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useKeyboard, useKeyboards, useToggleKeyboardLike } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/errors";
import { getPublicCopy } from "@/lib/public-copy";
import type { KeyboardDetail } from "@/types/keyboard.types";

function platformLabel(platform: KeyboardDetail["platform"]) {
  if (platform === "IOS") return "iOS";
  if (platform === "ANDROID") return "Android";
  return "iOS + Android";
}

function accessLabel(access: KeyboardDetail["accessLevel"]) {
  if (access === "FREE") return "Free";
  if (access === "PREMIUM") return "Member";
  if (access === "DISCORD_ROLE") return "Discord Role";
  return "Discord Member";
}

function KeyboardGallery({ keyboard, previewLabel, previewDescription, imageUnit }: {
  keyboard: KeyboardDetail;
  previewLabel: string;
  previewDescription: string;
  imageUnit: string;
}) {
  const images = [
    { id: "cover", url: keyboard.coverUrl, altText: keyboard.name, position: -1 },
    ...keyboard.previewImages,
  ].filter((image, index, all) => Boolean(image.url) && all.findIndex((candidate) => candidate.url === image.url) === index);
  const [selectedId, setSelectedId] = useState(images[0]?.id ?? "cover");
  const selected = images.find((image) => image.id === selectedId) || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.75rem] border-2 border-kawaii-sky/65 bg-gradient-to-br from-kawaii-cloud to-kawaii-blush/30 shadow-cloud">
        {selected?.url ? (
          <Image
            src={selected.url}
            alt={selected.altText || keyboard.name}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-contain p-2 md:p-4"
          />
        ) : null}
        <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-extrabold text-kawaii-mocha shadow-sm backdrop-blur dark:border-kawaii-sky/40 dark:bg-kawaii-cloud/90">
          <Images className="h-3.5 w-3.5" />
          {images.findIndex((image) => image.id === selected?.id) + 1} / {images.length}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-kawaii-mocha">{previewLabel}</h2>
          <p className="mt-1 text-xs font-medium text-kawaii-mocha/60">{previewDescription}</p>
        </div>
        <span className="shrink-0 rounded-full bg-kawaii-cloud px-3 py-1 text-xs font-bold text-kawaii-mocha/65">{images.length} {imageUnit}</span>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2" aria-label={previewLabel}>
        {images.map((image) => {
          const selectedImage = image.id === selected?.id;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedId(image.id)}
              aria-pressed={selectedImage}
              className={selectedImage
                ? "relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-kawaii-warmbrown bg-kawaii-cloud shadow-cloud"
                : "relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-kawaii-sky/50 bg-kawaii-cloud opacity-75 transition hover:opacity-100"}
            >
              <Image src={image.url} alt={image.altText || keyboard.name} fill unoptimized sizes="112px" className="object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function KeyboardDetailContent({ slug, initialData, downloadState }: { slug: string; initialData?: KeyboardDetail; downloadState?: DownloadState }) {
  const router = useRouter();
  const { language } = useTranslation();
  const auth = useAuth();
  const text = getPublicCopy(language);
  const keyboard = useKeyboard(slug, initialData);
  const toggleLike = useToggleKeyboardLike(slug);
  const categorySlug = keyboard.data?.categories[0]?.slug;
  const related = useKeyboards({ category: categorySlug, limit: 5, sort: "popular" });

  if (keyboard.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-56 rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Skeleton className="aspect-[4/3] rounded-[2.5rem]" />
          <div className="space-y-5"><Skeleton className="h-12 w-full rounded-full" /><Skeleton className="h-24 w-full rounded-3xl" /><Skeleton className="h-12 w-56 rounded-full" /></div>
        </div>
      </div>
    );
  }

  if (keyboard.isError || !keyboard.data) {
    return (
      <StatePanel
        icon={AlertTriangle}
        title={text.explore.errorTitle}
        description={text.explore.errorDesc}
        actionLabel={text.common.retry}
        onAction={() => keyboard.refetch()}
      />
    );
  }

  const item = keyboard.data;
  const relatedItems = related.data?.data.filter((candidate) => candidate.id !== item.id).slice(0, 4) ?? [];

  const handleToggleLike = () => {
    if (auth.isLoading || toggleLike.isPending) return;
    if (!auth.isAuthenticated) {
      toast.error(text.detail.likeLogin);
      router.push(`/login?next=${encodeURIComponent(`/keyboards/${item.slug}`)}`);
      return;
    }
    toggleLike.mutate(undefined, {
      onSuccess: (result) => toast.success(result.liked ? text.detail.likedSuccess : text.detail.unlikedSuccess),
      onError: (error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          toast.error(text.detail.likeLogin);
          router.push(`/login?next=${encodeURIComponent(`/keyboards/${item.slug}`)}`);
          return;
        }
        toast.error(getErrorMessage(error, text.detail.likeError));
      },
    });
  };

  return (
    <article className="space-y-14">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/keyboards"><ArrowLeft />{text.detail.back}</Link>
      </Button>

      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <KeyboardGallery key={item.id} keyboard={item} previewLabel={text.detail.preview} previewDescription={text.detail.previewDescription} imageUnit={text.detail.imageUnit} />

        <div className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud md:p-8">
          <div className="flex flex-wrap gap-2">
            {item.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
            {item.categories.map((category) => (
              <Link key={category.id} href={`/keyboards?category=${encodeURIComponent(category.slug)}`}>
                <Badge>{category.name}</Badge>
              </Link>
            ))}
            {item.colors.map((color) => (
              <Link key={color.id} href={`/keyboards?colors=${encodeURIComponent(color.slug)}`}>
                <Badge variant="outline" className="bg-card">
                  <span className="h-3.5 w-3.5 rounded-full border border-kawaii-mocha/20 shadow-inner" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </Badge>
              </Link>
            ))}
            {item.styles.map((style) => (
              <Link key={style.id} href={`/keyboards?styles=${encodeURIComponent(style.slug)}`}>
                <Badge variant="secondary" className="bg-kawaii-blush/55">{style.name}</Badge>
              </Link>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-kawaii-mocha md:text-5xl">{item.name}</h1>
          {item.author ? (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-kawaii-mocha/60">
              <UserRound className="h-4 w-4" />
              {item.author.fullName || item.author.username || "Loichoi Creator"}
            </p>
          ) : null}

          <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl bg-kawaii-cloud/65 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><MonitorSmartphone className="h-4 w-4" />{text.detail.platform}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{platformLabel(item.platform)}</dd>
            </div>
            <div className="rounded-2xl bg-kawaii-blush/35 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><ShieldCheck className="h-4 w-4" />{text.detail.access}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{accessLabel(item.accessLevel)}</dd>
            </div>
            <div className="rounded-2xl bg-kawaii-cloud/65 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><Download className="h-4 w-4" />{text.common.downloads}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(item.downloadCount)}</dd>
            </div>
            <div className={item.isLiked ? "group relative rounded-2xl bg-kawaii-blush/55 p-4 ring-2 ring-kawaii-pink/45 transition hover:-translate-y-0.5" : "group relative rounded-2xl bg-kawaii-blush/35 p-4 transition hover:-translate-y-0.5 hover:bg-kawaii-blush/50"}>
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55">
                <Heart className={item.isLiked ? "h-4 w-4 fill-current text-kawaii-pink" : "h-4 w-4 transition group-hover:text-kawaii-pink"} />
                {item.isLiked ? text.detail.liked : text.detail.likes}
              </dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(item.likeCount ?? 0)}</dd>
              <button
                type="button"
                className="absolute inset-0 cursor-pointer rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-kawaii-pink/45 disabled:cursor-wait"
                aria-label={item.isLiked ? text.detail.unlikeAction : text.detail.likeAction}
                aria-pressed={Boolean(item.isLiked)}
                disabled={auth.isLoading || toggleLike.isPending}
                onClick={handleToggleLike}
              >
                <span className="sr-only">{item.isLiked ? text.detail.unlikeAction : text.detail.likeAction}</span>
              </button>
            </div>
          </dl>

          <div className="mt-7">
            <p className="text-center text-sm font-medium leading-relaxed text-kawaii-mocha/70">{text.detail.packageDescription}</p>
            <div className="mt-5">
              <DownloadButton slug={item.slug} errorState={downloadState} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border-2 border-kawaii-sky/45 bg-kawaii-cloud/30 p-6 md:p-9">
        <h2 className="text-2xl font-black text-kawaii-mocha">{text.detail.about}</h2>
        <div className="mt-4">
          <RichTextContent content={item.description} fallback={text.detail.noDescription} />
        </div>
      </section>

      <section>
        <div className="mb-7">
          <h2 className="text-2xl font-black text-kawaii-mocha md:text-3xl">{text.detail.related}</h2>
          <p className="mt-2 text-sm font-medium text-kawaii-mocha/65">{text.detail.relatedDesc}</p>
        </div>
        {related.isLoading ? <KeyboardGridSkeleton count={4} /> : null}
        {relatedItems.length > 0 ? <KeyboardGrid keyboards={relatedItems} locale={language} /> : null}
      </section>
    </article>
  );
}
