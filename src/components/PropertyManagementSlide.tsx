import { ArrowRight } from 'lucide-react';
import manage from '../assets/manage.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULTS = {
  title: 'Property Management',
  description:
    "At House Bank Real Estate, we specialize in delivering end-to-end property management solutions tailored to meet your unique needs. Whether you're a homeowner, investor, or landlord, our team ensures your property is well-maintained, your tenants are satisfied, and your investment generates the best possible returns.",
  ctaText: "Let's Manage your property",
};

/**
 * Property Management landing page hero. Used to be 100% hardcoded
 * copy (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (section "pm-hero"), falling back to the original
 * copy.
 */
const PropertyManagementContent = () => {
  const { data } = useGetPageContentQuery('property-management');
  const item = (data || []).find((i: any) => i.section === 'pm-hero');
  const extra = item?.extra || {};

  const title = item?.title ?? DEFAULTS.title;
  const description = item?.description ?? DEFAULTS.description;
  const ctaText = extra.cta_text ?? DEFAULTS.ctaText;
  const background = imageUrl(item?.image_path) || manage;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="h-96 bg-gradient-to-r from-gray-900/70 to-gray-900/30 relative overflow-hidden">
          <img
            src={background}
            alt="Manage"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content Card */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              {description}
            </p>

            <button className="inline-flex items-center bg-transparent border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200 group">
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to account for the floating card */}
      <div className="h-48"></div>
    </div>
  );
};

export default PropertyManagementContent;
