import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MoreVertical, Heart } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyInvestmentsQuery } from '../../../redux/housebank.ts';

// Type definitions
type PropertyCategory = 'all' | 'buy' | 'rent' | 'investment';

interface InvestmentRow {
  id: number;
  investment_property_id: number;
  amount: string | number;
  status: 'pending_payment' | 'active' | 'matured' | 'withdrawn' | 'cancelled';
  property_title: string;
  address: string | null;
  city: string | null;
  state: string | null;
  company_name: string | null;
  realtor_name: string | null;
  cover_image: string | null;
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function statusBadge(status: InvestmentRow['status']) {
  const config: Record<InvestmentRow['status'], { label: string; className: string }> = {
    pending_payment: { label: 'Payment Pending', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    active: { label: 'Active Investment', className: 'bg-green-100 text-green-700 border-green-200' },
    matured: { label: 'Matured', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    withdrawn: { label: 'Withdrawn', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const c = config[status] || { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${c.className}`}>{c.label}</span>
  );
}

const MyPropertyPage = () => {
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | InvestmentRow['status']>('all');

  const { data: investments, isLoading } = useGetMyInvestmentsQuery();
  const rows: InvestmentRow[] = investments || [];

  const categories: { key: PropertyCategory; label: string }[] = [
    { key: 'all', label: 'All Properties' },
    { key: 'buy', label: 'Buy' },
    { key: 'rent', label: 'Rent' },
    { key: 'investment', label: 'Investment' },
  ];

  // Direct property purchase/rental tracking isn't built on the backend yet
  // (no purchases/leases table exists — only investments, which the schema
  // fully supports). Buy/Rent tabs are real, working controls, but there's
  // nothing to show under them today, so they say that plainly instead of
  // showing invented rows.
  const showComingSoon = activeCategory === 'buy' || activeCategory === 'rent';

  const filteredRows = rows.filter((row) => {
    if (statusFilter !== 'all' && row.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      row.property_title?.toLowerCase().includes(q) ||
      row.address?.toLowerCase().includes(q) ||
      row.city?.toLowerCase().includes(q) ||
      row.company_name?.toLowerCase().includes(q) ||
      row.realtor_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="flex-1 bg-gray-50 min-h-screen"
      onClick={() => {
        setShowFilterDropdown(false);
        setShowActionDropdown(null);
      }}
    >
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Property</h2>
            <p className="text-sm text-gray-500 mt-1">Total No of Properties: {rows.length}</p>
          </div>

          {/* Center Section (Search) */}
          <div className="flex-1 flex justify-center order-2 md:order-none">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here..."
                className="pl-12 pr-12 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 w-full bg-white"
              />

              <SlidersHorizontal
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterDropdown(!showFilterDropdown);
                }}
              />

              {/* Filter Dropdown — real statuses that actually exist on an investment */}
              {showFilterDropdown && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                      Status
                    </div>
                    <div className="space-y-1">
                      {(
                        [
                          { id: 'all', label: 'All Statuses' },
                          { id: 'pending_payment', label: 'Payment Pending' },
                          { id: 'active', label: 'Active' },
                          { id: 'matured', label: 'Matured' },
                          { id: 'withdrawn', label: 'Withdrawn' },
                          { id: 'cancelled', label: 'Cancelled' },
                        ] as const
                      ).map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setStatusFilter(option.id);
                            setShowFilterDropdown(false);
                          }}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center bg-white">
                            {statusFilter === option.id && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                          </div>
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section (Wishlist Button) */}
          <div className="flex-1 flex justify-end">
            <Link
              to="/customer/wishlist"
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeCategory === category.key
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showComingSoon ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              Direct property {activeCategory === 'buy' ? 'purchases' : 'rentals'} aren't tracked here yet —
              this tab will show real data once that's built. Your investments are under the Investment tab.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div
                className="grid gap-4 text-sm font-medium text-gray-600"
                style={{ gridTemplateColumns: '2fr 3fr 1.5fr 2fr 1.5fr 1fr 1fr' }}
              >
                <div>Property</div>
                <div>Address</div>
                <div>Company</div>
                <div>Assign Realtor</div>
                <div>Status</div>
                <div>Category</div>
                <div>Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="px-6 py-8 text-center text-gray-500">Loading your properties…</div>
              ) : filteredRows.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  {rows.length === 0
                    ? "You don't have any investments yet."
                    : 'No properties match your search or filter.'}
                </div>
              ) : (
                filteredRows.map((row) => {
                  const img = imageUrl(row.cover_image);
                  const addressLine = [row.address, row.city, row.state].filter(Boolean).join(', ');
                  return (
                    <div key={row.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div
                        className="grid gap-4 items-center"
                        style={{ gridTemplateColumns: '2fr 3fr 1.5fr 2fr 1.5fr 1fr 1fr' }}
                      >
                        {/* Property */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {img ? (
                              <img src={img} alt={row.property_title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate block">
                              {row.property_title}
                            </span>
                            <span className="text-xs text-gray-500">{formatNaira(row.amount)} invested</span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="text-sm text-gray-600 min-w-0">
                          <div className="truncate">{addressLine || '—'}</div>
                        </div>

                        {/* Company */}
                        <div className="text-sm text-gray-900">{row.company_name || '—'}</div>

                        {/* Assign Realtor */}
                        <div className="text-sm text-gray-600">{row.realtor_name || '—'}</div>

                        {/* Status */}
                        <div className="flex justify-start">{statusBadge(row.status)}</div>

                        {/* Category */}
                        <div className="text-sm text-gray-900">Investment</div>

                        {/* Action */}
                        <div className="relative">
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionDropdown(showActionDropdown === row.id ? null : row.id);
                            }}
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>

                          {showActionDropdown === row.id && (
                            <div className="absolute top-full mt-1 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <div className="py-3 px-4 text-sm text-gray-500">
                                Per-property actions (document download, progress tracking) aren't built yet.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertyPage;
