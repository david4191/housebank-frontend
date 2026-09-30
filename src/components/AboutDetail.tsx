import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import handshakeImage from '../assets/about/handshake-meeting.png';
import close from '../assets/close.png';
import star from '../assets/about/star.png';
import arrowTop from '../assets/about/arrowTop.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_TOP_FEATURES = [
  { id: 1, title: 'Explore', subtitle: 'Great Neighborhoods', description: 'We connect with directly to the person that knows the most about property for sale, the listing realtor.', extra: { style: 'white', cta_text: 'Explore', cta_link: '/explore' } },
  { id: 2, title: 'Find Highly', subtitle: 'Rated Best Property', description: 'We connect with directly to the person that knows the most about property for sale, the listing realtor.', extra: { style: 'purple', cta_text: 'Explore', cta_link: '/explore' } },
  { id: 3, title: 'Discover', subtitle: 'Quality Buildings', description: 'We connect with directly to the person that knows the most about property for sale, the listing realtor.', extra: { style: 'white', cta_text: 'Explore', cta_link: '/explore' } },
];

const DEFAULT_WHO_WE_ARE = {
  eyebrow: 'Who We Are',
  title: 'We are Best in Property Management Trusted by 10 Million Buyers',
  description:
    'Founded on a passion for connecting people with the right properties, HouseBank Real Estate has grown to become a trusted name in the real estate industry. Our team of experienced realtors combines market insight with personalized service, ensuring you receive the guidance you need at every step of your property journey.',
};

const DEFAULT_WHY_CHOOSE_US = [
  { title: 'Customer-Centric Approach:', description: 'Your satisfaction is our priority. We listen, understand, and deliver solutions tailored to your needs.' },
  { title: 'Transparency and Integrity:', description: 'Honesty and fairness guide everything we do.' },
  { title: 'Market Expertise:', description: 'With a deep understanding of the real estate market, we provide insights to help you make confident decisions.' },
  { title: 'End-to-End Support:', description: 'From property search to closing the deal, we are with you every step of the way.' },
];

const DEFAULT_BOTTOM_FEATURES = [
  { id: 1, title: 'Our Mission', description: 'To connect people with properties that inspire them and meet their needs while ensuring a seamless and rewarding process for all our clients.', additionalText: "At HouseBank Real Estate, we don't just sell properties—we help you build a foundation for your future. Let's find your dream home today!" },
  { id: 2, title: 'Our Vision', description: 'To be the trusted leader in real estate, transforming lives by providing exceptional properties and services that inspire dreams, build communities, and create lasting value for generations to come.' },
  { id: 3, title: 'Our Aim', description: 'At HouseBank Real Estate, our goal is to make property ownership and investment seamless, trustworthy, and rewarding. We strive to connect individuals and businesses with the perfect spaces while fostering lasting relationships built on transparency, expertise, and care. Your dream property is our mission.' },
];

/**
 * About page body. Used to be 100% hardcoded copy (Joan, Sep 2026 --
 * "whole main website in one push"). Now reads from page_content_items
 * (sections "about-top-features", "about-who-we-are",
 * "about-why-choose-us", "about-bottom-features"), falling back to the
 * exact original copy whenever a section hasn't loaded yet or is empty.
 */
