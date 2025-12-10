import { apiRequest } from "@/lib/api";
import { AdminUser, UserRole, UserStatus } from "@/types/admin";

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>("/admin/users", { method: "GET" });
}

export async function getAdminRoles(): Promise<string[]> {
  return apiRequest<string[]>("/admin/roles", { method: "GET" });
}

export async function updateUserRole(id: number, role: UserRole): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function updateUserStatus(id: number, status: UserStatus): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

