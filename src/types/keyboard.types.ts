export type KeyboardPlatform = "IOS" | "ANDROID" | "BOTH";

export type KeyboardAccessLevel =
  | "FREE"
  | "PREMIUM"
  | "DISCORD_MEMBER"
  | "DISCORD_ROLE";

export type KeyboardSort =
  | "latest"
  | "popular"
  | "liked"
  | "name-asc"
  | "name-desc";

export interface KeyboardCategory {
  id: string;
  name: string;
  slug: string;
  themeCount?: number;
}

export interface KeyboardColor {
  id: string;
  name: string;
  slug: string;
  hex: string;
  themeCount?: number;
}

export interface KeyboardStyle {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  themeCount?: number;
}

export interface KeyboardAuthor {
  id: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface KeyboardCardData {
  id: string;
  slug: string;
  name: string;
  coverUrl: string;
  platform: KeyboardPlatform;
  categories: KeyboardCategory[];
  colors: KeyboardColor[];
  styles: KeyboardStyle[];
  downloadCount: number;
  accessLevel?: KeyboardAccessLevel;
  likeCount?: number;
  isFeatured?: boolean;
  author?: KeyboardAuthor | null;
  publishedAt?: string | null;
  isLiked?: boolean;
  likedAt?: string | null;
}

export interface KeyboardPreviewImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface KeyboardDetail extends KeyboardCardData {
  description: string | null;
  requiredDiscordRoleIds: string[];
  previewImages: KeyboardPreviewImage[];
  isLiked?: boolean;
}

export interface KeyboardListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  colors?: string[];
  styles?: string[];
  platform?: "ios" | "android" | "both";
  accessLevel?: KeyboardAccessLevel;
  featured?: boolean;
  sort?: KeyboardSort;
}

export interface KeyboardListResult {
  data: KeyboardCardData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface KeyboardLikeResult {
  themeId: string;
  slug: string;
  liked: boolean;
  likeCount: number;
  message: string;
}
