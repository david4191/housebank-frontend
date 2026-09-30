// src/components/dashboards/company-dashboard/CompanyListingReview.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Home, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetCompanyPendingListingsQuery,
  useCompanyApproveListingMutation,
  useCompanyRejectListingMutation,
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

const REASON_MAX = 255;

/**
 * New pre-admin review stage (Joan, Sep 2026 -- "since a realtor can add
 * a Property Listing for a company they are registered under, the
 * company must approve/vet the listing before it shows for anyone to
 * see"). A listing created or re-edited by a realtor attached to this
 * company lands here at `pending_company_review` before it ever
 * reaches HouseBank admin's own queue -- see properties/company-review
 * in hb-backend. Approving does NOT publish the listing; it only hands
 * it on to admin, who still reviews it afterwards. Rejecting here ends
 * it outright with a reason the realtor can see on their own listings.
 */
const CompanyListingReview = () => {
  const { data, isLoading, isFetching } = useGetCompanyPendingListingsQuery();
  const [companyApprove] = useCompanyApproveListingMutation();
  const [companyReject] = useCompanyRejectListingMutation();

  const rows = data?.items || [];

  const [approvingId, setApprovingId] = useState<number | string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);

  const clearRowError = (id: number | string) =>
    setRowError((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleApprove = async (id: number | string) => {
    setApprovingId(id);
    clearRowError(id);
    const result: any = await companyApprove(id);
    setApprovingId(null);
    if (result?.error) {
      setRowError((prev) => ({
        ...prev,
        [id]: result.error?.message || 'Could not approve this listing. Please try again.',
      }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">Listing Review</h1>
              <span className="text-sm text-gray-500">({rows.length})</span>
              {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Listings your realtors have submitted, waiting on your approval before they move on to HouseBank&rsquo;s admin review.
            </p>
          </div>

          {isLoading ? (
            <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <ClipboardCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No listings waiting on your review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realtor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((property: any) => {
                    const img = imageUrl(property.cover_image);
                    const isApproving = approvingId === property.id;
                    return (
                      <tr key={property.id} className="hover:bg-gray-50 align-top">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                              {img ? (
                                <img src={img} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <Home className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <Link to={`/company/property-details/${property.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                              {property.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{property.lister_name || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {[property.city, property.state].filter(Boolean).join(', ') || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{formatNaira(property.price)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{formatDate(property.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(property.id)}
                              disabled={isApproving}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isApproving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              <span>{isApproving ? 'Approving…' : 'Approve'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectTarget(property)}
                              disabled={isApproving}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                          {rowError[property.id] && (
                            <p className="text-xs text-red-600 mt-1.5 max-w-[220px]">{rowError[property.id]}</p>
                          )}
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

      {rejectTarget && (
        <RejectReasonModal
          property={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onReject={companyReject}
        />
      )}
    </div>
  );
};

// ── Reject modal ────────────────────────────────────────────────────────────
// The backend takes one plain `reason` string (max 255 chars), not the
// multi-select category checklist the old, never-wired-to-a-real-endpoint
// company PropertyActionModals.tsx mocked up -- so this keeps that same
// modal shape (dark overlay, white card, textarea + red "reject" action,
// Cancel alongside it) without inventing categories the real API can't
// accept.
const RejectReasonModal = ({
  property,
  onClose,
  onReject,
}: {
  property: any;
  onClose: () => void;
  onReject: (arg: { id: number | string; reason: string }) => any;
}) => {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = reason.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= REASON_MAX;

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    const result: any = await onReject({ id: property.id, reason: trimmed });
    setSubmitting(false);
    if (result?.error) {
      setError(result.error?.message || 'Could not reject this listing. Please try again.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-6">
        <h3 className="text-base font-bold text-gray-900">Reject listing</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          &ldquo;{property.title || 'This property'}&rdquo; will be rejected and won&rsquo;t move on to admin review. Let the realtor know why.
        </p>

        <label className="text-sm font-medium text-gray-700 block mb-1.5">Reason</label>
        <textarea
          rows={4}
          maxLength={REASON_MAX}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="e.g. Photos don't match the listed address"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white resize-none"
        />
        <div className="flex items-center justify-between mt-1 mb-1">
          {touched && !isValid ? (
            <p className="text-xs text-red-600">A reason is required (max {REASON_MAX} characters).</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">{reason.length}/{REASON_MAX}</span>
        </div>

        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !isValid}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Rejecting…' : 'Reject Listing'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyListingReview;
