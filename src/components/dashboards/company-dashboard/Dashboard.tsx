import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Home, CalendarClock, Check, MessageSquare } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetMyProfileQuery,
  useGetMyPropertiesQuery,
  useGetPurchasesForMyListingsQuery,
  useGetRentalsForMyListingsQuery,
  useGetViewingsForMyPropertiesQuery,
  useConfirmViewingMutation,
  useGetMyCompanyAgentsQuery,
} from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

/** property_images.file_path is stored (and returned by the API)
 * already as "uploads/<subfolder>/<file>" — see hb-backend's
 * fileUpload.js. VITE_APP_BACKEND_HOST already ends in "/", so this is
 * a plain concatenation, matching the pattern used across the customer
 * and agent dashboards. */
function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const statusColor: Record<string, string> = {
  approved: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-orange-100 text-orange-800 border-orange-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  sold: 'bg-gray-200 text-gray-700 border-gray-300',
  rented: 'bg-blue-100 text-blue-800 border-blue-200',
};

const listingTypeLabel: Record<string, string> = {
  sale: 'Buy',
  rent: 'Rent',
  investment: 'Invest',
};

/**
 * The old "Overview" page was a template lift from a property-management
 * SaaS: a "Total Agents 128" stat that never moved, three fake charts,
 * and a "Requests" table (Maintenance/Complaint/Task) with no matching
 * concept anywhere in this codebase — nothing here tracks maintenance
 * tickets. This is the same real-data rebuild the agent dashboard got:
 * every number below comes from properties/purchases/rentals/viewings/
 * roster this company (and, since the backend scoping fix, its attached
 * agents) actually has, with a "Needs Your Attention" pending-viewings
 * panel replacing the fabricated Requests table.
 */
