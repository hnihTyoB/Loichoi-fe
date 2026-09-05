"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importService } from "@/services/import.service";
import { toast } from "sonner";
import { dictionary } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/language-store";
import type {
  ImportJobFilter,
  UpdateDraftPayload,
  BulkApprovePayload,
} from "@/types/import.types";

function getImportsDict() {
  const lang = useLanguageStore.getState().language || "vi";
  return dictionary[lang]?.adminImports ?? dictionary.vi.adminImports;
}

// ──────────────────────────────────────────────
// Query Keys
// ──────────────────────────────────────────────

export const importKeys = {
  all: ["imports"] as const,
  list: (filter: ImportJobFilter) => [...importKeys.all, "list", filter] as const,
  detail: (id: string) => [...importKeys.all, "detail", id] as const,
};

// ──────────────────────────────────────────────
// Queries
// ──────────────────────────────────────────────

export function useImportJobs(filter: ImportJobFilter = {}) {
  return useQuery({
    queryKey: importKeys.list(filter),
    queryFn: () => importService.list(filter),
    staleTime: 30 * 1000, // 30s
  });
}

export function useImportJob(id: string) {
  return useQuery({
    queryKey: importKeys.detail(id),
    queryFn: () => importService.getById(id),
    enabled: !!id,
  });
}

// ──────────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────────

export function useUpdateDraft(importJobId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDraftPayload) => importService.updateDraft(importJobId, payload),
    onSuccess: () => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: importKeys.detail(importJobId) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success(dict.draftUpdatedSuccess);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update draft";
      toast.error(message);
    },
  });
}

export function useApproveImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => importService.approve(id),
    onSuccess: (_, id) => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success(dict.keyboardPublishedSuccess);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Approval failed";
      toast.error(message);
    },
  });
}

export function useBulkApproveImports() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkApprovePayload) => importService.bulkApprove(payload),
    onSuccess: (result) => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      const succeeded = result?.data?.succeeded ?? (result as unknown as { succeeded?: unknown[] })?.succeeded ?? [];
      const failed = result?.data?.failed ?? (result as unknown as { failed?: unknown[] })?.failed ?? [];

      if (succeeded.length > 0) {
        toast.success(`${dict.bulkApproveSuccessPrefix} ${succeeded.length} ${dict.bulkApproveSuccessSuffix}`);
      }
      if (failed.length > 0) {
        toast.error(`${dict.bulkApprovePartialFailedPrefix} ${failed.length} ${dict.bulkApprovePartialFailedSuffix}`);
      }
    },
    onError: (err: unknown) => {
      const dict = getImportsDict();
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        dict.bulkApproveFailed;
      toast.error(message);
    },
  });
}

export function useRejectImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => importService.reject(id, reason),
    onSuccess: (_, { id }) => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success(dict.importRejectedSuccess);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Rejection failed";
      toast.error(message);
    },
  });
}

export function useReprocessImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => importService.reprocess(id),
    onSuccess: (_, id) => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.info(dict.importReprocessQueued);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to reprocess";
      toast.error(message);
    },
  });
}

export function useResetImports() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => importService.reset(),
    onSuccess: (result) => {
      const dict = getImportsDict();
      client.invalidateQueries({ queryKey: importKeys.all });
      toast.success(`${dict.resetSuccessPrefix} ${result.data.deletedCount} ${dict.resetSuccessSuffix}`);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const message =
        status === 404 || status === 403
          ? "Chức năng dọn sạch DB chỉ khả dụng trong môi trường phát triển (Development / Staging)."
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Reset failed";
      toast.error(message);
    },
  });
}

