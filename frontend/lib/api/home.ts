import { apiRequest } from "@/lib/api";
import { ImageResponse } from "@/types/home";

export async function getHomeAssets() {
  return apiRequest<ImageResponse[]>("/images/feed", {
    method: "GET"
  });
}
