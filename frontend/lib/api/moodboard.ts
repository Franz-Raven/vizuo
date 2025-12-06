import { apiRequest } from "@/lib/api";
import { Moodboard, MoodboardCreatePayload } from "@/types/moodboard";

export async function getMoodboards() {
  return apiRequest<Moodboard[]>("/moodboards");
}

export async function createMoodboard(data: MoodboardCreatePayload) {
  return apiRequest<Moodboard>("/moodboards/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function assignSavedImagesToMoodboard(
  moodboardId: number,
  savedImageIds: number[]
) {
  return apiRequest<Moodboard>(`/moodboards/${moodboardId}/assign`, {
    method: "POST",
    body: JSON.stringify(savedImageIds),
  });
}

export async function removeSavedImageFromMoodboard(
  moodboardId: number,
  savedImageId: number
) {
  return apiRequest<Moodboard>(
    `/moodboards/${moodboardId}/saved-images/${savedImageId}`,
    {
      method: "DELETE",
    }
  );
}

export async function getPublicMoodboards(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Moodboard[]>(`/moodboards/public${query}`);
}

export async function getSavedMoodboards() {
  return apiRequest<Moodboard[]>("/moodboards/saved");
}

export async function saveMoodboard(moodboardId: number) {
  return apiRequest<void>(`/moodboards/${moodboardId}/save`, {
    method: "POST",
  });
}

export async function unsaveMoodboard(moodboardId: number) {
  return apiRequest<void>(`/moodboards/${moodboardId}/save`, {
    method: "DELETE",
  });
}

export async function getMoodboardById(moodboardId: number) {
  return apiRequest<Moodboard>(`/moodboards/${moodboardId}`);
}

export async function updateMoodboard(
  moodboardId: number,
  data: { name: string; description: string }
) {
  return apiRequest<Moodboard>(`/moodboards/${moodboardId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMoodboard(moodboardId: number) {
  return apiRequest<void>(`/moodboards/${moodboardId}`, {
    method: "DELETE",
  });
}

export async function reorderMoodboardImages(
  moodboardId: number,
  savedImageIds: number[]
) {
  return apiRequest<Moodboard>(`/moodboards/${moodboardId}/reorder`, {
    method: "PUT",
    body: JSON.stringify(savedImageIds),
  });
}
