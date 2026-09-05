import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AdminCollection, CollectionPayload, PageResult } from "@/types/admin.types";

export const collectionService = {
  async getManagementList(params: {
    page?: number;
    limit?: number;
    search?: string;
    isPublic?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}): Promise<PageResult<AdminCollection>> {
    const response = await apiClient.get<PageResult<AdminCollection>>("/collections/manage", { params });
    return response.data;
  },
  async getList(params: { page?: number; limit?: number; search?: string; isFeatured?: boolean } = {}): Promise<PageResult<AdminCollection>> {
    const response = await apiClient.get<PageResult<AdminCollection>>("/collections", { params });
    return response.data;
  },
  async getBySlug(slug: string): Promise<AdminCollection> {
    const response = await apiClient.get<ApiResponse<AdminCollection>>(`/collections/${encodeURIComponent(slug)}`);
    return response.data.data;
  },
  async create(payload: CollectionPayload): Promise<AdminCollection> {
    const response = await apiClient.post<ApiResponse<AdminCollection>>("/collections", payload);
    return response.data.data;
  },
  async update(id: string, payload: Partial<CollectionPayload>): Promise<void> {
    await apiClient.patch(`/collections/${id}`, payload);
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/collections/${id}`);
  },
  async addTheme(id: string, themeId: string, position?: number): Promise<void> {
    await apiClient.post(`/collections/${id}/themes`, { themeId, position });
  },
  async removeTheme(id: string, themeId: string): Promise<void> {
    await apiClient.delete(`/collections/${id}/themes/${themeId}`);
  },
};
