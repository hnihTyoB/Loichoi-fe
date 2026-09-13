"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Heart, LockKeyhole, MonitorSmartphone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KeyboardCardData, KeyboardPlatform } from "@/types/keyboard.types";

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function platformLabel(platform: KeyboardPlatform) {
  if (platform === "IOS") return "iOS";
  if (platform === "ANDROID") return "Android";
  return "iOS + Android";
}

export interface KeyboardCardProps {
  keyboard: KeyboardCardData;
  priority?: boolean;
  className?: string;
  locale?: "vi" | "en";
}

export function KeyboardCard({ keyboard, priority, className, locale = "vi" }: KeyboardCardProps) {
  const protectedTheme = keyboard.accessLevel && keyboard.accessLevel !== "FREE";

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.25rem] border-2 border-kawaii-sky/60 bg-card shadow-cloud transition-all duration-300 hover:-translate-y-1 hover:border-kawaii-babyblue hover:shadow-cloud-hover sm:rounded-[2rem]",
        className,
      )}
    >
      <Link href={`/keyboards/${keyboard.slug}`} className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden bg-kawaii-cloud">
          <Image
            src={keyboard.coverUrl}
            alt={keyboard.name}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-2 sm:gap-2 sm:p-3">
            <Badge className="px-1.5 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs border-white/70 bg-white/90 text-kawaii-mocha backdrop-blur-sm dark:border-kawaii-sky/40 dark:bg-kawaii-cloud/90">
              <MonitorSmartphone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {platformLabel(keyboard.platform)}
            </Badge>
            {protectedTheme ? (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs bg-kawaii-blush/95 backdrop-blur-sm">
                <LockKeyhole className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {keyboard.accessLevel === "PREMIUM" ? "Member" : "Discord"}
              </Badge>
            ) : keyboard.isFeatured ? (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs bg-kawaii-blush/95 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Featured
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <div className="flex min-h-5 flex-wrap items-center gap-1 sm:min-h-6 sm:gap-1.5">
            {keyboard.colors.slice(0, 3).map((color) => (
              <span
                key={color.id}
                title={color.name}
                aria-label={color.name}
                className="h-3.5 w-3.5 rounded-full border-2 border-card shadow-[0_0_0_1px_rgba(111,78,55,0.16)] sm:h-5 sm:w-5"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {keyboard.styles.slice(0, 1).map((style) => (
              <span key={style.id} className="rounded-full bg-kawaii-blush/45 px-1.5 py-0.5 text-[9px] font-bold text-kawaii-mocha sm:px-2.5 sm:py-1 sm:text-[11px]">
                {style.name}
              </span>
            ))}
            {keyboard.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-kawaii-sky/35 px-1.5 py-0.5 text-[9px] font-bold text-kawaii-mocha sm:px-2.5 sm:py-1 sm:text-[11px]"
              >
                {category.name}
              </span>
            ))}
          </div>
          <h3 className="mt-2 line-clamp-2 text-xs font-extrabold leading-tight text-kawaii-mocha transition-colors group-hover:text-kawaii-warmbrown sm:mt-3 sm:text-lg sm:leading-snug">
            {keyboard.name}
          </h3>
          <div className="mt-2.5 flex items-center justify-between border-t border-kawaii-sky/40 pt-2 text-[10px] font-bold text-kawaii-mocha/65 sm:mt-4 sm:pt-3 sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1">
                <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {formatCount(keyboard.downloadCount, locale === "vi" ? "vi-VN" : "en-US")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3 text-kawaii-pink sm:h-3.5 sm:w-3.5" />
                {formatCount(keyboard.likeCount ?? 0, locale === "vi" ? "vi-VN" : "en-US")}
              </span>
            </div>
            {keyboard.author ? (
              <span className="max-w-[50%] truncate sm:max-w-[55%]">
                {keyboard.author.fullName || keyboard.author.username || "Loichoi Creator"}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
