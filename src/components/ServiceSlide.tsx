import { ArrowRight } from 'lucide-react';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_BACKGROUND =
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const DEFAULTS = {
  badge: 'our Service',
  title: 'Your Trusted Partner in Real Estate',
  description:
    "At House Bank Real Estate, we are committed to providing you with exceptional real estate solutions tailored to meet your unique needs. Whether you're buying your dream home, selling a property, or investing in real estate, we've got you covered.",
  ctaText: 'Explore our Offer',
  stats: [
    { number: '20k', label: 'Happy customers' },
    { number: '10k +', label: 'Client reviews' },
    { number: '4.5', label: 'Positive Rating' },
  ],
};

/**
 * Services page hero. Used to be 100% hardcoded copy (Joan, Sep 2026 --
 * "whole main website in one push"). Reads from page_content_items
 * (section "services-hero"), falling back to the original copy.
 */
const ServicesSlide = () => {
  const { data } = useGetPageContentQuery('services');
  const item = (data || []).find((i: any) => i.section === 'services-hero');
  const extra = item?.extra || {};

  const badge = extra.badge ?? DEFAULTS.badge;
  const title = item?.title ?? DEFAULTS.title;
  const description = item?.description ?? DEFAULTS.description;
  const ctaText = extra.cta_text ?? DEFAULTS.ctaText;
  const stats = Array.isArray(extra.stats) && extra.stats.length > 0 ? extra.stats : DEFAULTS.stats;
  const background = imageUrl(item?.image_path) || DEFAULT_BACKGROUND;

  return (
    <div className="bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen bg-gradient-to-r from-black/60 to-black/40 flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={background}
            alt="Professional couple in modern home"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            {/* Service Badge */}
            <div className="inline-flex items-center px-4 py-2  rounded-full  mb-8">
              <span className="text-green-400 text-sm font-medium">{badge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
              {description}
            </p>

            {/* CTA Button */}
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 group">
              <span>{ctaText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="absolute bottom-[-160px] sm:bottom-[-64px] left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl mx-auto px-4">
          <div className="backdrop-blur-sm rounded-2xl p-4 sm:p-8" style={{ backgroundColor: '#F7F7F8' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center">
              {stats.map((stat: any, index: number) => (
                <div className="space-y-1 sm:space-y-2" key={index}>
                  <h3 className="text-2xl sm:text-4xl font-bold text-gray-900">{stat.number}</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSlide;
