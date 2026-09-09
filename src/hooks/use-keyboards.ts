"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { keyboardService } from "@/services/keyboard.service";
import { colorService, styleService } from "@/services/taxonomy.service";
import type {
  KeyboardDetail,
  KeyboardListParams,
} from "@/types/keyboard.types";

export const keyboardKeys = {
  all: ["public-keyboards"] as const,
  list: (params: KeyboardListParams) => [...keyboardKeys.all, "list", params] as const,
  liked: (params?: { page?: number; limit?: number }) => [...keyboardKeys.all, "liked", params] as const,
  detail: (slug: string) => [...keyboardKeys.all, "detail", slug] as const,
  categories: ["public-keyboard-categories"] as const,
  colors: ["public-keyboard-colors"] as const,
  styles: ["public-keyboard-styles"] as const,
};

export function useKeyboards(params: KeyboardListParams) {
  return useQuery({
    queryKey: keyboardKeys.list(params),
    queryFn: () => keyboardService.getList(params),
  });
}

export function useLikedKeyboards(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: keyboardKeys.liked(params),
    queryFn: () => keyboardService.getLikedKeyboards(params),
  });
}

export function useKeyboard(slug: string, initialData?: KeyboardDetail) {
  return useQuery({
    queryKey: keyboardKeys.detail(slug),
    queryFn: () => keyboardService.getBySlug(slug),
    initialData,
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      return status !== 404 && failureCount < 2;
    },
  });
}

export function useToggleKeyboardLike(slug: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => keyboardService.toggleLike(slug),
    onSuccess: (result) => {
      client.setQueryData<KeyboardDetail>(keyboardKeys.detail(slug), (current) => current ? {
        ...current,
        isLiked: result.liked,
        likeCount: result.likeCount,
      } : current);
      client.invalidateQueries({ queryKey: [...keyboardKeys.all, "list"] });
      client.invalidateQueries({ queryKey: [...keyboardKeys.all, "liked"] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: keyboardKeys.categories,
    queryFn: categoryService.getPublicList,
    staleTime: 5 * 60 * 1000,
  });
}

export function useColors() {
  return useQuery({
    queryKey: keyboardKeys.colors,
    queryFn: colorService.getPublicList,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStyles() {
  return useQuery({
    queryKey: keyboardKeys.styles,
    queryFn: styleService.getPublicList,
    staleTime: 5 * 60 * 1000,
  });
}
