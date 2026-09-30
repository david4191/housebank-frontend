import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import AgentHelpSearch from './AgentHelpSearchPage';
import AgentFAQ from './AgentFAQ';

import guideImg1 from '../../../assets/guide-1.png';
import guideImg2 from '../../../assets/guide-2.png';
import guideImg3 from '../../../assets/guide-3.png';

interface GuideItem {
  id: number;
  title: string;
  image: string;
}

/** Agent-side mirror of the customer Help & Support page (see
 * CustomerHelpSupport.tsx). The FAQ (real help_topics via
 * GET /content/help-topics) is public/role-agnostic, so it's reused
 * as-is. The one thing that doesn't carry over is "Get in Touch": that
 * form sends through POST /messages/contact-company, which is
 * customer-only by design (it resolves to the customer's own company
 * relationship) — there's no equivalent "contact platform support"
 * messaging endpoint for staff. Rather than fake a send, this page
 * offers a plain, honest mailto link instead. */
const AgentHelpSupport = () => {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const guides: GuideItem[] = [
    { id: 1, title: 'Getting Started on HouseBank', image: guideImg1 },
    { id: 2, title: 'Listing your first property', image: guideImg2 },
    { id: 3, title: 'Getting paid on a sale or lease', image: guideImg3 },
  ];

  const greetingName = (auth.user?.full_name || '').trim().split(/\s+/)[0] || 'there';

  const scrollToFAQ = () => {
    document.getElementById('help-faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <AgentHelpSearch greetingName={greetingName} value={searchQuery} onChange={setSearchQuery} onSubmit={scrollToFAQ} />

        <div className="flex space-x-8 items-center justify-center mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Guides for getting started</h1>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-center">{guide.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AgentFAQ searchQuery={searchQuery} />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start w-full max-w-5xl mx-auto mt-12">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 w-full md:w-1/2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
            <p className="text-sm text-gray-500 mb-6">
              For account, listing, or payout issues our team can't resolve from the FAQ above, email HouseBank
              Support directly and we'll get back to you.
            </p>
            <a
              href={`mailto:Support@housebank.com?subject=${encodeURIComponent('Realtor support request')}&body=${encodeURIComponent(
                `— ${auth.user?.full_name || 'Realtor'} (${auth.user?.email || ''})`
              )}`}
              className="inline-flex items-center space-x-2 bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
          </div>

          <div className="flex flex-col space-y-8 w-full md:w-1/2 items-start">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Recommended for you</h2>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">List a new property</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Add a property to your listings — it goes live for customers to view once an admin approves it.
                </p>
                <a
                  href="/agent/add-property"
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group w-fit"
                >
                  <span className="text-gray-700 font-medium">Add Property</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full bg-white py-6 mt-12 rounded-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-2 sm:px-6">
            <div className="block px-2">
              <h1 className="text-xl sm:text-2xl font-bold mb-3">General Inquiries/Support</h1>
              <a href="mailto:Support@housebank.com" className="text-blue-500 font-semibold hover:underline">
                Support@housebank.com
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AgentHelpSupport;
