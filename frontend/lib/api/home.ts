import { apiRequest } from "@/lib/api";

export async function getHomeAssets() {
  return apiRequest("/images/feed", {
    method: "GET"
  });
}
