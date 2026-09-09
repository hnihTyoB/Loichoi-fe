export interface CreatorStats {
  themesCount: number;
  downloadsCount: number;
  followersCount: number;
  likesCount: number;
}

export interface CreatorPublic {
  id: string;
  fullName: string | null;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  isCreator: boolean;
  isFeaturedCreator: boolean;
  socialLinks: Record<string, string> | null;
  stats: CreatorStats;
  isFollowing?: boolean;
  joinedAt?: string;
}

export interface CreatorFollowResult {
  following: boolean;
  followersCount: number;
}

export interface CreatorQuery {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  sort?: "popular" | "followers" | "themes" | "downloads" | "latest";
}

export interface CreatorApplication {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  portfolioUrl: string | null;
  socialLinks: Record<string, string> | null;
  bio: string | null;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
}

export interface CreatorApplicationQuery {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
}
