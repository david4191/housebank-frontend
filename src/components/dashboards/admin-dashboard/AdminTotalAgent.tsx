// src/components/dashboards/admin-dashboard/AdminTotalAgent.tsx
import { useState } from 'react';
import { Search, User as UserIcon, ShieldOff, ShieldCheck } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminRealtorsQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
} from '../../../redux/housebank.ts';

/**
 * Joan, Sep 2026: "/admin/realtors ... fix and correct the static
 * pages". This page used to be eleven hardcoded fake realtors with
 * randomuser.me photos and stat cards that never moved ("342 Total
 * Realtor", "1,230 Total Realtor" -- inconsistent even with itself).
 * Replaced with the real cross-company realtor directory
 * (AgentProfile.listForAdmin / GET /admin/realtors) plus the one
 * account action that's actually real here: suspend/reactivate
 * (users.status is already enforced at signin/refresh, so this has
 * teeth within the access token's lifetime).
 *
 * Scope note: admin does NOT verify individual realtors' identity
 * here -- Joan's correction this window was specifically "the admin
 * only vets and approves companies." A realtor's own
 * verification_status (agent_profiles.verification_status) is left
 * alone; this page is a directory + account-status control only.
 */

const ACCOUNT_STYLE: Record<string, string> = {
  active: 'border-green-400 text-green-600 bg-green-50',
  suspended: 'border-red-400 text-red-600 bg-red-50',
  banned: 'border-gray-400 text-gray-600 bg-gray-100',
  pending_verification: 'border-orange-400 text-orange-600 bg-orange-50',
};

const ACCOUNT_LABEL: Record<string, string> = {
  active: 'Active',
  suspended: 'Suspended',
  banned: 'Banned',
  pending_verification: 'Unverified Signup',
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

type Tab = 'all' | 'active' | 'pending_verification' | 'suspended' | 'banned';
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Realtors' },
  { key: 'active', label: 'Active' },
  { key: 'pending_verification', label: 'Unverified Signups' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'banned', label: 'Banned' },
];

const AdminTotalAgent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [pendingId, setPendingId] = useState<number | null>(null);

  const { data, isLoading } = useGetAdminRealtorsQuery({
    page,
    per_page: perPage,
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
    ...(search ? { q: search } : {}),
  });

  const [suspendUser] = useSuspendUserMutation();
  const [activateUser] = useActivateUserMutation();

  const items = data?.items || [];
  const total = data?.total || 0;

  const toggleStatus = async (userId: number, isSuspendedOrBanned: boolean) => {
    setPendingId(userId);
    try {
      if (isSuspendedOrBanned) {
        await activateUser(userId);
      } else {
        await suspendUser(userId);
      }
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Realtors {total ? `(${total})` : ''}</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, company or email..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 w-full md:w-80 bg-white"
            />
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setPage(1); }}
                className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === t.key ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">Loading realtors…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No realtors in this view.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                    <th className="px-6 py-3 text-left">Realtor</th>
                    <th className="px-6 py-3 text-left">Company</th>
                    <th className="px-6 py-3 text-left">Listed Properties</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Phone</th>
                    <th className="px-6 py-3 text-left">Date Registered</th>
                    <th className="px-6 py-3 text-left">Account</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((a: any) => {
                    const suspendedOrBanned = a.account_status === 'suspended' || a.account_status === 'banned';
                    return (
                      <tr key={a.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          <div className="flex items-center gap-3">
                            {a.avatar_path ? (
                              <img src={imageUrl(a.avatar_path)!} alt={a.full_name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            {a.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{a.company_name || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium text-center">{a.property_count}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{a.email}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{a.phone || '—'}</td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(a.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ACCOUNT_STYLE[a.account_status] || 'border-gray-300 text-gray-500 bg-white'}`}>
                            {ACCOUNT_LABEL[a.account_status] || a.account_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(a.user_id, suspendedOrBanned)}
                            disabled={pendingId === a.user_id}
                            className={`flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 ${
                              suspendedOrBanned ? 'text-green-700 hover:text-green-800' : 'text-red-600 hover:text-red-700'
                            }`}
                          >
                            {suspendedOrBanned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                            {pendingId === a.user_id ? (suspendedOrBanned ? 'Reactivating…' : 'Suspending…') : (suspendedOrBanned ? 'Reactivate' : 'Suspend')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {total > perPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40">
                  Previous
                </button>
                <span>Page {page} of {Math.max(1, Math.ceil(total / perPage))} &middot; {total} total</span>
                <button onClick={() => setPage((p) => (p * perPage < total ? p + 1 : p))} disabled={page * perPage >= total} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default AdminTotalAgent;
