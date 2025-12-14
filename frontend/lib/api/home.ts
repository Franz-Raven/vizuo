import { apiRequest } from "@/lib/api";
import { ImageResponse } from "@/types/home";

export type FeedResponse<T> = {
  items: T[];
  nextCursor: string | null;
};

export async function getHomeAssets(limit = 15, cursor?: string | null) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  return apiRequest<FeedResponse<ImageResponse>>(`/images/feed?${params.toString()}`, {
    method: "GET"
  });
}
