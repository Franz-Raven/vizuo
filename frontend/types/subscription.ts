export interface Plan {
  id: number;
  name: string;
  priceMonthly: number;
  maxPremiumDownloads: number;
  canUploadPremium: boolean;
  description: string;
}

export interface UserSubscription {
  id: number;
  plan: Plan;
  startDate: string;
  currentPeriodEnd: string;
  status: 'active' | 'expired';
  premiumDownloadsUsed: number;
  premiumDownloadsRemaining: number;
}

export interface SubscribePlanRequest {
  planId: number;
}
