import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AuditLog, MaintenanceConfig, PageResult, SystemConfigItem } from "@/types/admin.types";

export const systemService = {
  async getConfigs(params: { category?: string; search?: string } = {}): Promise<SystemConfigItem[]> {
    const response = await apiClient.get<ApiResponse<SystemConfigItem[]>>("/system/configs", { params });
    return response.data.data;
  },
  async createConfig(payload: { key: string; value: unknown; description?: string; category: string; isPublic: boolean }): Promise<SystemConfigItem> {
    const response = await apiClient.post<ApiResponse<SystemConfigItem>>("/system/configs", payload);
    return response.data.data;
  },
  async updateConfig(key: string, payload: { value?: unknown; description?: string; category?: string; isPublic?: boolean }): Promise<SystemConfigItem> {
    const response = await apiClient.put<ApiResponse<SystemConfigItem>>(`/system/configs/${encodeURIComponent(key)}`, payload);
    return response.data.data;
  },
  async toggleFeature(key: string, enabled: boolean): Promise<SystemConfigItem> {
    const response = await apiClient.patch<ApiResponse<SystemConfigItem>>(`/system/features/${encodeURIComponent(key)}/toggle`, { enabled });
    return response.data.data;
  },
  async deleteConfig(key: string): Promise<void> { await apiClient.delete(`/system/configs/${encodeURIComponent(key)}`); },
  async getMaintenance(): Promise<MaintenanceConfig> {
    const response = await apiClient.get<ApiResponse<MaintenanceConfig>>("/maintenance/status");
    return response.data.data;
  },
  async enableMaintenance(payload: Partial<MaintenanceConfig>): Promise<MaintenanceConfig> {
    const response = await apiClient.post<ApiResponse<MaintenanceConfig>>("/maintenance/enable", payload);
    return response.data.data;
  },
  async updateMaintenance(payload: Partial<MaintenanceConfig>): Promise<MaintenanceConfig> {
    const response = await apiClient.put<ApiResponse<MaintenanceConfig>>("/maintenance/config", payload);
    return response.data.data;
  },
  async disableMaintenance(): Promise<MaintenanceConfig> {
    const response = await apiClient.post<ApiResponse<MaintenanceConfig>>("/maintenance/disable");
    return response.data.data;
  },
  async getAuditLogs(params: {
    actorId?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PageResult<AuditLog>> {
    const response = await apiClient.get<PageResult<AuditLog>>("/rbac/audit-logs", { params });
    return response.data;
  },
  async getHealthReadiness(): Promise<{
    status: "healthy" | "unhealthy";
    timestamp: string;
    totalDurationMs?: number;
    checks?: {
      database?: { status: "healthy" | "unhealthy" | "skipped"; latencyMs?: number; error?: string };
      redis?: { status: "healthy" | "unhealthy" | "skipped"; latencyMs?: number; error?: string };
    };
    metrics?: {
      uptimeSeconds?: number;
      heapUsedMb?: number;
      heapTotalMb?: number;
      rssMb?: number;
    };
  }> {
    const response = await apiClient.get("/health/readiness");
    return response.data;
  },
};
