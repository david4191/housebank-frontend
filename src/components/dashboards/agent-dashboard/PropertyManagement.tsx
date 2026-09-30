import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Home, Plus } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyPropertiesQuery } from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const statusColor: Record<string, string> = {
  approved: 'bg-blue-100 text-blue-800',
  pending: 'bg-orange-100 text-orange-800',
  rejected: 'bg-red-100 text-red-800',
  sold: 'bg-gray-200 text-gray-800',
  rented: 'bg-purple-100 text-purple-800',
};

type TabType = 'All Property' | 'Buy' | 'Rent';
const listingTypeForTab: Record<TabType, string | null> = {
  'All Property': null,
  Buy: 'sale',
  Rent: 'rent',
};

/** Search + category view of the same real listings ListedProperties.tsx
 * shows by status — this page isn't linked from anywhere in the app
 * today either, but kept real (not fake) in case it gets linked. */
const AgentPropertyManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All Property');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: properties, isLoading } = useGetMyPropertiesQuery();

  const rows = properties || [];
  const filtered = useMemo(() => {
    const wantType = listingTypeForTab[activeTab];
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((p: any) => {
      const matchesTab = !wantType || p.listing_type === wantType;
      const matchesSearch = !q || p.title?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [rows, activeTab, searchTerm]);

  const tabs: TabType[] = ['All Property', 'Buy', 'Rent'];

  return (
    <div className="flex-1 bg-gray-50">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Property Management</h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 w-full sm:w-48"
                  />
                </div>

                <Link
                  to="/agent/add-property"
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">List Property</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No listings match here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((property: any) => {
                    const img = imageUrl(property.cover_image);
                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                              {img ? <img src={img} alt={property.title} className="w-full h-full object-cover" /> : <Home className="w-4 h-4 text-gray-300" />}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{property.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 max-w-xs block truncate">{property.address}, {property.city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{formatNaira(property.price)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{formatDate(property.created_at)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{property.listing_type === 'sale' ? 'Buy' : property.listing_type === 'rent' ? 'Rent' : 'Invest'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{property.views_count ?? 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[property.status] || 'bg-gray-100 text-gray-800'}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/agent/property-details/${property.id}`}
                            className="inline-flex items-center space-x-1 text-xs text-green-700 hover:text-green-800 font-medium"
                            title="View property details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPropertyManagement;
