import { useMemo, useState } from 'react';
import { Search, Filter, CheckCircle, Clock, X, RotateCcw, Loader2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyTransactionsQuery } from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `₦${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function formatDate(value: string | undefined | null) {
  if (!value) return '-';
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

// transactions.type is a fixed backend ENUM — label it for humans rather
// than showing the raw snake_case value.
const TYPE_LABEL: Record<string, string> = {
  property_purchase: 'Buy',
  property_rent: 'Rent',
  investment: 'Invest',
  subscription: 'Subscription',
  investment_withdrawal: 'Withdrawal',
  agent_payout: 'Realtor Payout',
  refund: 'Refund',
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  success: { label: 'Successful', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800', icon: Clock },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800', icon: Loader2 },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800', icon: X },
  refunded: { label: 'Refunded', className: 'bg-gray-200 text-gray-700', icon: RotateCcw },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  paystack: 'Paystack',
  manual_transfer: 'Bank Transfer',
};

type TransactionTab = 'All' | 'Buy' | 'Rent' | 'Invest';
const TAB_TYPE: Record<Exclude<TransactionTab, 'All'>, string> = {
  Buy: 'property_purchase',
  Rent: 'property_rent',
  Invest: 'investment',
};

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState<TransactionTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: result, isLoading } = useGetMyTransactionsQuery({ per_page: 50 });
  const transactions = result?.data || [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t: any) => {
      const matchesTab = activeTab === 'All' || t.type === TAB_TYPE[activeTab as Exclude<TransactionTab, 'All'>];
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const haystack = `${t.uuid} ${TYPE_LABEL[t.type] || t.type}`.toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
      return matchesTab && matchesStatus && matchesSearch;
    });
  }, [transactions, activeTab, statusFilter, searchTerm]);

  const tabs: TransactionTab[] = ['All', 'Buy', 'Rent', 'Invest'];
  const statusOptions = ['success', 'pending', 'processing', 'failed', 'refunded'];

  return (
    <div className="flex-1 bg-gray-50">
      <CustomerHeader />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
                <p className="text-sm text-gray-500 mt-1">{result?.total ?? 0} total</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4 text-gray-600" />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Filter by status</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                            <input
                              type="radio"
                              checked={statusFilter === null}
                              onChange={() => setStatusFilter(null)}
                            />
                            <span>All statuses</span>
                          </label>
                          {statusOptions.map((s) => (
                            <label key={s} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                              <input type="radio" checked={statusFilter === s} onChange={() => setStatusFilter(s)} />
                              <span>{STATUS_CONFIG[s]?.label || s}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab === 'All' ? 'Recent Transactions' : tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading transactions…</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {transactions.length === 0
                ? "No transactions yet — they'll show up here once a purchase, rental, or investment is recorded."
                : 'No transactions match your search/filter.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((t: any) => {
                    const status = STATUS_CONFIG[t.status] || { label: t.status, className: 'bg-gray-100 text-gray-800', icon: Clock };
                    const StatusIcon = status.icon;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{String(t.uuid).slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(t.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{TYPE_LABEL[t.type] || t.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNaira(t.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {PAYMENT_METHOD_LABEL[t.payment_method] || t.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
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

export default TransactionPage;
