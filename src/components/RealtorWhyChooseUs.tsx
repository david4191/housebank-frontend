import dashboard from '../assets/realtor/dashboard.png';
import { useNavigate } from 'react-router-dom';
import { useGetPageContentQuery } from '../redux/housebank.ts';
import useAuth from '../hooks/useAuth.tsx';

const DEFAULT_HEADER = { title: 'Why Choose Us?', ctaText: 'Sign up' };

const DEFAULT_POINTS = [
  { id: 1, title: 'Customer-Centric Approach:', description: 'Your satisfaction is our priority. We listen, understand, and deliver solutions tailored to your needs.' },
  { id: 2, title: 'Transparency and Integrity:', description: 'Honesty and fairness guide everything we do.' },
  { id: 3, title: 'Market Expertise:', description: 'With a deep understanding of the real estate market, we provide insights to help you make confident decisions.' },
  { id: 4, title: 'End-to-End Support:', description: 'From property search to closing the deal, we are with you every step of the way.' },
];

/**
 * Realtor landing page "Why Choose Us?" dark card. Used to be 100%
 * hardcoded copy (Joan, Sep 2026 -- "whole main website in one push").
 * Reads from page_content_items (section "realtor-why-choose-us"),
 * falling back to the original copy.
 */
const WhyChooseUsPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isRealtor = auth.user?.role === 'agent';
  const handleCta = () => navigate(isRealtor ? '/agent/dashboard' : '/signup-buyer');

  const { data } = useGetPageContentQuery('realtor');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'realtor-why-choose-us' && i.extra?.kind === 'header');
  const title = header?.title ?? DEFAULT_HEADER.title;
  const ctaText = header?.extra?.cta_text ?? DEFAULT_HEADER.ctaText;

  const pointsRaw = items.filter((i: any) => i.section === 'realtor-why-choose-us' && i.extra?.kind !== 'header');
  const points = pointsRaw.length > 0 ? pointsRaw : DEFAULT_POINTS;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
          {/* Left Content - Why Choose Us */}
          <div className="text-white p-12 rounded-2xl" style={{ backgroundColor: '#161D17' }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-200">
              {title}
            </h1>

            <div className="space-y-6 text-gray-300">
              {points.map((point: any, index: number) => (
                <div key={point.id ?? index}>
                  <h3 className="font-semibold text-white mb-2">{point.title}</h3>
                  <p className="text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <img src={dashboard} alt="Dashboard Preview" className="w-full h-auto rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center">
          <button onClick={handleCta} className="bg-green-700 hover:bg-green-800 text-white px-12 py-4 rounded-2xl text-lg font-medium transition-colors shadow-lg" >
            {isRealtor ? 'Go to Dashboard' : ctaText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUsPage;
