// lib/api/auth.ts
import { apiRequest } from "@/lib/api";

type RegisterPayload = { username: string; email: string; password: string };
type LoginPayload = { identifier: string; password: string };

export async function registerUser(data: RegisterPayload) {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result?.user?.email) {
    localStorage.setItem("userEmail", result.user.email);
  }

  return result;
}

export async function loginUser(data: LoginPayload) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result?.user?.email) {
    localStorage.setItem("userEmail", result.user.email);
  }

  return result;
}

export async function logoutUser() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch {
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("userEmail");
  }
}
