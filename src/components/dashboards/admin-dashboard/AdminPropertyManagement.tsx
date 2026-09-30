import { useState } from 'react';
import { Search, MoreVertical, X, Flag, ShieldOff, CheckCircle, XCircle, MessageSquareWarning } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminPropertiesQuery,
  useGetAdminPropertyQuery,
  useFlagPropertyMutation,
  useUnflagPropertyMutation,
  useBlockPropertyMutation,
  useGetAdminAppealsQuery,
  useResolveAppealMutation,
} from '../../../redux/housebank.ts';

/** property_images.file_path is stored (and returned by the API) already
 * as "uploads/<subfolder>/<file>" -- see hb-backend's
 * src/utils/fileUpload.js storeImage(). VITE_APP_BACKEND_HOST already
 * ends in "/", so this is a plain concatenation, not another "uploads/".
 * Same helper as every other property-image consumer in this codebase
 * (TopOffers, ExploreProperty, CompanyProperty, MyProperty, ...) --
 * this admin page was the one place still rendering the raw relative
 * path straight into <img src>, which resolves against the Vite dev
 * origin (5173) instead of the API origin and so never loads. */
function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Joan, Sep 2026: "admin/properties" was still static — a hardcoded
// PROPERTIES array plus an elaborate Sold/Rented/Investment mock (fake
// payment progress, fake license numbers, Lorem Ipsum descriptions)
// that was never wired to the real property_purchases/property_rentals/
// investments tables at all. This rewrite drops that duplicate fake
// system entirely — Sold and Rented are just two more real `status`
// values on the same properties table (Property.markSold/markRented
// already flip them when a purchase/rental completes elsewhere), so
// one real query with a status filter covers every tab honestly. Actual
// payment/transaction detail belongs on a Transactions page, not here.
//
// This also adds what Joan specifically asked for: "admin also can
// manage properties, flag a property if theres an issue, block a
// property in which the company will/must appeal" — Flag (soft, stays
// live), Block (hard, drops out of public search until an appeal is
// approved), and an Appeals queue to resolve them. See
// hb-backend/src/modules/admin/admin.routes.js and
// src/models/{Property,PropertyAppeal}.js for the backend side.
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'all' | 'awaiting_company' | 'approved' | 'flagged' | 'blocked' | 'rejected' | 'sold' | 'rented' | 'appeals';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Properties' },
  { key: 'awaiting_company', label: 'Awaiting Company Review' },
  { key: 'approved', label: 'Live' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'sold', label: 'Sold' },
  { key: 'rented', label: 'Rented' },
  { key: 'appeals', label: 'Appeals' },
];

