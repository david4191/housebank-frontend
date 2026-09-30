import icons from '../assets/realtor/icons.png';
import arrowTop from '../assets/arrow-top.png';
import { useNavigate } from 'react-router-dom';
import { useGetPageContentQuery } from '../redux/housebank.ts';
import useAuth from '../hooks/useAuth.tsx';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_HEADER = {
  eyebrow: 'Our Features',
  title: 'What Makes HouseBank Stand Out',
  description:
    "Effortlessly buy, sell, and invest in real estate with HouseBank. Whether you're a realtor, developer, or investor, we provide the tools and connections you need to close deals faster and grow your business.",
  bottomCtaTitle: 'Ready to take your real estate business to the next level',
  bottomCtaText: 'Start listing',
};

const DEFAULT_FEATURES = [
  { id: 1, title: 'Seamless Property Listings', description: 'Easily upload, manage, and showcase your properties to a wide audience with our intuitive listing platform.' },
  { id: 2, title: 'Verified Leads & High-Quality Buyers', description: 'Connect with serious buyers and investors, ensuring faster and more secure transactions.' },
  { id: 3, title: 'Secure & Transparent Transactions', description: 'Conduct business with confidence using our secure payment and verification system.' },
  { id: 4, title: 'Dedicated Support & Marketing Tools', description: 'Get expert assistance, promotional tools, and marketing strategies to boost your property sales.' },
  { id: 5, title: 'AI-Powered Matching', description: 'Our smart recommendation system connects you with the right buyers and properties based on preferences and market demand.' },
  { id: 6, title: 'Real-Time Market Insights', description: 'Stay ahead with in-depth property analytics and trends to make informed decisions.' },
];

/**
 * Realtor landing page features grid. Used to be 100% hardcoded copy
 * (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (section "realtor-features"), falling back to the
 * original copy.
 */
const FeaturesSection = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isRealtor = auth.user?.role === 'agent';
  const handleCta = () => navigate(isRealtor ? '/agent/add-property' : '/signup-buyer');

  const { data } = useGetPageContentQuery('realtor');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'realtor-features' && i.extra?.kind === 'header');
  const headerExtra = header?.extra || {};
  const eyebrow = headerExtra.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const title = header?.title ?? DEFAULT_HEADER.title;
  const description = header?.description ?? DEFAULT_HEADER.description;
  const bottomCtaTitle = headerExtra.bottom_cta_title ?? DEFAULT_HEADER.bottomCtaTitle;
  const bottomCtaText = headerExtra.bottom_cta_text ?? DEFAULT_HEADER.bottomCtaText;

  const featuresRaw = items.filter((i: any) => i.section === 'realtor-features' && i.extra?.kind !== 'header');
  const features = featuresRaw.length > 0 ? featuresRaw : DEFAULT_FEATURES;

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-gray-600 text-sm mb-4">{eyebrow}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature: any, index: number) => (
            <div
              key={feature.id ?? index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
            >
              {/* Icon */}
              <div className="mb-6">
                <img src={imageUrl(feature.image_path) || icons} alt="Feature Icon" className="w-10 h-10 shadow-sm rounded-full" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            {bottomCtaTitle}
          </h3>
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

export default FeaturesSection;
