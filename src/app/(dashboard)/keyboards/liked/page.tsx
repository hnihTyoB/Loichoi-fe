"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyboardCard } from "@/components/public/keyboard-card";
import { PermissionGate } from "@/components/shared/permission-gate";
import { PaginationNav } from "@/components/shared/admin-ui";
import { useLikedKeyboards } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";

export default function LikedKeyboardsPage() {
  const [page, setPage] = useState(1);
  const { t, language, isMounted } = useTranslation();

  const { data, isLoading, isError, refetch } = useLikedKeyboards({
    page,
    limit: 12,
  });

  const keyboards = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <PermissionGate
      permission={PERMISSIONS.KEYBOARD_LIKE_READ}
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-kawaii-sky/50 bg-card/80 p-8 text-center shadow-cloud">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-inner">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-kawaii-mocha">
            {isMounted ? t.common.errorOccurred : "Không có quyền truy cập"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-kawaii-mocha/70">
            {isMounted
              ? t.common.errorDescription
              : "Bạn không có quyền xem danh sách bàn phím yêu thích."}
          </p>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2.5rem] border-2 border-kawaii-sky/80 bg-gradient-to-r from-kawaii-cloud via-card to-kawaii-blush/30 p-6 shadow-cloud sm:flex-row sm:items-center md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-kawaii-blush/40 text-kawaii-pink shadow-inner transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16">
              <Heart className="h-7 w-7 fill-kawaii-pink/30 text-kawaii-pink sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-kawaii-sky/50 bg-card/90 px-3 py-0.5 text-xs font-bold text-kawaii-mocha shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-kawaii-warmbrown" />
                <span>
                  {isMounted
                    ? t.likedKeyboards?.pageTitle || "Theme Đã Thích"
                    : "Theme Đã Thích"}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-kawaii-mocha sm:text-3xl md:text-4xl">
                {isMounted
                  ? t.likedKeyboards?.title || "Theme Đã Yêu Thích"
                  : "Theme Đã Yêu Thích"}
              </h1>
              <p className="text-xs font-medium text-kawaii-mocha/75 sm:text-sm">
                {isMounted
                  ? t.likedKeyboards?.subtitle ||
                    "Bộ sưu tập các giao diện bàn phím bạn đã thả tim trong thế giới Loichoi"
                  : "Bộ sưu tập các giao diện bàn phím bạn đã thả tim trong thế giới Loichoi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <Badge
              variant="secondary"
              className="rounded-full border border-kawaii-blush/60 bg-kawaii-blush/30 px-3.5 py-1.5 text-xs font-bold text-kawaii-mocha"
            >
              <Heart className="mr-1.5 h-3.5 w-3.5 fill-kawaii-pink/40 text-kawaii-pink" />
              <span>
                {total}{" "}
                {isMounted
                  ? t.likedKeyboards?.totalLiked || "theme đã lưu"
                  : "theme đã lưu"}
              </span>
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[2rem] border-2 border-kawaii-sky/40 bg-card p-4 shadow-cloud"
              >
                <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-kawaii-sky/20" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-kawaii-sky/20" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-kawaii-sky/15" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card/90 p-8 text-center shadow-cloud">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-destructive/15 text-destructive shadow-inner">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-black text-kawaii-mocha">
              {isMounted ? t.common.errorOccurred : "Không thể tải dữ liệu"}
            </h3>
            <p className="mt-1 text-xs text-kawaii-mocha/70">
              {isMounted
                ? t.common.errorDescription
                : "Đã xảy ra sự cố khi tải danh sách bàn phím yêu thích."}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mt-4 rounded-full border-kawaii-sky/60 font-bold text-kawaii-mocha bouncy-hover"
            >
              {isMounted ? t.common.retry : "Thử lại"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && keyboards.length === 0 && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-kawaii-sky/80 bg-gradient-to-b from-kawaii-cloud/50 to-card p-8 text-center shadow-cloud sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-kawaii-blush/30 text-kawaii-pink shadow-inner transition-transform duration-300 hover:scale-110">
              <Heart className="h-8 w-8 text-kawaii-pink" />
            </div>
            <h3 className="mt-5 text-xl font-black text-kawaii-mocha">
              {isMounted
                ? t.likedKeyboards?.emptyTitle || "Chưa có theme nào được yêu thích"
                : "Chưa có theme nào được yêu thích"}
            </h3>
            <p className="mt-2 max-w-md text-xs font-medium text-kawaii-mocha/75 sm:text-sm">
              {isMounted
                ? t.likedKeyboards?.emptyDesc ||
                  "Bạn chưa thả tim theme nào cả. Hãy dạo quanh kho giao diện và chọn những thiết kế ưng ý nhất nhé!"
                : "Bạn chưa thả tim theme nào cả. Hãy dạo quanh kho giao diện và chọn những thiết kế ưng ý nhất nhé!"}
            </p>
            <Button
              asChild
              className="mt-6 rounded-full font-bold shadow-cloud bouncy-hover"
            >
              <Link href="/keyboards">
                <Compass className="mr-2 h-4 w-4" />
                <span>
                  {isMounted
                    ? t.likedKeyboards?.exploreCta || "Khám phá Theme ngay"
                    : "Khám phá Theme ngay"}
                </span>
              </Link>
            </Button>
          </div>
        )}

        {/* Keyboards Grid */}
        {!isLoading && !isError && keyboards.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {keyboards.map((keyboard) => (
                <KeyboardCard
                  key={keyboard.id}
                  keyboard={keyboard}
                  locale={language}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && (
              <div className="pt-4 border-t-2 border-kawaii-sky/30">
                <PaginationNav
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={12}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PermissionGate>
  );
}
