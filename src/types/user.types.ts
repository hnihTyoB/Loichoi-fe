export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  roleId: string;
  role?:
    | string
    | {
        id?: string;
        name: string;
        description?: string;
      };
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  phoneNumber?: string | null;
  discordId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  roleId: string;
}

export interface UserDevice {
  id: string;
  deviceName: string;
  ipAddress: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
}
