import { apiRequest } from "@/lib/api";

export async function likeAsset(id: number) {
  return apiRequest(`/images/${id}/like`, {
    method: "POST",
  });
}

export async function unlikeAsset(id: number) {
  return apiRequest(`/images/${id}/like`, {
    method: "DELETE",
  });
}
