'use client';

import { useState, useEffect } from 'react';
import { X, Check, Sparkles, Crown, Zap, Infinity } from 'lucide-react';
import { Plan, UserSubscription } from '@/types/subscription';
import { getAllPlans, subscribeToPlan, getCurrentSubscription } from '@/lib/api/subscription';
import { toast } from 'sonner';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionChange?: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscriptionChange }: SubscriptionModalProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Always load plans
      const plansData = await getAllPlans();
      setPlans(plansData);
      
      // Try to load current subscription, but don't fail if user not authenticated
      try {
        const subscriptionData = await getCurrentSubscription();
        setCurrentSubscription(subscriptionData);
      } catch (err) {
        console.error("Failed to load current subscription", err);
        console.log('Could not load current subscription (user may not be logged in)');
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = (planId: number) => {
    if (currentSubscription?.plan.id === planId) {
      toast.info('You are already on this plan');
      return;
    }
    
    setSelectedPlanId(planId);
    setShowConfirmDialog(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlanId) return;

    try {
      setSubscribing(selectedPlanId);
      const updatedSubscription = await subscribeToPlan(selectedPlanId);
      setCurrentSubscription(updatedSubscription);
      toast.success('Successfully subscribed to the plan!');
      if (onSubscriptionChange) {
        onSubscriptionChange();
      }
      setShowConfirmDialog(false);
      setSelectedPlanId(null);
    } catch (error) {
      toast.error('Failed to subscribe to plan');
      console.error(error);
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <Sparkles className="w-8 h-8" />;
      case 'advanced':
        return <Zap className="w-8 h-8" />;
      case 'premium':
        return <Crown className="w-8 h-8" />;
      case 'pro':
        return <Infinity className="w-8 h-8" />;
      default:
        return <Sparkles className="w-8 h-8" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'from-blue-500/25';
      case 'advanced':
        return 'from-purple-500/25';
      case 'premium':
        return 'from-pink-500/25';
      case 'pro':
        return 'from-orange-500/25';
      default:
        return 'from-gray-500/25';
    }
  };

  const getPlanTextGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'from-blue-400 to-cyan-300';
      case 'advanced':
        return 'from-purple-400 to-pink-300';
      case 'premium':
        return 'from-pink-400 to-rose-300';
      case 'pro':
        return 'from-orange-400 to-amber-300';
      default:
        return 'from-gray-400 to-gray-300';
    }
  };

  const getPlanIconGlow = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return '[filter:drop-shadow(0_0_8px_rgb(59_130_246))_drop-shadow(0_0_12px_rgb(59_130_246_/_0.5))]';
      case 'advanced':
        return '[filter:drop-shadow(0_0_8px_rgb(168_85_247))_drop-shadow(0_0_12px_rgb(168_85_247_/_0.5))]';
      case 'premium':
        return '[filter:drop-shadow(0_0_8px_rgb(236_72_153))_drop-shadow(0_0_12px_rgb(236_72_153_/_0.5))]';
      case 'pro':
        return '[filter:drop-shadow(0_0_8px_rgb(251_146_60))_drop-shadow(0_0_12px_rgb(251_146_60_/_0.5))]';
      default:
        return '[filter:drop-shadow(0_0_8px_rgb(156_163_175))]';
    }
  };
  /*
  const getButtonColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'advanced':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'premium':
        return 'bg-pink-500 hover:bg-pink-600';
      case 'pro':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  */
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mb-2">
            Choose Your Plan
          </h2>
          <p className="text-lg text-white/70">
            Select the perfect plan for your creative needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = currentSubscription?.plan.id === plan.id || (plan.name === 'Basic' && !currentSubscription);
                const isBasicPlan = plan.name === 'Basic';
                
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                      isCurrentPlan
                        ? 'ring-2 ring-blue-400/50 shadow-2xl shadow-blue-500/20 scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg">
                          CURRENT
                        </div>
                      </div>
                    )}

                    {/* Very Subtle Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${getPlanColor(plan.name)} to-transparent`}></div>

                    {/* Glassmorphism Card */}
                    <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-white/10 h-full flex flex-col shadow-xl">
                      {/* Icon with Glow */}
                      <div className="flex justify-center mb-4">
                        <div className={`text-white ${getPlanIconGlow(plan.name)}`}>
                          {getPlanIcon(plan.name)}
                        </div>
                      </div>

                      {/* Plan Name */}
                      <h3 className={`text-2xl font-bold text-center mb-2 bg-gradient-to-br ${getPlanTextGradient(plan.name)} bg-clip-text text-transparent`}>
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-1">
                          {plan.priceMonthly === 0 ? (
                            <span className="text-4xl font-bold text-white">
                              FREE
                            </span>
                          ) : (
                            <>
                              <span className="text-4xl font-bold text-white">
                                ₱{plan.priceMonthly}
                              </span>
                              <span className="text-white/60 text-sm">
                                /month
                              </span>
                            </>
                          )}
                        </div>
                        {plan.priceMonthly === 0 && (
                          <p className="text-sm text-white/60 mt-1">
                            Forever free
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80">
                            {plan.maxPremiumDownloads === -1
                              ? 'Unlimited premium downloads'
                              : plan.maxPremiumDownloads === 0
                              ? 'Access to standard features'
                              : `${plan.maxPremiumDownloads} premium downloads/month`}
                          </span>
                        </div>
                        
                        {plan.canUploadPremium && (
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white/80">
                              Upload premium content
                            </span>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80">
                            {plan.name === 'Pro' ? 'Priority' : '24/7'} customer support
                          </span>
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      {isBasicPlan ? (
                        <div className="w-full py-3 px-4 rounded-lg font-semibold bg-white/20 text-white/50 cursor-not-allowed backdrop-blur-sm text-center">
                          Current Plan
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscribeClick(plan.id)}
                          disabled={isCurrentPlan || subscribing === plan.id}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm ${
                            isCurrentPlan
                              ? 'bg-white/20 text-white/50 cursor-not-allowed'
                              : subscribing === plan.id
                              ? 'bg-white/20 text-white/50 cursor-wait'
                              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          }`}
                        >
                          {subscribing === plan.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </span>
                          ) : isCurrentPlan ? (
                            'Current Plan'
                          ) : (
                            'Subscribe Now'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && !loading && (
          <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
            <div className="text-center text-sm text-white/80">
              {currentSubscription.status === 'active' && (
                <>
                  Your <span className="font-semibold text-white">{currentSubscription.plan.name}</span> plan is active
                  {currentSubscription.plan.priceMonthly > 0 && (
                    <> until {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</>
                  )}
                  {currentSubscription.premiumDownloadsRemaining !== -1 && (
                    <> • {currentSubscription.premiumDownloadsRemaining} downloads remaining</>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-3">
              Confirm Plan Change
            </h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to change your subscription plan? Your current plan will be replaced immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedPlanId(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubscription}
                disabled={subscribing !== null}
                className="flex-1 px-4 py-2 bg-white/20 border border-white/30 hover:bg-white/30 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                {subscribing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
