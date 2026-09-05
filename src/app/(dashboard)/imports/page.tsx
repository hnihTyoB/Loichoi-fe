"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  RefreshCw,
  Search,
  ChevronRight,
  AlertTriangle,
  Copy,
  Zap,
  CloudUpload,
  SlidersHorizontal,
  ArrowRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  useImportJobs,
  useBulkApproveImports,
  useResetImports,
} from "@/hooks/use-imports";
import { useTranslation } from "@/hooks/use-translation";
import { PermissionGate } from "@/components/shared/permission-gate";
import { PageHeader, PaginationNav } from "@/components/shared/admin-ui";
import { PERMISSIONS } from "@/lib/constants";
import type { ImportJobDto, ImportJobStatus, ImportJobFilter } from "@/types/import.types";
import { isBulkApproveCandidate, getMinConfidence } from "@/types/import.types";

// ──────────────────────────────────────────────
// Status badge helpers
// ──────────────────────────────────────────────

function StatusBadge({ status }: { status: ImportJobStatus }) {
  const { t, isMounted } = useTranslation();
  const map: Record<ImportJobStatus, { label: string; className: string }> = {
    DISCOVERED: { label: isMounted ? t.adminImports.badgeDiscovered : "Discovered", className: "bg-kawaii-sky/20 text-kawaii-babyblue border-kawaii-sky/40" },
    PROCESSING: { label: isMounted ? t.adminImports.badgeProcessing : "Processing", className: "bg-amber-100 text-amber-700 border-amber-200" },
    NEEDS_REVIEW: { label: isMounted ? t.adminImports.badgeNeedsReview : "Needs Review", className: "bg-orange-100 text-orange-700 border-orange-200" },
    APPROVED: { label: isMounted ? t.adminImports.badgeApproved : "Approved", className: "bg-green-100 text-green-700 border-green-200" },
    IMPORTED: { label: isMounted ? t.adminImports.badgePublished : "Published", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    FAILED: { label: isMounted ? t.adminImports.badgeFailed : "Failed", className: "bg-red-100 text-red-700 border-red-200" },
    DUPLICATE: { label: isMounted ? t.adminImports.badgeDuplicate : "Duplicate", className: "bg-purple-100 text-purple-700 border-purple-200" },
    SKIPPED: { label: isMounted ? t.adminImports.badgeSkipped : "Skipped", className: "bg-slate-100 text-slate-600 border-slate-200" },
  };
  const cfg = map[status] ?? { label: status, className: "bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function ConfidenceDot({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-slate-400">—</span>;
  const pct = Math.round(value * 100);
  const color = value >= 0.9 ? "text-emerald-600 font-bold" : value >= 0.7 ? "text-amber-600 font-semibold" : "text-red-500 font-semibold";
  return <span className={`text-xs tabular-nums ${color}`}>{pct}%</span>;
}

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────

export default function ImportsPage() {
  const { t, isMounted } = useTranslation();
  const [filter, setFilter] = useState<ImportJobFilter>({ page: 1, limit: 20 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useImportJobs(filter);
  const bulkApproveMutation = useBulkApproveImports();

  // Client-side search filter on originalName / englishName / referenceNumber
  const filteredJobs = useMemo(() => {
    const jobs: ImportJobDto[] = data?.data ?? [];
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.thread.originalName.toLowerCase().includes(q) ||
        j.draft?.englishName?.toLowerCase().includes(q) ||
        String(j.thread.discordReferenceNumber ?? "").includes(q),
    );
  }, [data?.data, search]);

  // Bulk-approvable subset
  const bulkCandidates = useMemo(() => filteredJobs.filter((j) => isBulkApproveCandidate(j)), [filteredJobs]);

  const allSelected = selectedIds.size > 0 && bulkCandidates.length > 0 && bulkCandidates.every((j) => selectedIds.has(j.id));

  const resetMutation = useResetImports();

  function handleResetDb() {
    if (window.confirm(isMounted ? t.adminImports.resetDbConfirm : "Bạn có chắc chắn muốn xóa sạch toàn bộ bản nháp và import jobs cũ không?")) {
      resetMutation.mutate();
    }
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(bulkCandidates.map((j) => j.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkApprove() {
    if (selectedIds.size === 0) return;
    await bulkApproveMutation.mutateAsync({ jobIds: [...selectedIds] });
    setSelectedIds(new Set());
  }

  const getStatusFilterLabel = (status?: ImportJobStatus) => {
    if (!status) return isMounted ? t.adminImports.allStatuses : "Tất cả trạng thái";
    switch (status) {
      case "NEEDS_REVIEW":
        return isMounted ? t.adminImports.statusNeedsReview : "Cần xét duyệt (Needs Review)";
      case "DUPLICATE":
        return isMounted ? t.adminImports.statusDuplicate : "Trùng lặp (Duplicate)";
      case "FAILED":
        return isMounted ? t.adminImports.statusFailed : "Lỗi xử lý (Failed)";
      case "IMPORTED":
        return isMounted ? t.adminImports.statusImported : "Đã phát hành (Published)";
      case "SKIPPED":
        return isMounted ? t.adminImports.statusSkipped : "Đã bỏ qua (Skipped)";
      case "DISCOVERED":
        return isMounted ? t.adminImports.statusDiscovered : "Đã phát hiện (Discovered)";
      case "PROCESSING":
        return isMounted ? t.adminImports.statusProcessing : "Đang xử lý (Processing)";
      case "APPROVED":
        return isMounted ? t.adminImports.statusApproved : "Đã duyệt (Approved)";
      default:
        return String(status).replace(/_/g, " ");
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.IMPORT_READ}>
      <div className="space-y-6">
        {/* ─── Header ─── */}
        <PageHeader
          icon={CloudUpload}
          title={isMounted ? t.adminImports.title : "Discord Imports"}
          description={isMounted ? t.adminImports.description : "Xét duyệt và phát hành giao diện bàn phím nhập từ Discord Threads"}
          actions={
            <div className="flex items-center gap-2">
              {process.env.NODE_ENV !== "production" && (
                <PermissionGate permission={PERMISSIONS.IMPORT_MANAGE}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-2xl border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 bouncy-hover"
                    onClick={handleResetDb}
                    disabled={resetMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    {isMounted ? t.adminImports.resetDbBtn : "Dọn sạch DB"}
                  </Button>
                </PermissionGate>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-2xl border-kawaii-sky/50 text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/30 bouncy-hover"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
                {isMounted ? t.adminImports.refreshBtn : "Làm mới"}
              </Button>

              <PermissionGate permission={PERMISSIONS.IMPORT_APPROVE}>
                {selectedIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      className="h-10 rounded-2xl bg-kawaii-babyblue hover:bg-kawaii-babyblue/90 text-white font-bold shadow-md bouncy-hover"
                      onClick={handleBulkApprove}
                      disabled={bulkApproveMutation.isPending}
                    >
                      {bulkApproveMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <CheckCheck className="h-4 w-4 mr-1.5" />
                      )}
                      {isMounted
                        ? `${t.adminImports.bulkApproveBtnPrefix} ${selectedIds.size} ${t.adminImports.bulkApproveBtnSuffix}`
                        : `Duyệt ${selectedIds.size} mục đã chọn`}
                    </Button>
                  </motion.div>
                )}
              </PermissionGate>
            </div>
          }
        />

        {/* ─── Filters ─── */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kawaii-mocha/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isMounted ? t.adminImports.searchPlaceholder : "Tìm theo tên hoặc #mã số..."}
              className="pl-9 h-11 rounded-2xl border-2 border-input bg-kawaii-cloud/40 text-kawaii-mocha placeholder:text-kawaii-mocha/40"
            />
          </div>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-2 border-input gap-2 text-kawaii-mocha font-semibold text-xs"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {getStatusFilterLabel(filter.status)}
                <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-2xl p-2" align="start">
              <DropdownMenuLabel className="text-xs text-kawaii-mocha/60">
                {isMounted ? t.adminImports.filterStatusLabel : "Lọc theo trạng thái"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filter.status ?? "ALL"}
                onValueChange={(v) =>
                  setFilter((f) => ({
                    ...f,
                    status: v === "ALL" ? undefined : (v as ImportJobStatus),
                    page: 1,
                  }))
                }
              >
                {[
                  { key: "ALL", label: isMounted ? t.adminImports.allStatus : "Tất cả" },
                  { key: "NEEDS_REVIEW", label: isMounted ? t.adminImports.statusNeedsReview : "Cần xét duyệt (Needs Review)" },
                  { key: "DUPLICATE", label: isMounted ? t.adminImports.statusDuplicate : "Trùng lặp (Duplicate)" },
                  { key: "FAILED", label: isMounted ? t.adminImports.statusFailed : "Lỗi xử lý (Failed)" },
                  { key: "IMPORTED", label: isMounted ? t.adminImports.statusImported : "Đã phát hành (Published)" },
                  { key: "SKIPPED", label: isMounted ? t.adminImports.statusSkipped : "Đã bỏ qua (Skipped)" },
                ].map((s) => (
                  <DropdownMenuRadioItem key={s.key} value={s.key} className="rounded-xl text-xs">
                    {s.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Limit selector */}
          <select
            className="h-11 w-auto min-w-[125px] rounded-2xl border-2 border-input bg-background px-3 text-xs font-semibold text-kawaii-mocha shadow-inner focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/25 cursor-pointer"
            value={filter.limit ?? 20}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                limit: Number(e.target.value),
                page: 1,
              }))
            }
            aria-label={isMounted ? t.adminImports.limitAriaLabel : "Số dòng mỗi trang"}
          >
            <option value={20}>20 {isMounted ? t.adminImports.limitPerPage : "/ trang"}</option>
            <option value={50}>50 {isMounted ? t.adminImports.limitPerPage : "/ trang"}</option>
            <option value={100}>100 {isMounted ? t.adminImports.limitPerPage : "/ trang"}</option>
          </select>

          {/* Duplicate filter */}
          <Button
            variant={filter.isDuplicateCandidate === true ? "default" : "outline"}
            size="sm"
            className={`h-11 rounded-2xl gap-1.5 text-xs font-bold ${
              filter.isDuplicateCandidate === true
                ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100"
                : "border-2 border-input text-kawaii-mocha hover:bg-kawaii-sky/20"
            }`}
            onClick={() =>
              setFilter((f) => ({
                ...f,
                isDuplicateCandidate: f.isDuplicateCandidate === true ? undefined : true,
                page: 1,
              }))
            }
          >
            <Copy className="h-3.5 w-3.5" />
            {isMounted ? t.adminImports.filterDuplicateBtn : "Nghi trùng"}
          </Button>

          {/* High confidence filter */}
          <Button
            variant={filter.minConfidence === 0.85 ? "default" : "outline"}
            size="sm"
            className={`h-11 rounded-2xl gap-1.5 text-xs font-bold ${
              filter.minConfidence === 0.85
                ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "border-2 border-input text-kawaii-mocha hover:bg-kawaii-sky/20"
            }`}
            onClick={() =>
              setFilter((f) => ({
                ...f,
                minConfidence: f.minConfidence === 0.85 ? undefined : 0.85,
                page: 1,
              }))
            }
          >
            <Zap className="h-3.5 w-3.5" />
            {isMounted ? t.adminImports.filterHighConfidenceBtn : "Độ tin cậy cao (≥85%)"}
          </Button>

          {/* Stats summary */}
          <div className="ml-auto text-xs font-semibold text-kawaii-mocha/60">
            {data?.total ?? 0} {isMounted ? t.adminImports.statsTotal : "tổng cộng"} · {bulkCandidates.length}{" "}
            {isMounted ? t.adminImports.statsEligible : "đủ điều kiện duyệt nhanh"}
          </div>
        </div>

        {/* ─── Select all banner ─── */}
        <AnimatePresence>
          {bulkCandidates.length > 0 && (
            <PermissionGate permission={PERMISSIONS.IMPORT_APPROVE}>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-kawaii-sky/15 border border-kawaii-sky/40"
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  id="select-all"
                  className="h-4 w-4 rounded border-kawaii-sky text-kawaii-babyblue focus:ring-kawaii-sky cursor-pointer"
                />
                <label htmlFor="select-all" className="text-xs font-bold text-kawaii-mocha cursor-pointer select-none">
                  {isMounted
                    ? `${t.adminImports.selectAllCandidates} ${bulkCandidates.length} ${t.adminImports.selectAllCandidatesSuffix}`
                    : `Chọn toàn bộ ${bulkCandidates.length} mục có độ tin cậy cao`}
                </label>
                {selectedIds.size > 0 && (
                  <span className="ml-auto text-xs font-semibold text-kawaii-mocha/70">
                    {isMounted
                      ? `${t.adminImports.selectedCountPrefix} ${selectedIds.size} ${t.adminImports.selectedCountSuffix}`
                      : `Đã chọn ${selectedIds.size} mục`}
                  </span>
                )}
              </motion.div>
            </PermissionGate>
          )}
        </AnimatePresence>

        {/* ─── Table ─── */}
        <div className="rounded-3xl border-2 border-kawaii-sky/30 bg-card/60 overflow-hidden shadow-[0_4px_20px_rgba(162,207,254,0.12)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-kawaii-mocha/50 text-sm font-semibold">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {isMounted ? t.adminImports.loadingJobs : "Đang tải danh sách imports..."}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-kawaii-mocha/50">
              <CloudUpload className="h-10 w-10 text-kawaii-sky/50" />
              <p className="text-sm font-semibold">
                {isMounted ? t.adminImports.emptyJobs : "Không tìm thấy import job nào"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-kawaii-sky/15">
              {filteredJobs.map((job) => {
                const draft = job.draft;
                const isCandidate = isBulkApproveCandidate(job);
                const isSelected = selectedIds.has(job.id);
                const minConf = draft ? getMinConfidence(draft) : null;

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-kawaii-cloud/40 ${
                      isSelected ? "bg-kawaii-sky/15" : ""
                    }`}
                  >
                    {/* Checkbox — only for bulk candidates */}
                    <PermissionGate permission={PERMISSIONS.IMPORT_APPROVE}>
                      {isCandidate ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(job.id)}
                          className="h-4 w-4 rounded border-kawaii-sky text-kawaii-babyblue focus:ring-kawaii-sky cursor-pointer flex-shrink-0"
                        />
                      ) : (
                        <div className="h-4 w-4 flex-shrink-0" />
                      )}
                    </PermissionGate>

                    {/* Cover thumbnail */}
                    <div className="h-12 w-12 rounded-2xl overflow-hidden bg-kawaii-cloud/50 flex-shrink-0 border border-kawaii-sky/30 shadow-sm relative">
                      {draft?.coverUrl ? (
                        <Image
                          src={draft.coverUrl}
                          alt={draft.englishName ?? job.thread.originalName}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </div>
                      )}
                    </div>

                    {/* Name & source */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-kawaii-mocha truncate">
                          {draft?.englishName ?? (
                            <span className="text-kawaii-mocha/50 italic font-normal">
                              {isMounted ? t.adminImports.noEnglishName : "Chưa có tên tiếng Anh"}
                            </span>
                          )}
                        </p>
                        {job.thread.discordReferenceNumber && (
                          <span className="text-xs text-kawaii-babyblue font-mono font-black bg-kawaii-sky/30 border border-kawaii-sky/40 px-2 py-0.5 rounded-lg shadow-sm">
                            #{job.thread.discordReferenceNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-kawaii-mocha/55 truncate mt-0.5 font-medium">
                        {isMounted ? t.adminImports.originalThread : "Thread gốc:"} {job.thread.originalName}
                      </p>
                    </div>

                    {/* Flags */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {draft?.isDuplicateCandidate && (
                        <span title={isMounted ? t.adminImports.possibleDuplicateTooltip : "Nghi ngờ trùng lặp"}>
                          <Copy className="h-4 w-4 text-purple-500" />
                        </span>
                      )}
                      {(draft?.flags?.length ?? 0) > 0 && (
                        <span title={`${isMounted ? t.adminImports.warningTooltipPrefix : "Cảnh báo:"} ${draft!.flags!.join(", ")}`}>
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <StatusBadge status={job.status} />
                    </div>

                    {/* Confidence */}
                    <div className="flex-shrink-0 w-12 text-right">
                      <ConfidenceDot value={minConf} />
                    </div>

                    {/* Platform */}
                    <div className="flex-shrink-0 hidden md:block">
                      {draft?.platform ? (
                        <Badge variant="outline" className="text-[11px] font-bold border-kawaii-sky/40 text-kawaii-mocha/70">
                          {draft.platform}
                        </Badge>
                      ) : (
                        <span className="text-xs text-kawaii-mocha/30">—</span>
                      )}
                    </div>

                    {/* Detail link */}
                    <Link
                      href={`/imports/${job.id}`}
                      title={isMounted ? t.adminImports.viewDetailAria : "Xem chi tiết"}
                      aria-label={isMounted ? t.adminImports.viewDetailAria : "Xem chi tiết"}
                      className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-2xl bg-kawaii-cloud/70 hover:bg-kawaii-sky/30 transition-all text-kawaii-mocha/60 hover:text-kawaii-babyblue shadow-sm bouncy-hover"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Pagination ─── */}
        {data && (
          <PaginationNav
            page={filter.page ?? 1}
            totalPages={data.totalPages}
            total={data.total}
            limit={filter.limit ?? 20}
            onPageChange={(p) => setFilter((f) => ({ ...f, page: p }))}
          />
        )}
      </div>
    </PermissionGate>
  );
}

