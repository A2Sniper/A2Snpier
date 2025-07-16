'use client';

import { Navigation } from '@/components/ui/navigation';
import { SubscriptionPlans } from '@/components/ui/subscription-plans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="md:pl-64">
        <SubscriptionPlans />
      </div>
    </div>
  );
}