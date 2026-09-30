import { Link } from 'react-router-dom';
import { Plus, Eye, Home, CheckCircle2 } from 'lucide-react';
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

const listingTypeLabel: Record<string, string> = {
  sale: 'Buy',
  rent: 'Rent',
  investment: 'Invest',
};

/** Same note as PendingProperties.tsx: not linked from anywhere in the
 * app today — /agent/properties' own "Approved" tab covers this — but
 * kept on real data rather than fake, in case it gets linked directly. */
const AgentApprovedProperties = () => {
  const { data: properties, isLoading } = useGetMyPropertiesQuery({ status: 'approved' });
  const rows = properties || [];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Approved Properties</h1>
            <span className="text-sm text-gray-500">({rows.length})</span>
          </div>
          <Link
            to="/agent/add-property"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Property</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {isLoading ? (
            <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No approved listings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((property: any) => {
                    const img = imageUrl(property.cover_image);
                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                              {img ? (
                                <img src={img} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <Home className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-xs truncate">{property.address}, {property.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{formatNaira(property.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{formatDate(property.approved_at || property.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{listingTypeLabel[property.listing_type] || property.listing_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{property.views_count ?? 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/agent/property-details/${property.id}`}
                            className="inline-flex items-center space-x-1 text-sm text-green-700 hover:text-green-800 font-medium"
                            title="View property details"
                          >
                            <Eye className="w-4 h-4" />
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

export default AgentApprovedProperties;
