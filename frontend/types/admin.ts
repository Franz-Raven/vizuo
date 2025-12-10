export type UserRole = "admin" | "designer";
export type UserStatus = "ACTIVE" | "BANNED";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