const STATUS_STYLE: Record<string, string> = {
  draft: 'border-gray-300 text-gray-500',
  pending_company_review: 'border-orange-400 text-orange-500',
  pending: 'border-orange-400 text-orange-500',
  approved: 'border-green-400 text-green-600',
  rejected: 'border-red-400 text-red-500',
  sold: 'border-blue-300 text-blue-500',
  rented: 'border-blue-300 text-blue-500',
  archived: 'border-gray-300 text-gray-400',
  blocked: 'border-red-500 text-red-600 bg-red-50',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  pending_company_review: 'Awaiting Company',
  pending: 'Pending Review',
  approved: 'Live',
  rejected: 'Rejected',
  sold: 'Sold',
  rented: 'Rented',
  archived: 'Archived',
  blocked: 'Blocked',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-white ${STATUS_STYLE[status] || 'border-gray-300 text-gray-500'}`}>
    {STATUS_LABEL[status] || status}
  </span>
);

function formatMoney(price: string | number, currency: string) {
  const n = Number(price);
  if (Number.isNaN(n)) return `${currency} ${price}`;
  const symbol = currency === 'NGN' ? '₦' : `${currency} `;
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(0)}K`;
  return `${symbol}${n}`;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Reason modal — shared shape for Reject / Flag / Block
// ─────────────────────────────────────────────────────────────────────────────
const ReasonModal = ({
  title, description, actionLabel, actionColor, placeholder, onSubmit, onClose, submitting,
}: {
  title: string; description: string; actionLabel: string; actionColor: string; placeholder: string;
  onSubmit: (reason: string) => void; onClose: () => void; submitting: boolean;
}) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
        <textarea
          rows={4}
          placeholder={placeholder}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <div className="flex gap-3 pt-1">
          <button
            disabled={!reason.trim() || submitting}
            onClick={() => onSubmit(reason.trim())}
            className={`flex-1 py-3 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${actionColor}`}
          >
            {submitting ? 'Submitting…' : actionLabel}
          </button>
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Property Details Modal — real data via GET /admin/properties/:id
// ─────────────────────────────────────────────────────────────────────────────
const PropertyDetailsModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const { data: prop, isLoading } = useGetAdminPropertyQuery(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Property Details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {isLoading || !prop ? (
          <p className="p-8 text-center text-gray-500">Loading…</p>
        ) : (
          <div className="p-6 space-y-5">
            {prop.images?.length > 0 && (
              <div className="flex gap-2 h-52 overflow-x-auto">
                {prop.images.map((img: any) => (
                  <img key={img.id} src={imageUrl(img.file_path) || ''} alt="" className="h-full rounded-lg object-cover flex-shrink-0" />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{prop.title}</h3>
              <StatusBadge status={prop.status} />
            </div>
            <p className="text-xl font-bold text-green-600">{formatMoney(prop.price, prop.currency)}</p>
            <p className="text-sm text-gray-500">{prop.address}, {prop.city}, {prop.state}</p>
            {prop.description && <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>}

            {prop.flag_reason && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-orange-800 mb-1">Flagged</h4>
                <p className="text-xs text-orange-700">{prop.flag_reason}</p>
              </div>
            )}
            {prop.blocked_reason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-red-800 mb-1">Blocked</h4>
                <p className="text-xs text-red-700">{prop.blocked_reason}</p>
              </div>
            )}
            {prop.rejection_reason && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-1">Rejection Reason</h4>
                <p className="text-xs text-gray-600">{prop.rejection_reason}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Listed By</h4>
                <p className="text-sm text-gray-700">{prop.lister_name || '—'}</p>
                <p className="text-xs text-gray-500">{prop.lister_phone || 'No phone on file'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Company</h4>
                <p className="text-sm text-gray-700">{prop.company_name || 'Independent listing'}</p>
                {prop.company_verification_status && (
                  <p className="text-xs text-gray-500 capitalize">{prop.company_verification_status}</p>
                )}
              </div>
            </div>

            {prop.appeals?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Appeal History</h4>
                <div className="space-y-2">
                  {prop.appeals.map((a: any) => (
                    <div key={a.id} className="border border-gray-100 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${a.status === 'approved' ? 'text-green-600' : a.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                        <span className="text-gray-400">{formatDate(a.created_at)}</span>
                      </div>
                      <p className="text-gray-600">{a.message}</p>
                      {a.admin_response && <p className="text-gray-500 mt-1">HouseBank: {a.admin_response}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Appeals Tab
// ─────────────────────────────────────────────────────────────────────────────
const AppealsTab = () => {
  const { data, isLoading } = useGetAdminAppealsQuery({ per_page: 30 });
  const [resolveAppeal, { isLoading: resolving }] = useResolveAppealMutation();
  const [respondingTo, setRespondingTo] = useState<{ id: number; decision: 'approved' | 'rejected' } | null>(null);

  const appeals = data?.items || [];

  const submit = async (response: string) => {
    if (!respondingTo) return;
    await resolveAppeal({ id: respondingTo.id, decision: respondingTo.decision, response });
    setRespondingTo(null);
  };

  if (isLoading) return <p className="p-8 text-center text-gray-500">Loading appeals…</p>;

  if (appeals.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        No pending appeals. Appeals show up here after a company or realtor appeals a blocked listing.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appeals.map((a: any) => (
        <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900">{a.property_title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{a.submitted_by_name || a.submitted_by_email} &middot; {formatDate(a.created_at)}</p>
              <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs font-medium text-red-700 mb-1">Why it was blocked</p>
                <p className="text-xs text-red-600">{a.blocked_reason}</p>
              </div>
              <div className="mt-2 bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-1">Their appeal</p>
                <p className="text-xs text-gray-700">{a.message}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => setRespondingTo({ id: a.id, decision: 'approved' })}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => setRespondingTo({ id: a.id, decision: 'rejected' })}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </div>
        </div>
      ))}

      {respondingTo && (
        <ReasonModal
          title={respondingTo.decision === 'approved' ? 'Approve Appeal' : 'Reject Appeal'}
          description={
            respondingTo.decision === 'approved'
              ? 'The listing goes back live immediately. Add a short note for the company/realtor (optional context, still required here to keep a record).'
              : 'The listing stays blocked. Explain why so the company/realtor understands what needs to change.'
          }
          actionLabel={respondingTo.decision === 'approved' ? 'Approve & Reinstate' : 'Reject Appeal'}
          actionColor={respondingTo.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}
          placeholder="Response to the company/realtor..."
          submitting={resolving}
          onSubmit={submit}
          onClose={() => setRespondingTo(null)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const AdminPropertyManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [flaggingId, setFlaggingId] = useState<number | null>(null);
  const [blockingId, setBlockingId] = useState<number | null>(null);

  const statusParam =
    activeTab === 'all' || activeTab === 'appeals' ? undefined
    : activeTab === 'awaiting_company' ? 'pending_company_review'
    : activeTab;

  const { data, isLoading, error } = useGetAdminPropertiesQuery(
    activeTab === 'appeals' ? undefined : {
      page,
      per_page: perPage,
      ...(statusParam ? { status: statusParam } : {}),
      ...(activeTab === 'flagged' ? { flagged: 1 } : {}),
      ...(search ? { q: search } : {}),
    },
    { skip: activeTab === 'appeals' }
  );

  const [flagProperty, { isLoading: flagging }] = useFlagPropertyMutation();
  const [unflagProperty] = useUnflagPropertyMutation();
  const [blockProperty, { isLoading: blocking }] = useBlockPropertyMutation();

  const items = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="flex flex-col h-full" onClick={() => setActionMenuId(null)}>
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Properties</h2>
          {activeTab !== 'appeals' && (
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by title..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 w-full md:w-80 bg-white"
              />
            </div>
          )}
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

        {activeTab === 'appeals' ? (
          <AppealsTab />
        ) : isLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">Loading properties…</div>
        ) : error ? (
          // Distinct from a genuinely empty result on purpose — a failed
          // request (e.g. a database migration this page's columns
          // depend on not having been run yet) used to render as an
          // identical, silent "No properties in this view.", which is
          // exactly what a real bug looks like when nothing is wrong
          // with the data. This surfaces the real message instead.
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center text-red-600">
            Couldn't load properties — {(error as any)?.data?.message || (error as any)?.message || 'a server error occurred'}.
            {(error as any)?.status === 500 && ' This usually means a database migration this page depends on hasn\'t been run yet.'}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No properties in this view.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                  <th className="px-6 py-3 text-left">Property</th>
                  <th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Realtor</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Listed</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => setDetailsId(p.id)} className="flex items-center gap-3 text-left">
                        {p.cover_image ? (
                          <img src={imageUrl(p.cover_image) || ''} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                        )}
                        <span className="font-medium text-gray-800 hover:text-green-700">{p.title}</span>
                        {p.flagged_at && <Flag className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.company_name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{p.lister_name || '—'}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{formatMoney(p.price, p.currency)}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === p.id ? null : p.id); }}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {actionMenuId === p.id && (
                        <div className="absolute right-6 top-10 z-20 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { setDetailsId(p.id); setActionMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            View Details
                          </button>
                          {p.status === 'pending_company_review' && (
                            <p className="px-4 py-2 text-xs text-gray-400">Awaiting the listing company's own review — not admin's to approve.</p>
                          )}
                          {p.status !== 'blocked' && p.status !== 'pending_company_review' && (
                            p.flagged_at ? (
                              <button
                                onClick={() => { unflagProperty(p.id); setActionMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Flag className="w-3.5 h-3.5" /> Clear Flag
                              </button>
                            ) : (
                              <button
                                onClick={() => { setFlaggingId(p.id); setActionMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                              >
                                <MessageSquareWarning className="w-3.5 h-3.5" /> Flag Listing
                              </button>
                            )
                          )}
                          {p.status !== 'blocked' && p.status !== 'pending_company_review' && (
                            <button
                              onClick={() => { setBlockingId(p.id); setActionMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                            >
                              <ShieldOff className="w-3.5 h-3.5" /> Block Listing
                            </button>
                          )}
                          {p.status === 'blocked' && (
                            <p className="px-4 py-2 text-xs text-gray-400">Blocked — resolve via the Appeals tab once the company appeals.</p>
                          )}
                        </div>
                      )}
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

      {detailsId !== null && <PropertyDetailsModal id={detailsId} onClose={() => setDetailsId(null)} />}

      {flaggingId !== null && (
        <ReasonModal
          title="Flag Listing"
          description="This keeps the listing live but records a concern and notifies whoever listed it. Use Block instead if it needs to come down immediately."
          actionLabel="Flag Listing"
          actionColor="bg-orange-500 hover:bg-orange-600"
          placeholder="What's the concern?"
          submitting={flagging}
          onSubmit={async (reason) => { await flagProperty({ id: flaggingId, reason }); setFlaggingId(null); }}
          onClose={() => setFlaggingId(null)}
        />
      )}

      {blockingId !== null && (
        <ReasonModal
          title="Block Listing"
          description="This removes the listing from public view immediately. It only comes back if the company/realtor appeals and you approve the appeal."
          actionLabel="Block Listing"
          actionColor="bg-red-600 hover:bg-red-700"
          placeholder="Reason for blocking..."
          submitting={blocking}
          onSubmit={async (reason) => { await blockProperty({ id: blockingId, reason }); setBlockingId(null); }}
          onClose={() => setBlockingId(null)}
        />
      )}
    </div>
  );
};

export default AdminPropertyManagement;
