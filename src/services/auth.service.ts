import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { LoginPayload, RegisterPayload } from "@/types/auth.types";
import { User, UserDevice } from "@/types/user.types";

export interface ActiveSession {
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export const authService = {
  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    const res = await apiClient.post<ApiResponse<{ user: User; accessToken: string }>>("/auth/login", payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const res = await apiClient.post<ApiResponse<User>>("/auth/register", payload);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async updateProfile(payload: { fullName?: string; avatarUrl?: string; phoneNumber?: string }): Promise<void> {
    await apiClient.put("/auth/profile", payload);
  },

  async getAvatarUploadUrl(contentType: string): Promise<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }> {
    const res = await apiClient.post<ApiResponse<{ uploadUrl: string; publicUrl: string; key: string; expiresIn: number }>>("/auth/avatar/upload-url", {
      contentType,
    });
    return res.data.data;
  },

  async confirmAvatarUpload(key: string): Promise<{ avatarUrl: string }> {
    const res = await apiClient.post<ApiResponse<{ avatarUrl: string }>>("/auth/avatar/confirm", {
      key,
    });
    return res.data.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    // 1. Request presigned upload URL from BE
    const { uploadUrl, key } = await this.getAvatarUploadUrl(file.type);

    // 2. Direct PUT binary file to presigned URL (S3 / R2 storage)
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Không thể tải ảnh lên bộ nhớ đám mây");
    }

    // 3. Confirm upload key with backend
    const result = await this.confirmAvatarUpload(key);
    return result.avatarUrl;
  },

  async updatePassword(payload: { oldPassword?: string; newPassword: string }): Promise<void> {
    await apiClient.put("/auth/password", payload);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(payload: { token: string; newPassword: string }): Promise<void> {
    await apiClient.post("/auth/reset-password", payload);
  },

  async getSessions(): Promise<ActiveSession[]> {
    const res = await apiClient.get<ApiResponse<ActiveSession[]>>("/auth/sessions");
    return res.data.data;
  },

  async revokeSession(id: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${id}`);
  },

  async revokeOtherSessions(): Promise<void> {
    await apiClient.delete("/auth/sessions");
  },

  async getDevices(): Promise<UserDevice[]> {
    const res = await apiClient.get<ApiResponse<UserDevice[]>>("/auth/devices");
    return res.data.data;
  },

  async deleteDevice(id: string): Promise<void> {
    await apiClient.delete(`/auth/devices/${id}`);
  },

  getDiscordOAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999"}/api/v1/auth/discord`;
  },
};
