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

// iimages currently in space
export const getSpaceImages = async (): Promise<SavedImage[]> => {
  return apiRequest<SavedImage[]>("/saved-images/space");
};

// saved images not in space
export const getAvailableForSpace = async (): Promise<SavedImage[]> => {
  return apiRequest<SavedImage[]>("/saved-images/space/available");
};

export const addToSpace = async (savedImageId: number): Promise<void> => {
  return apiRequest<void>(`/saved-images/space/add/${savedImageId}`, {
    method: "POST",
  });
};

export const removeFromSpace = async (savedImageId: number): Promise<void> => {
  return apiRequest<void>(`/saved-images/space/remove/${savedImageId}`, {
    method: "POST",
  });
};

// reorder space images
export const reorderSpace = async (savedImageIds: number[]): Promise<void> => {
  return apiRequest<void>("/saved-images/space/reorder", {
    method: "POST",
    body: JSON.stringify(savedImageIds),
  });
};
