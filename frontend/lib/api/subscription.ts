import { apiRequest } from '../api';
import { Plan, UserSubscription } from '@/types/subscription';

export async function getAllPlans(): Promise<Plan[]> {
  return apiRequest<Plan[]>('/subscriptions/plans', {
    method: 'GET',
  });
}

export async function getCurrentSubscription(): Promise<UserSubscription> {
  return apiRequest<UserSubscription>('/subscriptions/current', {
    method: 'GET',
  });
}

export async function subscribeToPlan(planId: number): Promise<UserSubscription> {
  return apiRequest<UserSubscription>('/subscriptions/subscribe', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  });
}