const AboutCompany = () => {
  const { data } = useGetPageContentQuery('about');
  const items = data || [];

  const topFeaturesRaw = items.filter((i: any) => i.section === 'about-top-features');
  const topFeatures = topFeaturesRaw.length > 0 ? topFeaturesRaw : DEFAULT_TOP_FEATURES;

  const whoWeAreItem = items.find((i: any) => i.section === 'about-who-we-are');
  const whoWeAre = {
    eyebrow: whoWeAreItem?.extra?.eyebrow ?? DEFAULT_WHO_WE_ARE.eyebrow,
    title: whoWeAreItem?.title ?? DEFAULT_WHO_WE_ARE.title,
    description: whoWeAreItem?.description ?? DEFAULT_WHO_WE_ARE.description,
  };

  const whyChooseUsHeader = items.find((i: any) => i.section === 'about-why-choose-us' && i.extra?.kind === 'header');
  const whyChooseUsPointsRaw = items.filter((i: any) => i.section === 'about-why-choose-us' && i.extra?.kind !== 'header');
  const whyChooseUsPoints = whyChooseUsPointsRaw.length > 0 ? whyChooseUsPointsRaw : DEFAULT_WHY_CHOOSE_US;
  const whyChooseUsTitle = whyChooseUsHeader?.title ?? 'Why Choose Us?';

  const bottomFeaturesRaw = items.filter((i: any) => i.section === 'about-bottom-features');
  const bottomFeatures = bottomFeaturesRaw.length > 0 ? bottomFeaturesRaw : DEFAULT_BOTTOM_FEATURES;

  // The "Close" icon on each card used to render with no click handler at
  // all -- it looked interactive (cursor-pointer + an X icon) but did
  // nothing. There's no backend concept behind these cards to fetch or
  // dismiss server-side, so this gives it real, working local behavior:
  // clicking it actually dismisses that card. This is separate from the
  // DB-driven content above -- dismissal is a per-visit UI action, not
  // something the admin manages.
  const [dismissedFeatureIds, setDismissedFeatureIds] = useState<Array<number | string>>([]);
  const visibleTopFeatures = topFeatures.filter((feature: any) => !dismissedFeatureIds.includes(feature.id));

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {visibleTopFeatures.map((feature: any) => {
            const style = feature.extra?.style === 'purple' ? 'purple' : 'white';
            const bgClass = style === 'purple' ? 'bg-purple-100' : 'bg-white';
            const borderClass = style === 'purple' ? 'border-purple-200' : 'border-gray-200';
            const ctaText = feature.extra?.cta_text ?? 'Explore';
            const ctaLink = feature.extra?.cta_link ?? '/explore';
            return (
              <div key={feature.id} className={`${bgClass} ${borderClass} border rounded-2xl p-6 shadow-sm relative`}>
                {/* Close Icon */}
                <div className="p-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setDismissedFeatureIds((prev) => [...prev, feature.id])}
                    aria-label="Dismiss this card"
                  >
                    <img src={close} alt="Close" className="w-5 h-5 cursor-pointer relative right-2" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}<br />{feature.subtitle}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="w-full flex justify-end">
                  <Link
                    to={ctaLink}
                    className="flex items-center space-x-2 p-1 text-gray-500 hover:text-gray-700 font-medium rounded-xl text-md border border-green-700 border-opacity-30"
                  >
                    <span className='text-green-800 text-sm hover:text-green-800 relative left-1'>{ctaText}</span>
                    <img src={arrowTop} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Who We Are Section */}
        <div className="mb-16">
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-600">{whoWeAre.eyebrow}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {whoWeAre.title}
              </h2>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">
                {whoWeAre.description}
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            {/* Left Content */}
            <div className="w-full lg:w-[440px] text-white p-8 rounded-2xl" style={{ backgroundColor: '#312630' }}>
              <h3 className="text-2xl font-bold mb-6">{whyChooseUsTitle}</h3>
              <div className="space-y-2">
                {whyChooseUsPoints.map((point: any, index: number) => (
                  <div key={point.id ?? index}>
                    <span className="">{point.title}</span>
                    <span className="ml-1">{point.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:flex-1 h-64 lg:h-auto rounded-2xl overflow-hidden">
              <img
                src={handshakeImage}
                alt="Business handshake meeting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bottomFeatures.map((feature: any, index: number) => {
            const additionalText = feature.extra?.additionalText ?? feature.additionalText;
            return (
              <div key={feature.id ?? index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  <img src={imageUrl(feature.image_path) || star} alt="Star Icon" className="w-11 h-11 text-purple-600 mb-1" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                {additionalText && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {additionalText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Explore Properties Button */}
        <div className="text-center">
          <Link to="/explore" className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
