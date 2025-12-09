import { apiRequest } from "@/lib/api";
import {
  GetProfileResponse,
  UpdateProfileResponse,
  UploadImageResponse,
  ProfileUpdatePayload,
  ProfileResponse,
  ProfileAsset
} from "@/types/profile";

export async function getProfile() {
  return apiRequest<GetProfileResponse>("/profile");
}

export async function updateProfile(profileData: ProfileUpdatePayload) {
  return apiRequest<UpdateProfileResponse>("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData)
  });
}

export async function getProfileAssets() {
  return apiRequest<ProfileResponse>("/profile/assets");
}

export async function getProfileSpaceItems() {
  return apiRequest<{ items: ProfileAsset[] }>("/profile/space");
}

export async function getProfileUploads() {
  return apiRequest<{ items: ProfileAsset[] }>("/profile/uploads");
}

export async function getProfileFavorites() {
  return apiRequest<{ items: ProfileAsset[] }>("/profile/favorites");
}

export async function uploadImage(file: File, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return apiRequest<UploadImageResponse>("/profile/upload", {
    method: "POST",
    body: formData
  });
}
