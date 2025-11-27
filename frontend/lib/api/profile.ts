import { apiRequest } from "@/lib/api";
import {
  GetProfileResponse,
  UpdateProfileResponse,
  UploadImageResponse,
  ProfileUpdatePayload
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

export async function uploadImage(file: File, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return apiRequest<UploadImageResponse>("/profile/upload", {
    method: "POST",
    body: formData
  });
}
