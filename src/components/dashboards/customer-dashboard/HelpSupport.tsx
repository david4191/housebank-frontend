import { useState } from 'react';
import {
  ArrowRight,
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle2
} from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import { useContactCompanyMutation, useGetMyContactsQuery } from '../../../redux/housebank.ts';

// Import guide images - replace with your actual image imports
import guideImg1 from '../../../assets/guide-1.png';
import guideImg2 from '../../../assets/guide-2.png';
import guideImg3 from '../../../assets/guide-3.png';
import CustomerHelpSearch from './CustomerHelpSearchPage';
import CustomerFAQz from './CustomerFAQ';

interface GuideItem {
  id: number;
  title: string;
  image: string;
}

const CustomerHelpSupport = () => {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactCompany, { isLoading: sending }] = useContactCompanyMutation();
  const [sendResult, setSendResult] = useState<
    { ok: true; companyName: string } | { ok: false; message: string } | null
  >(null);

  // Who "Get in Touch" will actually message — resolved the same way
  // the backend resolves it (Contact.forCustomer), so the form can be
  // honest up front about whether there's anyone real to send this to,
  // instead of only finding out after the customer types a message.
  const { data: contacts, isLoading: contactsLoading } = useGetMyContactsQuery();
  const companyContact = contacts?.find((c: any) => c.contact_type === 'company');

  const guides: GuideItem[] = [
    { id: 1, title: "Getting Started on HouseBank", image: guideImg1 },
    { id: 2, title: "Finding the right place for you", image: guideImg2 },
    { id: 3, title: "Paying for a property", image: guideImg3 }
  ];

  const greetingName = (auth.user?.full_name || '').trim().split(/\s+/)[0] || 'there';

  const scrollToFAQ = () => {
    document.getElementById('help-faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent('HouseBank support request');
    const body = encodeURIComponent(
      `${contactMessage}\n\n— ${auth.user?.full_name || 'Customer'} (${auth.user?.email || ''})`
    );
    window.location.href = `mailto:Support@housebank.com?subject=${subject}&body=${body}`;
  };

  // Sends the message for real through the Messages system, to the
  // customer's actual company relationship — not a fake "sent" state.
  // An automated acknowledgment lands in that same conversation right
  // away (see hb-backend's POST /messages/contact-company); if there's
  // no company relationship yet, or the send fails for any reason, the
  // mailto fallback stays available rather than the form being a dead end.
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim() || sending) return;
    setSendResult(null);
    const result = await contactCompany({ message: contactMessage.trim() });
    if ('data' in result && result.data) {
      setSendResult({ ok: true, companyName: result.data.company_name });
      setContactMessage('');
      return;
    }
    const err: any = 'error' in result ? result.error : null;
    setSendResult({
      ok: false,
      message: err?.errors?.message?.[0] || err?.message || "Couldn't send your message right now.",
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* Search */}
        <CustomerHelpSearch
          greetingName={greetingName}
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={scrollToFAQ}
        />

        {/* Guides Section */}
        <div className="flex space-x-8 items-center justify-center mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Guides for getting started
          </h1>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-center">
                    {guide.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section — real data from help_topics via useGetHelpTopicsQuery,
            filtered live by the search box above */}
        <CustomerFAQz searchQuery={searchQuery} />

        {/* Contact + Recommended Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-5xl mx-auto mt-12">

          {/* Contact Form */}
          <div className="bg-gray border border-gray-100 rounded-2xl p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>

            {!contactsLoading && companyContact && (
              <p className="text-sm text-gray-500 mb-6">
                This goes straight to <span className="font-medium text-gray-700">{companyContact.name}</span> —
                you'll get an instant confirmation, and their real reply lands in Messages.
              </p>
            )}
            {!contactsLoading && !companyContact && (
              <p className="text-sm text-gray-500 mb-6">
                You don't have an active company relationship yet — book a property viewing first, or
                email us directly below.
              </p>
            )}

            {sendResult?.ok ? (
              <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Sent to {sendResult.companyName}. Check <span className="font-medium">Messages</span> for
                  their reply — you already got an instant confirmation there.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Your Message
                  </label>
                  <textarea
                    placeholder="What can we help with?"
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                {sendResult && !sendResult.ok && (
                  <p className="text-sm text-red-600">{sendResult.message}</p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={sending || !companyContact || !contactMessage.trim()}
                    className="bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                  <button
                    type="button"
                    onClick={mailtoFallback}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Or email us instead
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Recommended Section */}
          <div className="flex flex-col space-y-8 w-full md:w-1/2 items-start">

            <div className="mb-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Recommended for you
              </h2>
            </div>

            <div className="gap-6">

              {/* Identity Verification Card */}
              <div className="bg-gray border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow mb-5">
                <div className="flex items-center space-x-2 mb-6">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500 uppercase tracking-wide">
                    ACTION REQUIRED
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Your identity is not fully verified
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Identity verification helps us know that you are really you. It is
                    one of the ways we keep HouseBank users secure.
                  </p>
                </div>

                <a
                  href="mailto:Support@housebank.com?subject=Identity%20verification"
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group w-fit"
                >
                  <span className="text-gray-700 font-medium">Contact support to verify</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Explore Neighborhoods Card */}
              <div className="bg-gray border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Explore
                  </h3>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    Great Neighborhoods
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We connect you directly with the person who knows the most
                    about the property for sale — the listing realtor.
                  </p>
                </div>

                <a
                  href="/customer/properties"
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group w-fit"
                >
                  <span className="text-gray-700 font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>
          </div>
        </div>

                 <footer className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div className='block px-2'>
        <h1 className='text-2xl font-bold mb-3'>General Inquries/Support</h1>
        {/* Support Email */}
        <a
          href="mailto:Support@housebank.com"
          className="text-blue-500 font-semibold hover:underline"
        >
          Support@housebank.com
        </a>
            </div>

            <div className='block px-4'>
             <h1 className='text-2xl font-bold mb-3'>Contact us with</h1>
        {/* Social Icons — no social accounts are configured for HouseBank
            yet, so these stay visual-only rather than link to guessed
            handles that might not exist or belong to someone else. */}
        <div className="flex space-x-6 text-blue-300 text-2xl cursor-not-allowed" title="Coming soon">

          <Instagram />
          <Facebook />
          <Linkedin />
        </div>
        </div>

      </div>
    </footer>

      </div>
    </div>
  );
};

export default CustomerHelpSupport;
