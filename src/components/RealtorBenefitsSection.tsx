import arrowTop from '../assets/arrow-top.png';
import keyHandoverImage from '../assets/realtor/key-handover.png';
import { useNavigate } from 'react-router-dom';
import { useGetPageContentQuery } from '../redux/housebank.ts';
import useAuth from '../hooks/useAuth.tsx';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_HEADER = {
  title: 'Benefits for Realtor & Developers',
  subtitle: 'Grow Your Real Estate Business with HouseBank',
  titleHighlight: 'Realtor &',
  bottomCtaTitle: 'Join HouseBank today and take your real estate career to new heights!',
  bottomCtaText: 'Start listing',
};

const DEFAULT_DEVELOPER_BENEFITS = [
  { id: 1, title: 'Maximize Your Sales', description: 'Reach a targeted audience and attract more buyers.' },
  { id: 2, title: 'Data-Driven Marketing', description: 'Use real-time insights to improve your sales strategy.' },
  { id: 3, title: 'High-Quality Exposure', description: 'Showcase your projects with stunning visuals and virtual tours.' },
  { id: 4, title: 'Direct Investor Connections', description: 'Connect with serious investors ready to fund your projects.' },
  { id: 5, title: 'End-to-End Support', description: 'From listing to closing, we streamline the entire process.' },
];

const DEFAULT_REALTOR_BENEFITS = [
  { id: 6, title: 'Expand Your Reach', description: 'Get your listings in front of serious buyers and investors.' },
  { id: 7, title: 'Lead Management', description: 'Access verified leads and manage inquiries with ease.' },
  { id: 8, title: 'Fast & Secure Transactions', description: 'Close deals efficiently with our secure platform.' },
  { id: 9, title: 'AI-Powered Property Matching', description: 'Get matched with buyers looking for properties like yours.' },
  { id: 10, title: 'Professional Branding', description: 'Enhance your credibility with a customized realtor profile.' },
];

function BenefitItem({ item, index }: { item: any; index: number }) {
  return (
    <div className="flex items-start space-x-3 mb-6">
      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-bold">{index + 1}</span>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}

/**
 * Realtor landing page benefits section. Used to be 100% hardcoded copy
 * (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (section "realtor-benefits"; rows tagged
 * extra.group === "developer" | "realtor"), falling back to the
 * original copy.
 */
const BenefitsSection = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isRealtor = auth.user?.role === 'agent';
  const handleCta = () => navigate(isRealtor ? '/agent/add-property' : '/signup-buyer');

  const { data } = useGetPageContentQuery('realtor');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'realtor-benefits' && i.extra?.kind === 'header');
  const headerExtra = header?.extra || {};
  const title = header?.title ?? DEFAULT_HEADER.title;
  const subtitle = header?.subtitle ?? DEFAULT_HEADER.subtitle;
  const titleHighlight = headerExtra.title_highlight ?? DEFAULT_HEADER.titleHighlight;
  const bottomCtaTitle = headerExtra.bottom_cta_title ?? DEFAULT_HEADER.bottomCtaTitle;
  const bottomCtaText = headerExtra.bottom_cta_text ?? DEFAULT_HEADER.bottomCtaText;
  const image = imageUrl(header?.image_path) || keyHandoverImage;

  const rows = items.filter((i: any) => i.section === 'realtor-benefits' && i.extra?.kind !== 'header');
  const developerBenefits = rows.length > 0 ? rows.filter((i: any) => i.extra?.group === 'developer') : DEFAULT_DEVELOPER_BENEFITS;
  const realtorBenefits = rows.length > 0 ? rows.filter((i: any) => i.extra?.group === 'realtor') : DEFAULT_REALTOR_BENEFITS;

  // Preserve the original two-tone heading ("Benefits for [Realtor &]
  // Developers") without hardcoding the whole title -- if an admin edits
  // the title to no longer contain the highlighted phrase, it just
  // renders as plain text instead of crashing.
  const highlightIndex = titleHighlight ? title.indexOf(titleHighlight) : -1;
  const titleNodes = highlightIndex >= 0
    ? [
        title.slice(0, highlightIndex),
        <span className="text-green-600" key="highlight">{titleHighlight}</span>,
        title.slice(highlightIndex + titleHighlight.length),
      ]
    : [title];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Column */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-4">
                {titleNodes}
              </h2>
              <p className="text-gray-600 text-lg">
                {subtitle}
              </p>
            </div>

            {/* Image */}
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt="Key handover between realtor and clients"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* Call to Action */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {bottomCtaTitle}
              </h3>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">

            {/* For Property Developers Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Property Developers
              </h3>
              <div>
                {developerBenefits.map((benefit: any, index: number) => (
                  <BenefitItem key={benefit.id ?? index} item={benefit} index={index} />
                ))}
              </div>
            </div>

            {/* For Real Estate Realtor Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Real Estate Realtor
              </h3>
              <div>
                {realtorBenefits.map((benefit: any, index: number) => (
                  <BenefitItem key={benefit.id ?? index} item={benefit} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <button onClick={handleCta} className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-colors">
            <span>{bottomCtaText}</span>
            <img
              src={arrowTop}
              alt="arrow icon"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
