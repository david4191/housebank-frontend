import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import phoneBackground from '../assets/realtor/phone-background.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

const DEFAULT_HEADER = { eyebrow: 'Why Join Us', title: 'HouseBank' };

const DEFAULT_STEPS = [
  { id: 1, title: 'Easy sign up', description: "Start with a free consultation to assess your needs. You'll provide information about your home and what you would like to get out of your battery storage. You'll work with an experienced design consultant to evaluate the best solution for you." },
  { id: 2, title: 'Connect with customers easily', description: 'Our platform makes it simple to connect with potential customers in your area. Get matched with qualified leads and build lasting relationships.' },
  { id: 3, title: 'Maximum your growth with Housebank', description: 'Leverage our tools and resources to expand your business. Access market insights, professional development, and growth opportunities.' },
  { id: 4, title: 'Withdraw your Earnings fast', description: "Get paid quickly and securely. Our streamlined payment system ensures you receive your earnings without delay." },
];

/**
 * Realtor landing page "Why Join Us" accordion. Used to be 100%
 * hardcoded copy (Joan, Sep 2026 -- "whole main website in one push").
 * Reads from page_content_items (section "realtor-why-join-steps"),
 * falling back to the original copy.
 *
 * The invitation-only notice below the accordion stays hardcoded on
 * purpose -- it isn't marketing copy, it's a statement of actual
 * platform policy/routing (Joan, Sep 2026: "remove the realtor sign up
 * page, let it be strictly on invitation"), tied to the real /signup-seller
 * link and the email-invite flow in pages/RealtorOnboarding.tsx.
 */
const WhyJoinUs = () => {
  const [expandedStep, setExpandedStep] = useState<number | string>(1);

  const { data } = useGetPageContentQuery('realtor');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'realtor-why-join-steps' && i.extra?.kind === 'header');
  const eyebrow = header?.extra?.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const title = header?.title ?? DEFAULT_HEADER.title;

  const stepsRaw = items.filter((i: any) => i.section === 'realtor-why-join-steps' && i.extra?.kind !== 'header');
  const steps = stepsRaw.length > 0 ? stepsRaw : DEFAULT_STEPS;

  const toggleStep = (stepId: number | string) => {
    setExpandedStep(expandedStep === stepId ? 0 : stepId);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-sm mb-2">{eyebrow}</p>
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Steps */}
          <div className="space-y-4">
            {steps.map((step: any, index: number) => {
              const stepId = step.id ?? index + 1;
              return (
                <div key={stepId} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleStep(stepId)}
                    className="w-full flex items-center justify-between text-left py-4 focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <Plus
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedStep === stepId ? 'rotate-45' : ''
                      }`}
                    />
                  </button>

                  {expandedStep === stepId && (
                    <div className="mt-4 ml-12 pr-8">
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side - Phone visual */}
          <div className="relative">
            <div className="relative h-[400px] w-auto bg-gray-900 rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 ">
                <img
                  src={phoneBackground}
                  alt="Phone background"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Realtors join HouseBank through a company invitation, not open
            self-signup (Joan, Sep 2026 -- "remove the realtor sign up page,
            let it be strictly on invitation"). There is no generic
            "already invited? click here" form anymore either -- an actual
            invite now comes with a real, one-time onboarding link sent by
            email (see pages/RealtorOnboarding.tsx), so this page just
            points people at their inbox instead of a form that would let
            anyone type in any email and try their luck. */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-600 max-w-md mx-auto">
            Realtors join HouseBank through their company's invitation — a company adds your email to
            their roster, and you'll get an email with a link to complete your own registration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup-seller"
              className="inline-block border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Register your company instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyJoinUs;
