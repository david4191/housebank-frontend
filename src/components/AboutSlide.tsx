import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '../assets/about/hero-building-bg.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULTS = {
  badge: 'Welcome to HouseBank',
  title: 'Dream Home Meets Trusted Expertise',
  paragraph1:
    "At HouseBank, we pride ourselves on being more than just a real estate agency, we are your partners in finding the perfect space to live, work, and thrive.",
  paragraph2:
    "Whether you're searching for a family home, an investment property, or a commercial space, we are committed to helping you achieve your goals with professionalism and care",
  ctaText: 'Explore Properties',
  ctaLink: '/explore',
};

/**
 * About page hero. Used to be 100% hardcoded copy (Joan, Sep 2026 --
 * "whole main website in one push"). Now reads from page_content_items
 * (section "about-hero") with the exact original copy as a fallback so
 * a brief loading flash or a network hiccup never shows a blank/broken
 * hero to a visitor -- an admin edit in Site Content > Page Content is
 * what actually changes what's shown here.
 */
const AboutSlide = () => {
  const { data } = useGetPageContentQuery('about');
  const item = (data || []).find((i: any) => i.section === 'about-hero');
  const extra = item?.extra || {};

  const badge = extra.badge ?? DEFAULTS.badge;
  const title = item?.title ?? DEFAULTS.title;
  const paragraph1 = item?.description ?? DEFAULTS.paragraph1;
  const paragraph2 = extra.paragraph2 ?? DEFAULTS.paragraph2;
  const ctaText = extra.cta_text ?? DEFAULTS.ctaText;
  const ctaLink = extra.cta_link ?? DEFAULTS.ctaLink;
  const background = imageUrl(item?.image_path) || heroBackground;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt="Modern building architecture"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Welcome Badge */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2  bg-opacity-20 text-white text-md font-medium rounded-full border-white border-opacity-30">
            {badge}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
          {title}
        </h1>

        {/* Description Text */}
        <div className="space-y-6 mb-12">
          <p className="text-lg sm:text-xl text-white text-opacity-90 leading-relaxed max-w-4xl mx-auto">
            {paragraph1}
          </p>
          <p className="text-lg sm:text-xl text-white text-opacity-90 leading-relaxed max-w-4xl mx-auto">
            {paragraph2}
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <Link
            to={ctaLink}
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-lg">{ctaText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutSlide;
