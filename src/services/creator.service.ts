import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { PageResult } from "@/types/admin.types";
import type { KeyboardListParams, KeyboardListResult } from "@/types/keyboard.types";
import type {
  CreatorApplication,
  CreatorApplicationQuery,
  CreatorFollowResult,
  CreatorPublic,
  CreatorQuery,
} from "@/types/creator.types";

export const creatorService = {
  async getList(params: CreatorQuery = {}): Promise<PageResult<CreatorPublic>> {
    const response = await apiClient.get<PageResult<CreatorPublic>>("/creators", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search || undefined,
        featured: params.featured,
        sort: params.sort ?? "popular",
      },
    });
    return response.data;
  },

  async getByUsername(username: string): Promise<CreatorPublic> {
    const response = await apiClient.get<ApiResponse<CreatorPublic>>(
      `/creators/${encodeURIComponent(username)}`,
    );
    return response.data.data;
  },

  async getThemes(
    username: string,
    params: KeyboardListParams = {},
  ): Promise<KeyboardListResult> {
    const response = await apiClient.get<KeyboardListResult>(
      `/creators/${encodeURIComponent(username)}/themes`,
      { params },
    );
    return response.data;
  },

  async toggleFollow(username: string): Promise<CreatorFollowResult> {
    const response = await apiClient.post<ApiResponse<CreatorFollowResult>>(
      `/creators/${encodeURIComponent(username)}/follow`,
    );
    return response.data.data;
  },

  async getMyFollowing(params: { page?: number; limit?: number } = {}): Promise<PageResult<CreatorPublic>> {
    const response = await apiClient.get<PageResult<CreatorPublic>>("/creators/me/following", {
      params,
    });
    return response.data;
  },

  async getApplications(params: CreatorApplicationQuery = {}): Promise<PageResult<CreatorApplication>> {
    const response = await apiClient.get<PageResult<CreatorApplication>>("/creators/manage/applications", {
      params,
    });
    return response.data;
  },

  async approveApplication(userId: string): Promise<void> {
    await apiClient.post(`/creators/manage/applications/${userId}/approve`);
  },

  async rejectApplication(userId: string, reason?: string): Promise<void> {
    await apiClient.post(`/creators/manage/applications/${userId}/reject`, { reason });
  },

  async revokeCreator(userId: string): Promise<void> {
    await apiClient.post(`/creators/manage/creators/${userId}/revoke`);
  },
};
