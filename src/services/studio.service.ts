import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AdminKeyboard, KeyboardPayload, PageResult, StudioStats } from "@/types/admin.types";
import { getValidImageMimeType } from "@/services/keyboard.service";

export const studioService = {
  async getStats(): Promise<StudioStats> {
    const response = await apiClient.get<ApiResponse<StudioStats>>("/studio/stats");
    return response.data.data;
  },

  async getThemes(params: { search?: string; status?: string; limit?: number } = {}): Promise<PageResult<AdminKeyboard>> {
    const response = await apiClient.get<PageResult<AdminKeyboard>>("/studio/themes", { params });
    return response.data;
  },

  async createTheme(payload: KeyboardPayload): Promise<AdminKeyboard> {
    const response = await apiClient.post<ApiResponse<AdminKeyboard>>("/studio/themes", payload);
    return response.data.data;
  },

  async updateTheme(id: string, payload: Partial<KeyboardPayload>): Promise<AdminKeyboard> {
    const response = await apiClient.patch<ApiResponse<AdminKeyboard>>(`/studio/themes/${id}`, payload);
    return response.data.data;
  },

  async deleteTheme(id: string): Promise<void> {
    await apiClient.delete(`/studio/themes/${id}`);
  },

  async getUploadUrl(
    contentType: string,
    imageType: "COVER" | "PREVIEW" = "COVER",
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }> {
    const validMime = getValidImageMimeType(contentType);
    const response = await apiClient.post<
      ApiResponse<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }>
    >("/studio/upload-url", {
      contentType: validMime,
      imageType,
    });
    return response.data.data;
  },

  async uploadImage(
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
      throw new Error("Không thể tải ảnh lên bộ nhớ đám mây");
    }

    return { publicUrl, key };
  },

  async updateProfile(payload: {
    username?: string;
    fullName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    socialLinks?: Record<string, string> | null;
  }): Promise<void> {
    await apiClient.put("/studio/profile", payload);
  },

  async apply(payload: { username: string; bio?: string; socialLinks?: Record<string, string> }): Promise<void> {
    await apiClient.post("/studio/apply", payload);
  },
};
