// src/components/dashboards/company-dashboard/CompanyProperty.tsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Home, Plus, ShieldAlert, X } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetMyPropertiesQuery,
  useSubmitPropertyAppealMutation,
  useGetPropertyAppealsQuery,
} from '../../../redux/housebank.ts';

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
  blocked: 'bg-red-200 text-red-900',
};

type TabType = 'All Property' | 'Buy' | 'Rent' | 'Investment';
const listingTypeForTab: Record<TabType, string | null> = {
  'All Property': null,
  Buy: 'sale',
  Rent: 'rent',
  Investment: 'investment',
};

/**
 * The old page was a flat mock table — every row's "realtor" was the
 * same hardcoded "Abubakar Isa" with a randomuser.me photo, duplicate
 * "#HB111" ids, a 5-page pager over 6 rows, and no way to actually get
 * to a property or list a new one (both links pointed nowhere real).
 *
 * This is now real: properties/mine already returns every listing
 * under this company — the caller's own plus anything listed by an
 * agent on its roster (see Property.findByListerId in hb-backend) —
 * so a "Realtor" column is the one real addition over the agent
 * version of this page, since a company's listings can come from
 * several different people, not just the account itself.
 */
/**
 * Joan, Sep 2026: "block a property in which the company will/must
 * appeal". A blocked listing (Property.block on the backend) drops out
 * of public search immediately -- the only way back is this appeal,
 * reviewed by admin on the Appeals tab of admin/properties. Shows the
 * existing appeal history so a company can see a past rejection's
 * reason before trying again, rather than appealing blind.
 */
const AppealModal = ({ propertyId, propertyTitle, onClose }: { propertyId: number; propertyTitle: string; onClose: () => void }) => {
  const { data: appeals, isLoading } = useGetPropertyAppealsQuery(propertyId);
  const [submitAppeal, { isLoading: submitting }] = useSubmitPropertyAppealMutation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hasPending = (appeals || []).some((a: any) => a.status === 'pending');

  const handleSubmit = async () => {
    setError('');
    if (!message.trim()) { setError('Explain why this listing should be reinstated.'); return; }
    const result: any = await submitAppeal({ id: propertyId, message: message.trim() });
    if (result.error) {
      setError(result.error.data?.errors?.status?.[0] || result.error.data?.message || 'Could not submit appeal.');
      return;
    }
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[85vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Appeal: {propertyTitle}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading appeal history…</p>
        ) : (appeals || []).length > 0 && (
          <div className="space-y-2">
            {appeals!.map((a: any) => (
              <div key={a.id} className="border border-gray-100 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${a.status === 'approved' ? 'text-green-600' : a.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600">{a.message}</p>
                {a.admin_response && <p className="text-gray-500 mt-1">HouseBank: {a.admin_response}</p>}
              </div>
            ))}
          </div>
        )}

        {hasPending ? (
          <p className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
            An appeal for this listing is already pending review — you'll be notified once HouseBank responds.
          </p>
        ) : (
          <>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why this listing should be reinstated..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit Appeal'}
              </button>
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CompanyPropertyPager = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All Property');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: properties, isLoading } = useGetMyPropertiesQuery();
  const [appealingProperty, setAppealingProperty] = useState<{ id: number; title: string } | null>(null);

  const rows = properties || [];
  const filtered = useMemo(() => {
    const wantType = listingTypeForTab[activeTab];
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((p: any) => {
      const matchesTab = !wantType || p.listing_type === wantType;
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.lister_name?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [rows, activeTab, searchTerm]);

  const tabs: TabType[] = ['All Property', 'Buy', 'Rent', 'Investment'];

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-xl font-semibold text-gray-900">All Listed Properties</h1>

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
                  to="/company/add-property"
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
              <p className="text-sm text-gray-500">
                {rows.length === 0
                  ? "No properties listed yet — click \"List Property\" to add your first one."
                  : 'No listings match here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realtor</th>
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
                            <Link to={`/company/property-details/${property.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                              {property.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{property.lister_name || 'Your company'}</span>
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
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/company/property-details/${property.id}`}
                              className="inline-flex items-center space-x-1 text-xs text-green-700 hover:text-green-800 font-medium"
                              title="View property details"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </Link>
                            {property.status === 'blocked' && (
                              <button
                                onClick={() => setAppealingProperty({ id: property.id, title: property.title })}
                                className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium"
                                title="Appeal this block"
                              >
                                <ShieldAlert className="w-3 h-3" />
                                <span>Appeal</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {appealingProperty && (
        <AppealModal
          propertyId={appealingProperty.id}
          propertyTitle={appealingProperty.title}
          onClose={() => setAppealingProperty(null)}
        />
      )}
    </div>
  );
};

export default CompanyPropertyPager;
