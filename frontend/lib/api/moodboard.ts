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
