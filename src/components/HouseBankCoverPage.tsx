import logo1 from '../assets/logo1.png';
import { Link, useLocation } from 'react-router-dom';
import { useGetPageQuery } from '../redux/housebank.ts';

// "For Listed Properties" and "For Users" aren't tab-state within one
// page -- they're the two real, already-routed HouseBank Cover pages
// (/listed-properties-cover and /housebank-Users-cover). The old buttons
// only flipped a local `activeTab` string that nothing in this component
// ever read, so clicking "For Users" here visibly highlighted a tab and
// changed nothing else. Now they're real links between the two pages.
const tabs = [
  { label: 'For Listed Properties', to: '/listed-properties-cover' },
  { label: 'For Users', to: '/housebank-Users-cover' },
];

const HousebankCoverPage = () => {
  const location = useLocation();
  const { data: page, isLoading: pageLoading, isError: pageError } = useGetPageQuery('housebank-cover');

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Housebank Cover
          </h1>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mb-8">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={`text-sm font-medium pb-2 transition-colors ${
                  location.pathname === tab.to
                    ? 'text-gray-600 border-b-2 border-green-bolder'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-black rounded-lg p-12 text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo1} alt="Housebank Logo" className="h-16 w-19" />
          </div>
          <h2 className="text-white text-2xl font-bold">
            Housebank Cover
          </h2>
        </div>

        {/* Content Sections */}
        {pageLoading && (
          <div className="text-center text-gray-500 py-12">Loading…</div>
        )}
        {!pageLoading && (pageError || !page) && (
          <div className="text-center text-gray-500 py-12">
            This content hasn't been published yet. Please check back soon.
          </div>
        )}
        {!pageLoading && !pageError && page && (
          <div
            className="prose prose-gray max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.content_html || '' }}
          />
        )}

      </div>
    </div>
  );
};

export default HousebankCoverPage;