import { apiRequest } from "@/lib/api";
import { SavedImage } from "@/types/save-image";

export async function getSavedImages() {
  return apiRequest<SavedImage[]>("/saved-images");
}

export async function saveImage(imageId: number) {
  return apiRequest<SavedImage>(`/saved-images/${imageId}`, {
    method: "POST",
  });
}

export async function unsaveImage(imageId: number) {
  return apiRequest<void>(`/saved-images/${imageId}`, {
    method: "DELETE",
  });
}

export async function getSavedImagesByIds(ids: number[]) {
  const query = ids.map(id => `ids=${id}`).join("&");
  return apiRequest<SavedImage[]>(`/saved-images/by-ids?${query}`);
}
