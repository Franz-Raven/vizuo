// lib/api/profile.ts
import { apiRequest } from "@/lib/api";

export async function getProfile() {
  return apiRequest("/profile");
}

export async function updateProfile(profileData: any) {
  return apiRequest("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export async function uploadImage(file: File, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return apiRequest("/profile/upload", {
    method: "POST",
    body: formData,
  });
}
