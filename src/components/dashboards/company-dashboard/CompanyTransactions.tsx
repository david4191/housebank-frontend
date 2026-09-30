// src/components/dashboards/company-dashboard/CompanyTransactions.tsx
import { useMemo, useState } from 'react';
import { MoreVertical, Home } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import PaymentInvoiceModal, { AgentTransaction } from './PaymentInvoiceModal';
import {
  useGetPurchasesForMyListingsQuery,
  useGetRentalsForMyListingsQuery,
  useConfirmPurchaseMutation,
  useConfirmRentalMutation,
  useApprovePurchaseRequestMutation,
  useDeclinePurchaseRequestMutation,
  useApproveRentalRequestMutation,
  useDeclineRentalRequestMutation,
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
  requested: 'New Request',
  declined: 'Declined',
  pending_payment: 'Pending',
  processing: 'Pending',
  completed: 'Completed',
  active: 'Active',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<string, string> = {
  requested: 'bg-purple-100 text-purple-700',
  declined: 'bg-red-100 text-red-700',
  pending_payment: 'bg-orange-100 text-orange-700',
  processing: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  active: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-200 text-gray-700',
};

type Row = AgentTransaction & { cover_image?: string | null };
type FilterTab = 'all' | 'requests' | 'buy' | 'rent' | 'pending';

/**
 * The old page was an enormous mock: six hardcoded dollar-denominated
 * rows ("Wade Warren", "$351.02"), a fake card-number/VAT/commission
 * invoice breakdown, and non-functional download/share/report buttons
 * — none of it backed by anything this platform stores or bills in.
 *
 * This is the company mirror of agent-dashboard/Transactions.tsx —
 * same real purchase/rental data (already company-roster-scoped
 * server-side), same detail modal, same confirm action. Revenue.tsx
 * covers the same underlying data with a chart on top; this is the
 * plain filterable table, including a "Pending" tab for transactions
 * still awaiting payment confirmation.
 */
const CompanyTransactionsPage = () => {
  const { data: purchases, isLoading: loadingPurchases } = useGetPurchasesForMyListingsQuery();
  const { data: rentals, isLoading: loadingRentals } = useGetRentalsForMyListingsQuery();
  const [confirmPurchase, { isLoading: confirmingPurchase }] = useConfirmPurchaseMutation();
  const [confirmRental, { isLoading: confirmingRental }] = useConfirmRentalMutation();
  const [approvePurchaseRequest, { isLoading: approvingPurchase }] = useApprovePurchaseRequestMutation();
  const [declinePurchaseRequest, { isLoading: decliningPurchase }] = useDeclinePurchaseRequestMutation();
  const [approveRentalRequest, { isLoading: approvingRental }] = useApproveRentalRequestMutation();
  const [declineRentalRequest, { isLoading: decliningRental }] = useDeclineRentalRequestMutation();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
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

  const filteredTransactions = useMemo(() => {
    return rows.filter((row) => {
      if (activeTab === 'requests') return row.status === 'requested';
      if (activeTab === 'buy') return row.kind === 'purchase';
      if (activeTab === 'rent') return row.kind === 'rental';
      if (activeTab === 'pending') return row.status === 'pending_payment' || row.status === 'processing';
      return true;
    });
  }, [rows, activeTab]);

  const handleConfirm = async (t: AgentTransaction) => {
    if (t.kind === 'purchase') {
      await confirmPurchase(t.id);
    } else {
      await confirmRental(t.id);
    }
    setSelected(null);
  };

  const handleApprove = async (t: AgentTransaction, note: string) => {
    if (t.kind === 'purchase') {
      await approvePurchaseRequest({ id: t.id, note });
    } else {
      await approveRentalRequest({ id: t.id, note });
    }
    setSelected(null);
  };

  const handleDecline = async (t: AgentTransaction, note: string) => {
    if (t.kind === 'purchase') {
      await declinePurchaseRequest({ id: t.id, note });
    } else {
      await declineRentalRequest({ id: t.id, note });
    }
    setSelected(null);
  };

  const requestCount = rows.filter((row) => row.status === 'requested').length;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All Property' },
    { key: 'requests', label: requestCount > 0 ? `Requests (${requestCount})` : 'Requests' },
    { key: 'buy', label: 'Buy' },
    { key: 'rent', label: 'Rent' },
    { key: 'pending', label: 'Pending' },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Transactions</h1>

          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === tab.key ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
            ) : filteredTransactions.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nothing here yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((row) => {
                      const rowKey = `${row.kind}-${row.id}`;
                      const img = imageUrl(row.cover_image);
                      return (
                        <tr key={rowKey} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                {img ? <img src={img} alt={row.property_title} className="w-full h-full object-cover" /> : <Home className="w-4 h-4 text-gray-300" />}
                              </div>
                              <span className="text-sm text-gray-900">{row.property_title}</span>
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
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[row.status] || 'bg-gray-100 text-gray-700'}`}>
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
        onApprove={handleApprove}
        onDecline={handleDecline}
        isApproving={approvingPurchase || approvingRental}
        isDeclining={decliningPurchase || decliningRental}
      />
    </div>
  );
};

export default CompanyTransactionsPage;
