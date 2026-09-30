import { useState } from 'react';
import { Star, X, Loader2, Trash2, EyeOff, Eye, Flag } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from '../../../redux/housebank.ts';

/**
 * Joan, Sep 2026: "fix ... http://localhost:5173/admin/reviews". The
 * old page was 100% hardcoded (a fake REVIEWS array, a fake Reply
 * modal with no send handler, fake Delete confirm/success screens).
 * This is the real moderation inbox against the `reviews` table
 * (Review.js / reviews.routes.js) — hide, unhide, flag, or delete.
 *
 * Scope note: the `reviews` table has existed in schema.sql since
 * early in the build, but there is no review-SUBMISSION surface
 * anywhere in the app yet — no "leave a review" button on any
 * customer/agent/company page. That's a real, separate gap (building
 * it means designing where a customer reviews an agent/company/
 * property, which wasn't part of what Joan asked to fix here), so
 * until that exists this page will honestly show zero reviews rather
 * than fabricate data. The old page's "Reply" action is dropped
 * entirely for the same honesty reason: nothing in the product would
 * ever show that reply back to the reviewee.
 */

const STATUS_STYLE: Record<string, string> = {
  visible: 'border-green-400 text-green-600 bg-green-50',
  hidden: 'border-gray-300 text-gray-500 bg-gray-50',
  flagged: 'border-red-400 text-red-600 bg-red-50',
};

const STATUS_LABEL: Record<string, string> = {
  visible: 'Visible',
  hidden: 'Hidden',
  flagged: 'Flagged',
};

const REVIEWEE_LABEL: Record<string, string> = {
  agent: 'Realtor',
  company: 'Company',
  property: 'Property',
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

type StatusTab = 'all' | 'visible' | 'hidden' | 'flagged';
const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'all', label: 'All Reviews' },
  { key: 'visible', label: 'Visible' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'hidden', label: 'Hidden' },
];

const Reviews = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading } = useGetAdminReviewsQuery({
    page,
    per_page: perPage,
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
  });

  const items = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews {total ? `(${total})` : ''}</h2>
        </div>

        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-6">
            {STATUS_TABS.map((t) => (
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
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">Loading reviews…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
            No reviews {activeTab !== 'all' ? `in "${STATUS_LABEL[activeTab]}"` : 'yet'}. Reviews will show up here
            once customers start leaving them for realtors, companies, and properties.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                    <th className="px-6 py-3 text-left">Reviewer</th>
                    <th className="px-6 py-3 text-left">Reviewing</th>
                    <th className="px-6 py-3 text-left">Rating</th>
                    <th className="px-6 py-3 text-left">Comment</th>
                    <th className="px-6 py-3 text-left">Submitted</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((r: any) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700">
                        {r.reviewer_name || <span className="text-gray-400">—</span>}
                        <div className="text-xs text-gray-400">{r.reviewer_email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="text-xs text-gray-400 block">{REVIEWEE_LABEL[r.reviewee_type] || r.reviewee_type}</span>
                        {r.reviewee_name || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4"><Stars rating={r.rating} /></td>
                      <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">{r.comment || '—'}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[r.status] || 'border-gray-300 text-gray-500 bg-white'}`}>
                          {STATUS_LABEL[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelected(r)} className="text-sm font-medium text-green-700 hover:text-green-800">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
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

      {selected && <ReviewManageModal review={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

const ReviewManageModal = ({ review, onClose }: { review: any; onClose: () => void }) => {
  const [updateStatus, { isLoading: updating }] = useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setStatus = async (status: 'visible' | 'hidden' | 'flagged') => {
    setError(null);
    const result: any = await updateStatus({ id: review.id, status });
    if (result?.error) {
      setError(result.error?.message || 'Could not update this review.');
      return;
    }
    onClose();
  };

  const handleDelete = async () => {
    setError(null);
    const result: any = await deleteReview(review.id);
    if (result?.error) {
      setError(result.error?.message || 'Could not delete this review.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-gray-500 mb-1 block">{REVIEWEE_LABEL[review.reviewee_type] || review.reviewee_type}</span>
            <h3 className="text-base font-bold text-gray-900">Review #{review.id}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3 mb-5 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Reviewer</p>
            <p className="text-gray-800">{review.reviewer_name}</p>
            <p className="text-gray-500 text-xs">{review.reviewer_email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">About</p>
            <p className="text-gray-800">{review.reviewee_name || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Rating</p>
            <Stars rating={review.rating} />
          </div>
          {review.comment && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Comment</p>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{review.comment}</p>
            </div>
          )}
          <p className="text-xs text-gray-400">Submitted {formatDate(review.created_at)}</p>
        </div>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        {!confirmDelete ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatus('visible')}
              disabled={updating || review.status === 'visible'}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Eye className="w-3.5 h-3.5" /> {review.status === 'visible' ? 'Currently Visible' : 'Make Visible'}
            </button>
            <button
              onClick={() => setStatus('hidden')}
              disabled={updating || review.status === 'hidden'}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <EyeOff className="w-3.5 h-3.5" /> {review.status === 'hidden' ? 'Currently Hidden' : 'Hide'}
            </button>
            <button
              onClick={() => setStatus('flagged')}
              disabled={updating || review.status === 'flagged'}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
              {review.status === 'flagged' ? 'Currently Flagged' : 'Flag'}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-3">Delete this review permanently? This can't be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
