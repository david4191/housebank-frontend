// src/components/dashboards/admin-dashboard/AdminNotifications.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetAdminNotificationsQuery } from '../../../redux/housebank.ts';

type NotificationCategory = 'all' | 'property' | 'realtor' | 'account' | 'message';

const ROLE_LABELS: Record<string, string> = {
  customer: 'Customer',
  agent: 'Realtor',
  company: 'Company',
  admin: 'Admin',
};

/**
 * Notification `type` is a free-form string set by whatever backend
 * module creates it (see hb-backend/src/models/Notification.js) — this
 * buckets a real type string into one of the page's tabs without
 * assuming an exact fixed vocabulary.
 */
function categoryForType(type: string): NotificationCategory {
  const t = (type || '').toLowerCase();
  if (t.startsWith('property')) return 'property';
  if (t.startsWith('realtor') || t.startsWith('agent')) return 'realtor';
  if (t.startsWith('message')) return 'message';
  if (t.startsWith('company') || t.startsWith('account') || t.startsWith('auth')) return 'account';
  return 'all';
}

function timeAgo(isoLike: string) {
  const then = new Date(isoLike.replace(' ', 'T') + 'Z').getTime();
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

/**
 * Joan, Sep 2026: "realtors notifications is meant to come from the
 * companys... lastly ... admins notification is meant to emcompass all
 * users and not this" — the version that shipped first was a straight
 * copy of the customer notifications page: GET /notifications, scoped
 * to the logged-in user's own user_id. For admin that's structurally
 * broken, not just wrong-looking — nothing in the backend ever creates
 * a Notification row addressed to admin's own account (grepped every
 * Notification.create() call site to confirm), so that page could
 * never show anything but "No notifications yet," forever, no matter
 * what happened on the platform.
 *
 * This is the real fix: GET /admin/notifications (Notification.
 * platformFeed on the backend) returns every notification generated
 * for every user across the whole platform — new messages, listing
 * approvals/rejections, company invites, purchases/rentals/
 * investments, 2FA events — tagged with who it was actually for. That
 * is what "encompass all users" means literally, so that's what this
 * page now shows: a real activity stream, not a personal inbox that
 * can never fill.
 *
 * Read/unread and "mark as read" don't have an honest meaning here —
 * is_read reflects whether the *recipient* has seen it, not admin, and
 * admin marking someone else's notification "read" would be misleading
 * — so both are dropped in favor of showing who each item was for.
 */
const AdminNotifications = () => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 30;

  const { data: result, isLoading } = useGetAdminNotificationsQuery({ page, per_page: perPage });
  const notifications = result?.data || [];
  const total = result?.total || 0;

  const categories: { key: NotificationCategory; label: string }[] = [
    { key: 'all', label: 'All Activity' },
    { key: 'property', label: 'Property Updates' },
    { key: 'realtor', label: 'Realtor Activities' },
    { key: 'message', label: 'Messages' },
    { key: 'account', label: 'Accounts & Companies' },
  ];

  const filteredNotifications = notifications.filter((n: any) => {
    const matchesCategory = activeCategory === 'all' || categoryForType(n.type) === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.title?.toLowerCase().includes(q) ||
      (n.body && n.body.toLowerCase().includes(q)) ||
      (n.recipient_name && n.recipient_name.toLowerCase().includes(q)) ||
      (n.recipient_email && n.recipient_email.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Platform Activity</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Every notification sent to every user on HouseBank — {total} total.
            </p>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content, or user..."
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-full text-sm
                         focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300
                         w-full md:w-96 bg-white"
            />
          </div>
        </div>

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

        <div className="space-y-0">
          {isLoading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Loading activity…</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                {notifications.length === 0 ? 'No activity on the platform yet.' : 'No activity matches your search.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification: any, index: number) => (
              <div
                key={notification.id}
                className={`bg-white border-l border-r border-gray-200 px-6 py-4 ${
                  index === 0 ? 'border-t rounded-t-lg' : ''
                } ${index === filteredNotifications.length - 1 ? 'border-b rounded-b-lg' : 'border-b'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-900">{notification.title}</span>
                    {notification.body && (
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.body}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      For:{' '}
                      <span className="font-medium text-gray-600">
                        {notification.recipient_name || notification.recipient_email}
                      </span>{' '}
                      ({ROLE_LABELS[notification.recipient_role] ?? notification.recipient_role})
                      {!notification.is_read && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle" title="Not yet read by recipient" />
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {timeAgo(notification.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {total > perPage && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.max(1, Math.ceil(total / perPage))}
            </span>
            <button
              onClick={() => setPage((p) => (p * perPage < total ? p + 1 : p))}
              disabled={page * perPage >= total}
              className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminNotifications;
