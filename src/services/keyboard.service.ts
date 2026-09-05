import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  KeyboardDetail,
  KeyboardLikeResult,
  KeyboardListParams,
  KeyboardListResult,
  KeyboardSort,
} from "@/types/keyboard.types";
import type { AdminKeyboard, KeyboardPayload, PageResult } from "@/types/admin.types";

const sortMap: Record<KeyboardSort, string> = {
  latest: "LATEST",
  popular: "POPULAR",
  liked: "TOP_LIKED",
  "name-asc": "NAME_ASC",
  "name-desc": "NAME_DESC",
};

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export function getValidImageMimeType(fileType?: string): AllowedImageMimeType {
  const normalized = (fileType || "image/webp").toLowerCase();
  if (ALLOWED_IMAGE_MIME_TYPES.includes(normalized as AllowedImageMimeType)) {
    return normalized as AllowedImageMimeType;
  }
  return "image/webp";
}

export const keyboardService = {
  async getManagementList(params: { page?: number; limit?: number; search?: string; status?: string; platform?: string; categoryId?: string; colorId?: string; styleId?: string } = {}): Promise<PageResult<AdminKeyboard>> {
    const response = await apiClient.get<PageResult<AdminKeyboard>>("/keyboards/manage", { params });
    return response.data;
  },

  async getManagementById(id: string): Promise<AdminKeyboard> {
    const response = await apiClient.get<ApiResponse<AdminKeyboard>>(`/keyboards/manage/${id}`);
    return response.data.data;
  },

  async create(payload: KeyboardPayload): Promise<AdminKeyboard> {
    const response = await apiClient.post<ApiResponse<AdminKeyboard>>("/keyboards", payload);
    return response.data.data;
  },

  async update(id: string, payload: Partial<KeyboardPayload>): Promise<AdminKeyboard> {
    const response = await apiClient.patch<ApiResponse<AdminKeyboard>>(`/keyboards/${id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/keyboards/${id}`);
  },

  async bulkDelete(ids: string[]): Promise<{ succeeded: string[]; failed: Array<{ id: string; reason: string }>; totalRequested: number; totalDeleted: number }> {
    const response = await apiClient.post<ApiResponse<{ succeeded: string[]; failed: Array<{ id: string; reason: string }>; totalRequested: number; totalDeleted: number }>>("/keyboards/manage/bulk-delete", { ids });
    return response.data.data;
  },

  async resetQuota(userId: string): Promise<void> {
    await apiClient.post(`/keyboards/manage/users/${userId}/reset-quota`);
  },

  async getList(params: KeyboardListParams = {}): Promise<KeyboardListResult> {
    const response = await apiClient.get<KeyboardListResult>("/keyboards", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search || undefined,
        category: params.category || undefined,
        colors: params.colors?.length ? params.colors.join(",") : undefined,
        styles: params.styles?.length ? params.styles.join(",") : undefined,
        platform: params.platform?.toUpperCase(),
        accessLevel: params.accessLevel,
        isFeatured: params.featured,
        sort: sortMap[params.sort ?? "latest"],
      },
    });

    return response.data;
  },

  async getBySlug(slug: string): Promise<KeyboardDetail> {
    const response = await apiClient.get<ApiResponse<KeyboardDetail>>(
      `/keyboards/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  },

  async toggleLike(slug: string): Promise<KeyboardLikeResult> {
    const response = await apiClient.post<{ success: boolean } & KeyboardLikeResult>(
      `/keyboards/${encodeURIComponent(slug)}/like`,
    );
    return response.data;
  },

  async download(slug: string): Promise<{ downloadUrl: string }> {
    const response = await apiClient.post<ApiResponse<{ downloadUrl: string }>>(
      `/keyboards/${encodeURIComponent(slug)}/download`,
    );
    return response.data.data;
  },

  async getUploadUrl(
    contentType: string,
    imageType: "COVER" | "PREVIEW" = "COVER",
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }> {
    const validMime = getValidImageMimeType(contentType);
    const response = await apiClient.post<
      ApiResponse<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }>
    >("/keyboards/upload-url", {
      contentType: validMime,
      imageType,
    });
    return response.data.data;
  },

  async getBatchUploadUrls(
    files: Array<{ contentType: string; imageType?: "COVER" | "PREVIEW" }>,
  ): Promise<Array<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }>> {
    const sanitizedFiles = files.map((f) => ({
      contentType: getValidImageMimeType(f.contentType),
      imageType: f.imageType ?? "COVER",
    }));

    const response = await apiClient.post<
      ApiResponse<{ items: Array<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }> }>
    >("/keyboards/batch-upload-urls", {
      files: sanitizedFiles,
    });
    return response.data.data.items;
  },

  async uploadImageToR2(
    file: File,
    imageType: "COVER" | "PREVIEW" = "COVER",
  ): Promise<{ publicUrl: string; key: string }> {
    const contentType = getValidImageMimeType(file.type);
    const { uploadUrl, publicUrl, key } = await this.getUploadUrl(contentType, imageType);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Không thể tải ảnh lên bộ nhớ đám mây R2");
    }

    return { publicUrl, key };
  },

  async uploadMultipleImagesToR2(
    files: File[],
    onProgress?: (index: number, total: number, file: File, publicUrl: string) => void,
  ): Promise<string[]> {
    if (files.length === 0) return [];

    const BATCH_SIZE = 15;
    const allResults: string[] = [];

    for (let chunkStart = 0; chunkStart < files.length; chunkStart += BATCH_SIZE) {
      const chunkFiles = files.slice(chunkStart, chunkStart + BATCH_SIZE);
      const presignedItems = await this.getBatchUploadUrls(
        chunkFiles.map((file, idx) => ({
          contentType: getValidImageMimeType(file.type),
          imageType: chunkStart === 0 && idx === 0 ? "COVER" : "PREVIEW",
        })),
      );

      const chunkResults = await Promise.all(
        chunkFiles.map(async (file, idx) => {
          const globalIdx = chunkStart + idx;
          const item = presignedItems[idx];
          const contentType = getValidImageMimeType(file.type);
          const res = await fetch(item.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": contentType,
            },
            body: file,
          });

          if (!res.ok) {
            throw new Error(`Không thể tải ảnh ${file.name} lên R2`);
          }

          onProgress?.(globalIdx, files.length, file, item.publicUrl);
          return item.publicUrl;
        }),
      );

      allResults.push(...chunkResults);
    }

    return allResults;
  },
};
