import { ArrowRight } from 'lucide-react';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_HEADER = { eyebrow: 'Services we Provide', title: 'What We Do For You' };

const DEFAULT_SERVICES = [
  {
    id: 1, title: 'Property Management',
    description: 'We handle every aspect of managing your property so you can enjoy the benefits without the stress.',
    image_path: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80',
    extra: {
      layout: 'image-left',
      bullets: ['Tenant screening, placement, and support.', 'Rent collection and income disbursement.', 'Maintenance, repairs, and regular property inspections.', 'Legal compliance and documentation.'],
      what_you_get: 'Peace of mind knowing your property is in expert hands while maximizing returns.',
    },
  },
  {
    id: 2, title: 'Property Valuation',
    description: 'Understand the true value of your property with our accurate and reliable valuation services.',
    image_path: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80',
    extra: {
      layout: 'content-left',
      bullets: ['Market analysis and data-driven insights.', 'Expert assessment of residential, commercial, and land properties.', 'Comprehensive reports for sales, purchases, or investment decisions.'],
      what_you_get: 'Confidence in making informed real estate decisions backed by expert evaluations.',
    },
  },
  {
    id: 3, title: 'Property Exchange',
    description: 'Looking to upgrade, downsize, or diversify your portfolio? Our property exchange service makes transitions easy.',
    image_path: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    extra: {
      layout: 'image-left',
      bullets: ['Seamless swapping of properties to suit your evolving needs.', 'Wide network of listings for residential, commercial, and investment properties.', 'Transparent and efficient processes to match you with the perfect exchange.'],
      what_you_get: 'Flexibility to adapt your property portfolio without the hassle of traditional sales.',
    },
  },
  {
    id: 4, title: 'Investment Portfolio',
    description: 'Grow your wealth with tailored real estate investment strategies.',
    image_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    extra: {
      layout: 'content-left',
      bullets: ['Portfolio analysis and optimization.', 'Access to high-yield investment opportunities.', 'Expert guidance on market trends and forecasts.', 'Strategic advice for diversifying and maximizing returns.'],
      what_you_get: 'A lucrative and secure investment portfolio aligned with your financial goals.',
    },
  },
];

/**
 * Services page "What We Do For You" section. Used to be 100% hardcoded
 * copy (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (section "services-detail"), falling back to the
 * original copy.
 */
const ServicesDetailPage = () => {
  const { data } = useGetPageContentQuery('services');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'services-detail' && i.extra?.kind === 'header');
  const headerEyebrow = header?.extra?.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const headerTitle = header?.title ?? DEFAULT_HEADER.title;

  const servicesRaw = items.filter((i: any) => i.section === 'services-detail' && i.extra?.kind !== 'header');
  const services = servicesRaw.length > 0 ? servicesRaw : DEFAULT_SERVICES;

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-30">
        <div className="text-center mb-20">
          <h3 className="text-gray-600 text-lg mb-4">{headerEyebrow}</h3>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{headerTitle}</h1>
        </div>

        {services.map((service: any, index: number) => {
          const bullets: string[] = Array.isArray(service.extra?.bullets) ? service.extra.bullets : [];
          const whatYouGet = service.extra?.what_you_get;
          const imageLeft = (service.extra?.layout ?? (index % 2 === 0 ? 'image-left' : 'content-left')) === 'image-left';
          const image = imageUrl(service.image_path);

          return (
            <div key={service.id ?? index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index < services.length - 1 ? 'mb-24' : ''}`}>
              {/* Image */}
              <div className={imageLeft ? 'order-2 lg:order-1' : ''}>
                <div className="w-full h-80 lg:h-96 rounded-2xl overflow-hidden">
                  {image && (
                    <img
                      src={image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`${imageLeft ? 'order-1 lg:order-2 bg-purple-50' : 'bg-gray-50'} rounded-2xl p-8 lg:p-12`}>
                <h2 className="text-1xl lg:text-3xl font-bold text-gray-900 mb-6">{service.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {bullets.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {bullets.map((bullet, bulletIndex) => (
                      <li className="flex items-start" key={bulletIndex}>
                        <span className="text-green-600 mr-3">•</span>
                        <span className="text-gray-600">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {whatYouGet && (
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    <strong>What You Get:</strong> {whatYouGet}
                  </p>
                )}

                <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default ServicesDetailPage;
