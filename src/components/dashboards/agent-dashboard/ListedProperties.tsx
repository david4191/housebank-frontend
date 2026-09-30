import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

// Joan, Sep 2026 -- correction: "its the company that vets and
// approves properties. The admin only vets and approves companies."
// There is no admin review stage after a company's own any more -- a
// company-attached realtor's listing waits on `pending_company_review`
// until that company approves (published immediately, `approved`) or
// rejects it. The old, separate `pending` (admin-review) status/tab is
// removed -- nothing is ever routed there any more.
const statusColor: Record<string, string> = {
  approved: 'bg-blue-100 text-blue-700',
  pending_company_review: 'bg-indigo-100 text-indigo-700',
  rejected: 'bg-red-100 text-red-700',
  sold: 'bg-gray-200 text-gray-700',
  rented: 'bg-purple-100 text-purple-700',
};

// Human-readable status text. Plain object lookup so raw statuses
// (e.g. 'sold') that don't need a rewrite just fall through unchanged.
const statusLabel: Record<string, string> = {
  pending_company_review: 'Awaiting company review',
};

const listingTypeLabel: Record<string, string> = {
  sale: 'Buy',
  rent: 'Rent',
  investment: 'Invest',
};

type Tab = 'all' | 'pending_company_review' | 'approved' | 'rejected' | 'sold' | 'rented';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_company_review', label: 'Awaiting Company' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'sold', label: 'Sold' },
  { key: 'rented', label: 'Rented' },
];

const AgentListedProp = () => {
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;
  const { data: properties, isLoading } = useGetMyPropertiesQuery();
  const [tab, setTab] = useState<Tab>('all');

  const rows = properties || [];
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((p: any) => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [rows]);

  const filtered = tab === 'all' ? rows : rows.filter((p: any) => p.status === tab);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <Link
            to="/agent/add-property"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Property</span>
          </Link>
        </div>

        {notice && (
          <div className="mb-4 flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{notice}</p>
          </div>
        )}

        {/* Status tabs — real counts, computed from the same data as the
            table below rather than a separate query per tab. */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                tab === t.key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label} {counts[t.key] ? `(${counts[t.key]})` : counts[t.key] === 0 ? '(0)' : ''}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {isLoading ? (
            <p className="px-6 py-10 text-sm text-gray-500">Loading your listings…</p>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {tab === 'all' ? "You haven't listed any properties yet." : `No ${tab} listings.`}
              </p>
              {tab === 'all' && (
                <Link to="/agent/add-property" className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block">
                  Add your first property
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((property: any) => {
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
                          <div className="text-sm text-gray-700 max-w-xs truncate">
                            {property.address}, {property.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{formatNaira(property.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{formatDate(property.created_at)}</div>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[property.status] || 'bg-gray-100 text-gray-700'}`}>
                            {statusLabel[property.status] || property.status}
                          </span>
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

export default AgentListedProp;
