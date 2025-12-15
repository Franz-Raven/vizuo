import { apiRequest } from '../api'
import type { UserSubscription } from '@/types/subscription'

export async function usePremiumDownload(): Promise<UserSubscription> {
  return apiRequest<UserSubscription>('/downloads/premium/use', {
    method: 'POST',
  })
}

export async function trackPremiumDownload(imageId: number): Promise<UserSubscription> {
  return apiRequest<UserSubscription>("/downloads/premium/track", {
    method: "POST",
    body: JSON.stringify({ imageId }),
  })
}
