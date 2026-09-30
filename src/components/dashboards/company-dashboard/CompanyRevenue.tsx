// src/components/dashboards/company-dashboard/CompanyRevenue.tsx
import { useMemo, useState } from 'react';
import { MoreVertical, TrendingUp, Home } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import PaymentInvoiceModal, { AgentTransaction } from './PaymentInvoiceModal';
import {
  useGetPurchasesForMyListingsQuery,
  useGetRentalsForMyListingsQuery,
  useConfirmPurchaseMutation,
  useConfirmRentalMutation,
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

const STATUS_LABEL: Record<string, string> = {
  pending_payment: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  active: 'Active',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<string, string> = {
  pending_payment: 'bg-orange-100 text-orange-800',
  processing: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  active: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

type Row = AgentTransaction & { cover_image?: string | null };

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The old page was three fabricated charts (a bar "Revenue Overview",
 * a line "Property Valuation", a donut "Properties Review" hardcoded
 * to 30/23/47%) that never reflected a single real transaction.
 *
 * This is the company mirror of agent-dashboard/AgentRevenue.tsx — the
 * for-my-listings purchase/rental endpoints and the confirm mutations
 * are already company-roster-scoped server-side (resolveCallerCompanyId
 * in purchases.routes.js / rentals.routes.js), so this shows real
 * revenue across every property listed by the company or by any agent
 * on its roster, not just the company account's own listings.
 */
const CompanyRevenueDashboard = () => {
  const { data: purchases, isLoading: loadingPurchases } = useGetPurchasesForMyListingsQuery();
  const { data: rentals, isLoading: loadingRentals } = useGetRentalsForMyListingsQuery();
  const [confirmPurchase, { isLoading: confirmingPurchase }] = useConfirmPurchaseMutation();
  const [confirmRental, { isLoading: confirmingRental }] = useConfirmRentalMutation();

  const [activeTab, setActiveTab] = useState<'All Property' | 'Buy' | 'Rent'>('All Property');
  const [selected, setSelected] = useState<Row | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isLoading = loadingPurchases || loadingRentals;

  const rows: Row[] = useMemo(() => {
    const p: Row[] = (purchases || []).map((pp: any) => ({
      kind: 'purchase',
      id: pp.id,
      property_title: pp.property_title,
      address: pp.address,
      city: pp.city,
      counterpartyName: pp.buyer_name || 'Unknown buyer',
      amount: Number(pp.agreed_price) || 0,
      status: pp.status,
      created_at: pp.created_at,
      completed_at: pp.completed_at,
      cover_image: pp.cover_image,
    }));
    const r: Row[] = (rentals || []).map((pr: any) => ({
      kind: 'rental',
      id: pr.id,
      property_title: pr.property_title,
      address: pr.address,
      city: pr.city,
      counterpartyName: pr.tenant_name || 'Unknown tenant',
      amount: (Number(pr.rent_amount) || 0) * (Number(pr.rent_period_months) || 1),
      rent_period_months: pr.rent_period_months,
      status: pr.status,
      created_at: pr.created_at,
      cover_image: pr.cover_image,
    }));
    return [...p, ...r].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [purchases, rentals]);

  const filtered = useMemo(() => {
    if (activeTab === 'Buy') return rows.filter((r) => r.kind === 'purchase');
    if (activeTab === 'Rent') return rows.filter((r) => r.kind === 'rental');
    return rows;
  }, [rows, activeTab]);

  const totalRevenue = useMemo(
    () => rows.filter((r) => r.status === 'completed' || r.status === 'active').reduce((sum, r) => sum + r.amount, 0),
    [rows]
  );

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const buckets: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ label: MONTH_LABELS[d.getMonth()], total: 0 });
    }
    rows.forEach((r) => {
      if (r.status !== 'completed' && r.status !== 'active') return;
      if (!r.created_at) return;
      const d = new Date(r.created_at.replace(' ', 'T') + 'Z');
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (monthsAgo >= 0 && monthsAgo <= 5) {
        buckets[5 - monthsAgo].total += r.amount;
      }
    });
    return buckets;
  }, [rows]);

  const maxMonthly = Math.max(1, ...monthlyTotals.map((m) => m.total));

  const handleConfirm = async (t: AgentTransaction) => {
    if (t.kind === 'purchase') {
      await confirmPurchase(t.id);
    } else {
      await confirmRental(t.id);
    }
    setSelected(null);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Revenue</h1>
            <button
              type="button"
              disabled
              title="Withdrawals aren't available yet — coming soon"
              className="text-white px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
              style={{ backgroundColor: '#58745A' }}
            >
              Withdraw
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <span className="text-sm text-gray-600">Last 6 months</span>
            </div>

            {totalRevenue === 0 ? (
              <div className="py-10 text-center">
                <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No completed transactions yet — the chart will fill in as sales and leases complete.</p>
              </div>
            ) : (
              <div className="mb-2 overflow-x-auto">
                <div className="h-56 flex items-end space-x-2 min-w-[420px]">
                  {monthlyTotals.map((m, index) => (
                    <div key={`${m.label}-${index}`} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col-reverse mb-2" style={{ height: '180px' }}>
                        <div
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${Math.max(4, (m.total / maxMonthly) * 100)}%` }}
                          title={formatNaira(m.total)}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Revenue (completed)</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{formatNaira(totalRevenue)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Transactions on record</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{rows.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 px-4 sm:px-6">
              <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
                {(['All Property', 'Buy', 'Rent'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 pb-4 pt-6 text-sm font-medium border-b-2 transition-colors ${
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
                <p className="text-sm text-gray-500">No transactions here yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((row) => {
                      const rowKey = `${row.kind}-${row.id}`;
                      const img = imageUrl(row.cover_image);
                      return (
                        <tr key={rowKey} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                {img ? <img src={img} alt={row.property_title} className="w-full h-full object-cover" /> : <Home className="w-4 h-4 text-gray-300" />}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{row.property_title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{formatNaira(row.amount)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{formatDate(row.created_at)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{row.kind === 'purchase' ? 'Buy' : 'Rent'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[row.status] || 'bg-gray-100 text-gray-800'}`}>
                              {STATUS_LABEL[row.status] || row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === rowKey ? null : rowKey)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                              {openMenuId === rowKey && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => { setSelected(row); setOpenMenuId(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    View Details
                                  </button>
                                </div>
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
        </div>
      </div>

      <PaymentInvoiceModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected}
        onConfirm={handleConfirm}
        isConfirming={confirmingPurchase || confirmingRental}
      />
    </div>
  );
};

export default CompanyRevenueDashboard;
