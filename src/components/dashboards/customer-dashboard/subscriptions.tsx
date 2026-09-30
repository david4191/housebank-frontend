import { useState } from 'react';
import { Check } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  isPopular?: boolean;
  isSelected?: boolean;
}

interface PlanFeature {
  text: string;
  included: boolean;
}

const CustomerSubscriptionPlansPage = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedPlan, setSelectedPlan] = useState('6months');
  const [autoSubscribe, setAutoSubscribe] = useState(true);

  // Navigation tabs
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notification', label: 'Notification' },
    { id: 'payment', label: 'Payment' }
  ];

  // Sub navigation for Payment tab
  const paymentTabs = [
    { id: 'add-details', label: 'Add card Details' },
    { id: 'card-settings', label: 'Card Settings' },
    { id: 'manage-dispute', label: 'Manage Dispute' },
    { id: 'transaction-history', label: 'Transaction History' },
    { id: 'get-pro', label: 'Get Pro' }
  ];

  // Pricing plans data
  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      duration: 'Base plan',
      price: '',
      isSelected: selectedPlan === 'free'
    },
    {
      id: '1month',
      name: '1',
      duration: 'month',
      price: '₦6,000/month',
      isSelected: selectedPlan === '1month'
    },
    {
      id: '6months',
      name: '6',
      duration: 'months',
      price: '₦5,000/month',
      isPopular: true,
      isSelected: selectedPlan === '6months'
    },
    {
      id: '12months',
      name: '12',
      duration: 'months',
      price: '₦4,000/month',
      isSelected: selectedPlan === '12months'
    }
  ];

  // Plan features
  const getPlanFeatures = (planId: string): PlanFeature[] => {
    switch (planId) {
      case 'free':
        return [
          { text: 'Up to 50 properties per month', included: true },
          { text: 'Dedicated customer support', included: true },
          { text: 'Get access to our exclusive deals', included: true }
        ];
      case '1month':
        return [
          { text: 'Up to 80 properties per month', included: true },
          { text: 'Dedicated customer support', included: true },
          { text: 'Get access to our exclusive deals', included: true }
        ];
      case '6months':
        return [
          { text: 'Up to 5 properties per week', included: true },
          { text: 'Dedicated customer support', included: true },
          { text: 'Get access to our exclusive deals', included: true }
        ];
      case '12months':
        return [
          { text: '3 Property per month', included: true }
        ];
      default:
        return [];
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSave = () => {
    console.log('Selected plan:', selectedPlan);
    console.log('Auto subscribe:', autoSubscribe);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log('Cancelled');
    // Handle cancel logic here
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Main Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Payment Tab Content */}
        {activeTab === 'payment' && (
          <>
            {/* Payment Sub Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {paymentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-2 px-1 border-b-2 text-sm ${
                        tab.id === 'get-pro'
                          ? 'border-green-500 text-green-600 font-medium'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Popular Badge */}
              {selectedPlan === '6months' && (
                <div className="flex justify-center mb-6">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Save 20%
                  </span>
                </div>
              )}

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      plan.isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Save 20%
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{plan.duration}</p>
                      {plan.price && (
                        <p className="text-sm text-gray-600">{plan.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Features */}
              <div className="mb-8">
                <div className="space-y-3">
                  {getPlanFeatures(selectedPlan).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Subscribe Toggle */}
              <div className="flex items-center justify-center mb-6">
                <span className="text-gray-700 mr-3">Auto Subscribe</span>
                <button
                  onClick={() => setAutoSubscribe(!autoSubscribe)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    autoSubscribe ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSubscribe ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Other Tab Placeholders */}
        {activeTab !== 'payment' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Content
              </h3>
              <p>This section is under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSubscriptionPlansPage;