import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import portfolio from '../../../assets/Group.png';
import CustomerHeader from './CustomerHeader';
import houses from '../../../assets/dash.png';
import useAuth from '../../../hooks/useAuth.tsx';
import {
  useGetInvestmentStatsQuery,
  useGetMyInvestmentsQuery,
  useGetNotificationsQuery,
  useGetPropertiesQuery,
} from '../../../redux/housebank.ts';

// Type definitions
type NotificationType = 'transfer' | 'payment' | 'agent' | 'investment' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description?: string;
  time: string;
  expanded: boolean;
}

interface Property {
  name: string;
  price: string;
  image: string;
}

interface HotSale {
  id: number;
  name: string;
  price: string;
  location: string;
  description: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
}

interface InvestmentStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

/** Real money everywhere here comes back from the API as a DECIMAL
 * string (see hb-backend/src/config/db.js — decimalNumbers:false is
 * deliberate, so it's never silently rounded through a JS float).
 * Formatting is the one place it's safe to convert to a display number. */
function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

/** property_images.file_path is stored (and returned by the API) already
 * as "uploads/<subfolder>/<file>" — see hb-backend's
 * src/utils/fileUpload.js storeImage(). VITE_APP_BACKEND_HOST already
 * ends in "/", so this is a plain concatenation, not another "uploads/". */
function imageUrl(relativePath: string | null | undefined, fallback: string) {
  if (!relativePath) return fallback;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const DashboardOverview = () => {
  const [activeNotification, setActiveNotification] = useState<number | null>(null);
  const auth = useAuth();

  const { data: stats } = useGetInvestmentStatsQuery();
  const { data: myInvestments } = useGetMyInvestmentsQuery();
  const { data: notificationsResult } = useGetNotificationsQuery({ per_page: 5 });
  const { data: hotSalesResult } = useGetPropertiesQuery({ per_page: 4 });
  const { data: saleListings } = useGetPropertiesQuery({ listing_type: 'sale', per_page: 1 });
  const { data: rentListings } = useGetPropertiesQuery({ listing_type: 'rent', per_page: 1 });

  const firstName = auth.user?.full_name ? auth.user.full_name.split(' ')[0] : 'there';

  const knownTypes: NotificationType[] = ['transfer', 'payment', 'agent', 'investment', 'system'];
  const notifications: Notification[] = (notificationsResult?.data || []).map((n: any) => ({
    id: n.id,
    type: knownTypes.includes(n.type) ? n.type : 'system',
    title: n.title,
    description: n.body || undefined,
    time: new Date(n.created_at.replace(' ', 'T') + 'Z').toLocaleString(),
    expanded: false,
  }));

  const investments: any[] = myInvestments || [];
  const properties: Property[] = investments.slice(0, 3).map((inv) => ({
    name: inv.property_title,
    price: formatNaira(inv.amount),
    image: imageUrl(inv.cover_image, portfolio),
  }));

  const hotSales: HotSale[] = (hotSalesResult?.items || []).map((p: any) => ({
    id: p.id,
    name: p.title,
    price: formatNaira(p.price),
    location: [p.city, p.state].filter(Boolean).join(', '),
    description: p.property_type_name ? `${p.property_type_name} listing in ${p.city || 'Nigeria'}` : '',
    beds: p.bedrooms ?? 0,
    baths: p.bathrooms ?? 0,
    area: p.size_sqm ?? 0,
    image: imageUrl(p.cover_image, houses),
  }));

  const toggleNotification = (id: number) => {
    setActiveNotification(activeNotification === id ? null : id);
  };

  const investmentStats: InvestmentStat[] = [
    {
      icon: <DollarSign className="w-4 h-4 text-orange-600" />,
      label: 'Total Investment',
      value: formatNaira(stats?.total_invested),
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      label: 'Estimated Returns',
      value: formatNaira(stats?.estimated_returns),
    },
    {
      icon: <DollarSign className="w-4 h-4 text-green-600" />,
      label: 'Active Investments',
      value: String(stats?.active_count ?? 0),
    },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Hi {firstName}!</h2>
          <p className="text-gray-600">Explore information about your property</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Overview</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Investment Card & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Investment Card */}
              <div className="bg-black text-white rounded-xl p-6">
                <h4 className="text-sm text-gray-400 mb-2">Balance</h4>
                <h3 className="text-2xl font-bold mb-4">{formatNaira(stats?.total_invested)}</h3>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Estimated Returns</p>
                  <p className="text-lg font-semibold">{formatNaira(stats?.estimated_returns)}</p>
                </div>
                <div className="text-xs text-green-400 mt-2">Investment Card</div>
              </div>

              {/* Total Property */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-sm text-gray-600 mb-2">Total Property</h4>
                <h3 className="text-2xl font-bold mb-2">{saleListings?.total ?? 0}</h3>
                <p className="text-xs text-gray-500">{saleListings?.total ?? 0} properties for sale right now</p>
              </div>

              {/* Total Property Rents */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-sm text-gray-600 mb-2">Total Property Rents</h4>
                <h3 className="text-2xl font-bold mb-2">{rentListings?.total ?? 0}</h3>
                <p className="text-xs text-gray-500">{rentListings?.total ?? 0} properties for rent right now</p>
              </div>
            </div>

            {/* My Portfolio */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <h4 className="text-lg font-semibold mb-4">My Portfolio</h4>
              {properties.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {properties.map((property, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{property.name}</h5>
                        <p className="text-gray-500 text-sm">{property.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">You don't have any properties in your portfolio yet.</p>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Monthly</h4>
                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Chart coming soon</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">My Portfolio</h4>
                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Chart coming soon</span>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column - Notifications & Stats */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Notifications</h4>
                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                  See All
                  <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </button>
              </div>

              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border border-gray-200 rounded-lg p-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleNotification(notification.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${notification.type === 'transfer' ? 'bg-blue-500' : notification.type === 'payment' ? 'bg-orange-500' : notification.type === 'investment' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                          <span className="text-sm font-medium">{notification.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <ChevronDown className={`w-4 w-4 text-gray-400 transition-transform ${activeNotification === notification.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      {activeNotification === notification.id && notification.description && (
                        <p className="text-xs text-gray-600 mt-2 ml-5">{notification.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No notifications yet.</p>
                )}
              </div>
            </div>

            {/* Investment Stats */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Investment Stats</h4>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {investmentStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${
                      stat.label.includes('Total Investment') ? 'bg-orange-100' : 'bg-green-100'
                    } rounded-lg flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="font-semibold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties owned */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Properties owned</h4>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                {investments.length > 0 ? (
                  investments.slice(0, 3).map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{inv.property_title}</p>
                        <p className="text-xs text-gray-500">{formatNaira(inv.amount)}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          inv.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : inv.status === 'matured'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {String(inv.status).replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No properties owned yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Hot Sales/Promotions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 w-full lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Hot Sales/Promotions</h4>
                <Link
                  to="/customer/property-listing"
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                >
                  Explore all
                  <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </Link>
              </div>

              {hotSales.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hotSales.map((property) => (
                    <Link
                      to={`/customer/property-details/${property.id}`}
                      key={property.id}
                      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img src={property.image} alt={property.name} className="w-full h-32 object-cover" />
                      </div>
                      <div className="p-3">
                        <h5 className="font-semibold text-sm mb-1">{property.name}</h5>
                        <p className="text-lg font-bold text-gray-900 mb-1">{property.price}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location}
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {property.beds}
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {property.baths}
                            </div>
                            <div className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              {property.area}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No listings available right now.</p>
              )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
