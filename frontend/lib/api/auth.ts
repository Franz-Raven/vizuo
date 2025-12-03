import { apiRequest } from "@/lib/api";
import { AuthResponse } from "@/types/auth";

type RegisterPayload = { username: string; email: string; password: string };
type LoginPayload = { identifier: string; password: string };

export async function registerUser(data: RegisterPayload) {
  const result = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result.user?.email) {
    localStorage.setItem("userEmail", result.user.email);
  }

  return result;
}

export async function loginUser(data: LoginPayload) {
  const result = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result.user?.email) {
    localStorage.setItem("userEmail", result.user.email);
  }

  return result;
}

export async function logoutUser() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail");
    }
  }
}
