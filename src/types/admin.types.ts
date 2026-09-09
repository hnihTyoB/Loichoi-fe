import type { KeyboardAccessLevel, KeyboardPlatform } from "./keyboard.types";

export type KeyboardStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface PageResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminKeyboard {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverUrl: string;
  driveUrl: string;
  platform: KeyboardPlatform;
  status: KeyboardStatus;
  accessLevel: KeyboardAccessLevel;
  requiredDiscordRoleIds: string[];
  categoryNames: string[];
  colorNames: string[];
  styleNames: string[];
  categories?: Array<{ id: string; name: string; slug: string; isActive: boolean }>;
  colors: Array<{ id: string; name: string; slug: string; hex: string }>;
  styles: Array<{ id: string; name: string; slug: string; description?: string | null }>;
  previewImages?: Array<{ id?: string; url: string; altText?: string | null; position: number }>;
  downloadCount: number;
  likeCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KeyboardPayload {
  name: string;
  slug?: string;
  description?: string;
  coverUrl: string;
  driveUrl: string;
  platform: KeyboardPlatform;
  status: KeyboardStatus;
  accessLevel: KeyboardAccessLevel;
  requiredDiscordRoleIds: string[];
  categoryIds: string[];
  colorIds: string[];
  styleIds: string[];
  isFeatured: boolean;
  previewImages: Array<{ url: string; altText?: string; position: number }>;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  themeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminColor {
  id: string;
  name: string;
  slug: string;
  hex: string;
  themeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStyle {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  themeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfigItem {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  category: "GENERAL" | "FEATURE_FLAG" | "INTEGRATION" | "SECURITY" | string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceConfig {
  id?: string;
  enabled: boolean;
  status: "ONLINE" | "MAINTENANCE" | "READ_ONLY";
  title: string;
  message: string;
  startAt: string | null;
  estimatedEndAt: string | null;
  bypassPermissions: string[];
  bypassRoles: string[];
  bypassIps: string[];
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  actorEmail?: string | null;
  actor?: { id: string; email: string | null; fullName: string | null; username: string | null } | null;
  action: string;
  targetType: string;
  targetId: string;
  targetEmail?: string | null;
  targetUser?: { id: string; email: string | null; fullName: string | null; username: string | null } | null;
  targetLabel?: string | null;
  details: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ApiKeyItem { id: string; name: string; prefix: string; permissions: string[]; isActive: boolean; lastUsedAt?: string | null; expiresAt?: string | null; createdAt: string }
export interface CreatedApiKey extends ApiKeyItem { key: string }
export interface WebhookEndpoint { id: string; url: string; events: string[]; isActive: boolean; description?: string | null; secretMasked: string; createdAt: string; updatedAt: string }
export interface WebhookDelivery { id: string; webhookEndpointId: string; event: string; payload: unknown; status: string; statusCode?: number | null; responseBody?: string | null; attempts: number; lastError?: string | null; deliveredAt?: string | null; createdAt: string }
export interface NotificationItem { id: string; type: string; priority: string; title: string; content: string; actionUrl: string | null; metadata: unknown; isRead: boolean; readAt: string | null; createdAt: string }
export interface EmailItem { id: string; userId: string | null; toEmail: string; subject: string; templateKey: string; templateData: unknown; status: string; attempts: number; lastError: string | null; sentAt: string | null; createdAt: string; updatedAt: string }
export interface NotificationTemplate { id: string; code: string; name: string; description: string | null; channels: string[]; subject: string | null; title: string | null; content: string; variables: string[]; isSystem: boolean; isActive: boolean; createdAt: string; updatedAt: string }
export interface StudioStats { totalThemes: number; publishedThemesCount: number; draftThemesCount: number; totalDownloads: number; totalLikes: number; totalFollowers: number; recentDownloadsTrend: Array<{ date: string; downloads: number }>; topThemes: Array<{ id: string; name: string; slug: string; coverUrl: string; downloadCount: number; likeCount: number; status: KeyboardStatus }> }
export interface CronJob { name: string; cron: string; description: string; isEnabled?: boolean; nextRun?: string; lastRun?: string; lastStatus?: string }
