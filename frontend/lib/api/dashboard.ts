import { apiRequest } from "../api"
import type { CreatorDashboardResponse } from "@/types/dashboard"

export async function getDashboard(): Promise<CreatorDashboardResponse> {
  return apiRequest<CreatorDashboardResponse>("/dashboard", {
    method: "GET",
  })
}