const CompanyOverview = () => {
  const navigate = useNavigate();
  const { data: myProfile } = useGetMyProfileQuery();
  const companyName = myProfile?.profile?.company_name || 'there';

  const { data: properties, isLoading: propsLoading } = useGetMyPropertiesQuery();
  const { data: purchases } = useGetPurchasesForMyListingsQuery();
  const { data: rentals } = useGetRentalsForMyListingsQuery();
  const { data: pendingViewings, isLoading: viewingsLoading } = useGetViewingsForMyPropertiesQuery({
    status: 'requested',
  });
  const [confirmViewing, { isLoading: confirming }] = useConfirmViewingMutation();
  const { data: roster } = useGetMyCompanyAgentsQuery();

  const rows = properties || [];
  const totalListings = rows.length;
  const approvedCount = rows.filter((p: any) => p.status === 'approved').length;

  const completedPurchases = (purchases || []).filter((p: any) => p.status === 'completed');
  const activeRentals = (rentals || []).filter((r: any) => r.status === 'active' || r.status === 'completed');
  const revenue =
    completedPurchases.reduce((sum: number, p: any) => sum + Number(p.agreed_price || 0), 0) +
    activeRentals.reduce((sum: number, r: any) => sum + Number(r.rent_amount || 0) * Number(r.rent_period_months || 0), 0);

  const clientIds = new Set<number>();
  (purchases || []).forEach((p: any) => clientIds.add(p.buyer_user_id));
  (rentals || []).forEach((r: any) => clientIds.add(r.tenant_user_id));

  const typeCounts = rows.reduce((acc: Record<string, number>, p: any) => {
    acc[p.listing_type] = (acc[p.listing_type] || 0) + 1;
    return acc;
  }, {});
  const typeTotal = Object.values(typeCounts).reduce((a: number, b: number) => a + b, 0);
  const salePct = typeTotal ? Math.round(((typeCounts.sale || 0) / typeTotal) * 100) : 0;
  const rentPct = typeTotal ? Math.round(((typeCounts.rent || 0) / typeTotal) * 100) : 0;
  const investPct = typeTotal ? Math.max(0, 100 - salePct - rentPct) : 0;

  const handleConfirmViewing = async (id: number) => {
    await confirmViewing({ id });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Section - Greeting and Add Property */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Hello {companyName}</p>
              <h1 className="text-2xl font-bold text-gray-900">{greetingForNow()}</h1>
            </div>
            <Link
              to="/company/add-property"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Property</span>
            </Link>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-black text-white rounded-xl p-4">
              <div className="text-xl sm:text-2xl font-bold mb-1 break-words">{formatNaira(revenue)}</div>
              <div className="text-xs text-gray-300">Revenue from confirmed deals</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Listings</div>
              <div className="text-2xl font-bold text-gray-900">{propsLoading ? '—' : totalListings}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Approved Properties</div>
              <div className="text-2xl font-bold text-gray-900">{propsLoading ? '—' : approvedCount}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Realtors on Roster</div>
              <div className="text-2xl font-bold text-gray-900">{(roster || []).length}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Clients</div>
              <div className="text-2xl font-bold text-gray-900">{clientIds.size}</div>
            </div>
          </div>

          {/* Needs attention + listing-type breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Viewing requests needing action — across every property
                this company (or an agent on its roster) lists. */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Needs Your Attention</h3>
                <span className="text-sm text-gray-500">
                  {viewingsLoading ? '—' : `${(pendingViewings || []).length} pending`}
                </span>
              </div>
              {viewingsLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : (pendingViewings || []).length === 0 ? (
                <div className="flex items-center space-x-3 text-gray-500 py-6">
                  <CalendarClock className="w-5 h-5" />
                  <p className="text-sm">No pending viewing requests right now.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {(pendingViewings || []).slice(0, 5).map((v: any) => (
                    <li key={v.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{v.property_title}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {v.customer_name || 'Customer'} · wants {v.preferred_date}
                          {v.preferred_time ? ` at ${v.preferred_time}` : ''}
                        </p>
                        {v.message && (
                          <p className="text-xs text-gray-400 italic truncate" title={v.message}>
                            “{v.message}”
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/company/messages', {
                              state: {
                                startWith: {
                                  user_id: v.customer_user_id,
                                  name: v.customer_name,
                                  avatar_path: v.customer_avatar,
                                },
                              },
                            })
                          }
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                          title="Message this customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={confirming}
                          onClick={() => handleConfirmViewing(v.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-700 text-white text-xs font-medium rounded-lg hover:bg-green-800 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Listing type breakdown — real counts across everything this
                company and its roster have listed. */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Listing Mix</h3>
              {typeTotal === 0 ? (
                <p className="text-sm text-gray-500">List a property to see your mix here.</p>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <svg width="140" height="140" className="transform -rotate-90">
                        <circle cx="70" cy="70" r="55" fill="none" stroke="#f3f4f6" strokeWidth="18" />
                        <circle
                          cx="70" cy="70" r="55" fill="none" stroke="#3b82f6" strokeWidth="18"
                          strokeDasharray={`${salePct * 3.46} 346`} strokeDashoffset="0"
                        />
                        <circle
                          cx="70" cy="70" r="55" fill="none" stroke="#10b981" strokeWidth="18"
                          strokeDasharray={`${rentPct * 3.46} 346`} strokeDashoffset={`-${salePct * 3.46}`}
                        />
                        <circle
                          cx="70" cy="70" r="55" fill="none" stroke="#f59e0b" strokeWidth="18"
                          strokeDasharray={`${investPct * 3.46} 346`} strokeDashoffset={`-${(salePct + rentPct) * 3.46}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{typeTotal}</div>
                          <div className="text-xs text-gray-500">Listings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">For Sale</span>
                      </div>
                      <span className="text-sm font-semibold">{salePct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">For Rent</span>
                      </div>
                      <span className="text-sm font-semibold">{rentPct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Investment</span>
                      </div>
                      <span className="text-sm font-semibold">{investPct}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Listings table — includes every roster agent's listings, not
              just the company's own, so a "Realtor" column matters here
              in a way it doesn't on the agent dashboard's version. */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Property Listings</h3>
              <Link to="/company/property" className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
                See All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {propsLoading ? (
              <p className="px-6 py-8 text-sm text-gray-500">Loading your listings…</p>
            ) : rows.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No properties listed yet — by your company or your roster.</p>
                <Link to="/company/add-property" className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block">
                  Add your first property
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realtor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.slice(0, 8).map((property: any) => {
                      const img = imageUrl(property.cover_image);
                      return (
                        <tr key={property.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                {img ? (
                                  <img src={img} alt={property.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Home className="w-5 h-5 text-gray-300" />
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{property.lister_name || 'Your company'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{formatNaira(property.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                statusColor[property.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{listingTypeLabel[property.listing_type] || property.listing_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/company/property-details/${property.id}`}
                              className="text-gray-400 hover:text-gray-600 inline-block"
                              title="View property details"
                            >
                              <MoreVertical className="w-4 h-4" />
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
    </div>
  );
};

export default CompanyOverview;
