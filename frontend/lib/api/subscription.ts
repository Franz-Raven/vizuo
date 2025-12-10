import { apiRequest } from '../api';
import { Plan, UserSubscription } from '@/types/subscription';

export const subscriptionApi = {
  getAllPlans: async (): Promise<Plan[]> => {
    return await apiRequest<Plan[]>('/subscriptions/plans', {
      method: 'GET',
    });
  },

  getCurrentSubscription: async (): Promise<UserSubscription> => {
    return await apiRequest<UserSubscription>('/subscriptions/current', {
      method: 'GET',
    });
  },

  subscribeToPlan: async (planId: number): Promise<UserSubscription> => {
    return await apiRequest<UserSubscription>('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },
};
