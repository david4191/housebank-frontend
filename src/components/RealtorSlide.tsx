import realtorBackground from '../assets/realtor/handshake-background.png';
import companyOne from '../assets/company1.png';
import companyTwo from '../assets/company2.png';
import companyThree from '../assets/company3.png';
import companyFour from '../assets/company4.png';
import { useNavigate } from 'react-router-dom';
import { useGetPageContentQuery } from '../redux/housebank.ts';
import { renderIcon } from '../utils/iconLookup.tsx';
import useAuth from '../hooks/useAuth.tsx';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const FALLBACK_PARTNER_LOGOS = [companyOne, companyTwo, companyThree, companyFour];

const DEFAULT_HERO = {
  title: 'Become an Realtor',
  description:
    "Effortlessly buy, sell, and invest in real estate with HouseBank. Whether you're a realtor, developer, or investor, we provide the tools and connections you need to close deals faster and grow your business.",
  ctaText: 'Register Now',
  stats: [
    { icon: 'Users', number: '20,000+', label: 'Registered Realtors' },
    { icon: 'Home', number: '50k+', label: 'Houses Uploaded' },
    { icon: '₦', number: '₦15M', label: 'Amount Realtors Paid' },
  ],
};

const DEFAULT_PARTNERS_HEADER = 'Our Partners';
const DEFAULT_PARTNERS = [
  { id: 1, title: "Check D'Deck Homes" },
  { id: 2, title: 'Lane*Wey' },
  { id: 3, title: 'Telos Properties' },
  { id: 4, title: 'Golden Partner' },
];

/**
 * Realtor landing page hero + partner logos. Used to be 100% hardcoded
 * copy (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (sections "realtor-hero" and "realtor-partners"),
 * falling back to the original copy.
 */
const BecomeRealtor = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  // Joan, Sep 2026: "for the realtor to see /realtor-landing it means the
  // realtor has been onboarded and attached to a company... it shouldn't
  // be showing Register Now again." A signed-in realtor gets a welcome-back
  // hero pointed at their own dashboard/add-property flow instead of the
  // generic prospect pitch; everyone else still gets the admin-managed
  // marketing copy below.
  const isRealtor = auth.user?.role === 'agent';

  const { data } = useGetPageContentQuery('realtor');
  const items = data || [];

  const heroItem = items.find((i: any) => i.section === 'realtor-hero');
  const heroExtra = heroItem?.extra || {};
  const heroTitle = isRealtor
    ? `Welcome back, ${auth.user?.full_name || 'Realtor'}`
    : heroItem?.title ?? DEFAULT_HERO.title;
  const heroDescription = heroItem?.description ?? DEFAULT_HERO.description;
  const heroCtaText = isRealtor ? 'Go to Dashboard' : heroExtra.cta_text ?? DEFAULT_HERO.ctaText;
  const stats = Array.isArray(heroExtra.stats) && heroExtra.stats.length > 0 ? heroExtra.stats : DEFAULT_HERO.stats;

  const handleHeroCta = () => navigate(isRealtor ? '/agent/dashboard' : '/signup-buyer');

  const partnersHeader = items.find((i: any) => i.section === 'realtor-partners' && i.extra?.kind === 'header');
  const partnersTitle = partnersHeader?.title ?? DEFAULT_PARTNERS_HEADER;
  const partnersRaw = items.filter((i: any) => i.section === 'realtor-partners' && i.extra?.kind !== 'header');
  const partners = partnersRaw.length > 0 ? partnersRaw : DEFAULT_PARTNERS;

  return (
    <div className="bg-white">
      <div className="relative min-h-screen flex flex-col justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={realtorBackground}
            alt="Professional handshake meeting"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
            {heroTitle}
          </h1>

          <p className="text-lg sm:text-xl text-white text-opacity-90 leading-relaxed mb-10 max-w-3xl mx-auto">
            {heroDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleHeroCta}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-12 rounded-lg transition-colors duration-200 text-lg"
            >
              {heroCtaText}
            </button>
            {isRealtor && (
              <button
                onClick={() => navigate('/agent/add-property')}
                className="bg-white/90 hover:bg-white text-gray-900 font-medium py-4 px-12 rounded-lg transition-colors duration-200 text-lg"
              >
                List a New Property
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat: any, index: number) => (
              <div
                key={index}
                className="bg-white/30 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    {renderIcon(stat.icon, 'w-8 h-8 text-gray-700')}
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white text-opacity-80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">{partnersTitle}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner: any, index: number) => {
              const logo = imageUrl(partner.image_path) || FALLBACK_PARTNER_LOGOS[index % FALLBACK_PARTNER_LOGOS.length];
              return (
                <div className="flex flex-col items-center space-y-2" key={partner.id ?? index}>
                  <img src={logo} alt={partner.title || 'Partner'} className="w-26 h-26 mb-2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeRealtor;
