// src/components/dashboards/admin-dashboard/AdminManageCompanies.tsx
import { useState } from 'react';
import { Search, Building2, FileText, XCircle, Loader2, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { cookieManager, TOKEN_COOKIE } from '../../../utils/cookie.ts';
import {
  useGetAdminCompaniesQuery,
  useGetAdminCompanyQuery,
  useVerifyCompanyMutation,
  useRejectCompanyVerificationMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
} from '../../../redux/housebank.ts';

/**
 * Joan, Sep 2026: "the admin cant vet every property, its the company
 * that vets and approves properties. The admin only vets and approves
 * companies." This page used to be a fully hardcoded mock (fake
 * "Dole"/"Bilaad"/"Castle Realty" rows, fake Housebank IDs, a "Join"
 * link copied to the clipboard and nothing else) -- there was no real
 * admin company-verification workflow anywhere in the app, even though
 * the schema (companies.verification_status/verification_notes/
 * verified_by/verified_at) has supported one since the very first
 * migration. This is that workflow, built for real: a queue of
 * companies (pending-first), a detail view with the real uploaded CAC
 * certificate (served through the new gated /admin/companies/:id/
 * cac-document route -- private documents were never downloadable from
 * anywhere in this build before), and Verify / Reject actions that
 * actually flip verification_status and notify the company.
 */

const STATUS_STYLE: Record<string, string> = {
  pending: 'border-orange-400 text-orange-600 bg-orange-50',
  verified: 'border-green-400 text-green-600 bg-green-50',
  rejected: 'border-red-400 text-red-600 bg-red-50',
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

const VerificationBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[status] || 'border-gray-300 text-gray-500 bg-white'}`}>
    {status === 'pending' ? 'Pending Review' : status === 'verified' ? 'Verified' : 'Rejected'}
  </span>
);

type Tab = 'pending' | 'verified' | 'rejected' | 'all';
const TABS: { key: Tab; label: string }[] = [
  { key: 'pending', label: 'Pending Review' },
  { key: 'verified', label: 'Verified' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All Companies' },
];

const AdminManageCompanies = () => {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [detailsId, setDetailsId] = useState<number | null>(null);

  const { data, isLoading } = useGetAdminCompaniesQuery({
    page,
    per_page: perPage,
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
    ...(search ? { q: search } : {}),
  });

  const items = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Companies</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by company name or email..."
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
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">Loading companies…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No companies in this view.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                  <th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">Properties</th>
                  <th className="px-6 py-3 text-left">Realtors</th>
                  <th className="px-6 py-3 text-left">Registered</th>
                  <th className="px-6 py-3 text-left">Verification</th>
                  <th className="px-6 py-3 text-left">Account</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => setDetailsId(c.id)} className="flex items-center gap-3 text-left">
                        {c.logo_path ? (
                          <img src={imageUrl(c.logo_path)!} alt={c.company_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800 hover:text-green-700">{c.company_name}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-gray-700">{c.property_count}</td>
                    <td className="px-6 py-4 text-gray-700">{c.realtor_count}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(c.created_at)}</td>
                    <td className="px-6 py-4"><VerificationBadge status={c.verification_status} /></td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${c.account_status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                        {c.account_status === 'active' ? 'Active' : c.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDetailsId(c.id)}
                        className="text-sm font-medium text-green-700 hover:text-green-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

      {detailsId !== null && <CompanyDetailsModal id={detailsId} onClose={() => setDetailsId(null)} />}
    </div>
  );
};

// ── Detail / verify / reject modal ──────────────────────────────────────────
const CompanyDetailsModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const { data: company, isLoading } = useGetAdminCompanyQuery(id);
  const [verifyCompany, { isLoading: verifying }] = useVerifyCompanyMutation();
  const [rejectCompany, { isLoading: rejecting }] = useRejectCompanyVerificationMutation();
  const [suspendUser, { isLoading: suspending }] = useSuspendUserMutation();
  const [activateUser, { isLoading: activating }] = useActivateUserMutation();

  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState('');
  const [docError, setDocError] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewDocument = async () => {
    setDocError(null);
    setDocLoading(true);
    try {
      const token = cookieManager.get(TOKEN_COOKIE);
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_HOST}admin/companies/${id}/cac-document`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Could not load the CAC document.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      setDocError(e?.message || 'Could not load the CAC document.');
    } finally {
      setDocLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    const result: any = await verifyCompany({ id, notes: notes.trim() || undefined });
    if (result?.error) {
      setError(result.error?.message || 'Could not verify this company.');
      return;
    }
    onClose();
  };

  const handleReject = async () => {
    setError(null);
    if (!notes.trim()) {
      setError('Tell the company why -- a reason is required.');
      return;
    }
    const result: any = await rejectCompany({ id, notes: notes.trim() });
    if (result?.error) {
      setError(result.error?.message || 'Could not reject this company.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Company Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {isLoading || !company ? (
          <p className="text-sm text-gray-500 py-6 text-center">Loading…</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-gray-900">{company.company_name}</h4>
                <VerificationBadge status={company.verification_status} />
              </div>
              <p className="text-sm text-gray-600">{company.email} &middot; {company.phone || 'No phone on file'}</p>
              <p className="text-sm text-gray-600">{company.company_address || 'No address on file'}</p>
              <p className="text-sm text-gray-600">CAC number: <span className="font-medium">{company.cac_number}</span></p>
              <p className="text-xs text-gray-400">Registered {formatDate(company.created_at)}</p>
              {company.verification_notes && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">Last verification note</p>
                  <p className="text-xs text-gray-700">{company.verification_notes}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={viewDocument}
                disabled={docLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {docLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{docLoading ? 'Opening…' : 'View CAC Certificate'}</span>
              </button>
              {docError && <p className="text-xs text-red-600 mt-1.5">{docError}</p>}
            </div>

            <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <p className="text-xs font-medium text-gray-700">Account status</p>
                <p className="text-xs text-gray-500">{company.account_status === 'active' ? 'Active -- can sign in normally.' : `Currently ${company.account_status}.`}</p>
              </div>
              {company.account_status === 'active' ? (
                <button
                  onClick={() => suspendUser(company.user_id)}
                  disabled={suspending}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {suspending ? 'Suspending…' : 'Suspend'}
                </button>
              ) : (
                <button
                  onClick={() => activateUser(company.user_id)}
                  disabled={activating}
                  className="px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 disabled:opacity-50"
                >
                  {activating ? 'Reactivating…' : 'Reactivate'}
                </button>
              )}
            </div>

            {showReject ? (
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Reason for rejection</label>
                <textarea
                  rows={3}
                  maxLength={255}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. CAC certificate doesn't match the company name provided"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white resize-none"
                />
                {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={handleReject}
                    disabled={rejecting}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> {rejecting ? 'Rejecting…' : 'Confirm Rejection'}
                  </button>
                  <button onClick={() => { setShowReject(false); setNotes(''); setError(null); }} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleVerify}
                    disabled={verifying || company.verification_status === 'verified'}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                  >
                    {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{verifying ? 'Verifying…' : company.verification_status === 'verified' ? 'Already Verified' : 'Verify Company'}</span>
                  </button>
                  <button
                    onClick={() => setShowReject(true)}
                    disabled={company.verification_status === 'rejected'}
                    className="flex items-center gap-1.5 px-5 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg disabled:opacity-50"
                  >
                    <ShieldAlert className="w-4 h-4" /> Reject
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminManageCompanies;
