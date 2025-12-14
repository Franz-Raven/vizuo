import { apiRequest } from "@/lib/api";
import { ImageResponse, FeedResponse } from "@/types/home";

export async function getHomeAssets(limit = 15, cursor?: string | null) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  return apiRequest<FeedResponse<ImageResponse>>(`/images/feed?${params.toString()}`, {
    method: "GET"
  });
}

export async function searchHomeAssets(query: string, limit = 15, cursor?: string | null) {
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  return apiRequest<FeedResponse<ImageResponse>>(`/images/search?${params.toString()}`, {
    method: "GET"
  });
}
