// src/components/dashboards/agent-dashboard/AgentNotifications.tsx
import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../../../redux/housebank.ts';

type NotificationCategory = 'all' | 'property' | 'realtor';

/**
 * Notification `type` is a free-form string set by whatever backend
 * module creates it (see hb-backend/src/models/Notification.js). This
 * page deliberately does NOT mirror the customer/company notification
 * pages' "Transaction" tab -- a realtor is never the target of a
 * property_purchase/property_rental/investment notification (those
 * always go to the buyer/tenant/investor; a customer pays the company,
 * not the realtor directly), so that tab would always be empty here.
 * What a realtor actually gets notified about: a customer message, and
 * their company or HouseBank admin acting on one of their listings
 * ('realtor_listing', 'realtor_company' -- see company-agents.routes.js
 * and properties.routes.js/admin.routes.js).
 */
function categoryForType(type: string): NotificationCategory {
  const t = (type || '').toLowerCase();
  if (t.startsWith('property')) return 'property';
  if (t.startsWith('realtor') || t.startsWith('agent')) return 'realtor';
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
 * Joan, Sep 2026: "the same notification and profile settings that
 * customer has, do same for Realtors (agents)". Agents previously had
 * no dedicated Notifications page at all — only the header bell's
 * 5-item preview dropdown, with nowhere for "See all" to actually go.
 *
 * Same GET /notifications backend every role already uses, and the
 * same layout/search/mark-read UX as customer-dashboard/
 * NotificationPage.tsx and company-dashboard/CompanyNotification.tsx —
 * but NOT a field-for-field copy of their tabs (Joan, Sep 2026: "I
 * dont think a realtor needs to see transactions"). A realtor never
 * receives a transaction/payment/investment notification -- those are
 * always addressed to the customer who paid, not the realtor who
 * listed the property -- so the "Transaction" tab those two pages have
 * is deliberately left out here rather than kept for visual
 * consistency with nothing behind it.
 */
const AgentNotifications = () => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data: result, isLoading } = useGetNotificationsQuery({
    per_page: 50,
    ...(unreadOnly ? { unread: 1 as const } : {}),
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = result?.data || [];

  const categories: { key: NotificationCategory; label: string }[] = [
    { key: 'all', label: 'All Notification' },
    { key: 'property', label: 'Property Updates' },
    { key: 'realtor', label: 'Realtor Activities' },
  ];

  const toggleExpansion = (id: number, isRead: boolean) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!isRead) markRead(id);
  };

  const filteredNotifications = notifications.filter((n: any) => {
    const matchesCategory = activeCategory === 'all' || categoryForType(n.type) === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || n.title?.toLowerCase().includes(q) || (n.body && n.body.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full" onClick={() => setShowFilterDropdown(false)}>
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 order-1 md:order-1 self-start md:self-auto">
            Notification
          </h2>

          <div className="relative order-3 md:order-2 w-full md:w-auto mt-3 md:mt-0 flex justify-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="pl-12 pr-12 py-3 border border-gray-300 rounded-full text-sm
                         focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300
                         w-full md:w-80 bg-white"
            />
            <SlidersHorizontal
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                         w-5 h-5 cursor-pointer hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
            />
            {showFilterDropdown && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3">
                  <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unreadOnly}
                      onChange={(e) => setUnreadOnly(e.target.checked)}
                      className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm text-gray-700">Unread only</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
            className="text-sm text-gray-600 hover:text-gray-800 order-2 md:order-3 self-end md:self-auto mt-3 md:mt-0 disabled:opacity-50"
          >
            Mark all as read
          </button>
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
              <p className="text-gray-500">Loading notifications…</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                {notifications.length === 0 ? 'No notifications yet.' : 'No notifications match your search.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification: any, index: number) => (
              <div
                key={notification.id}
                className={`bg-white border-l border-r border-gray-200 px-6 py-4 ${
                  index === 0 ? 'border-t rounded-t-lg' : ''
                } ${
                  index === filteredNotifications.length - 1 ? 'border-b rounded-b-lg' : 'border-b'
                } ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpansion(notification.id, notification.is_read)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedIds.has(notification.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{notification.title}</span>
                    {!notification.is_read && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 ml-4">{timeAgo(notification.created_at)}</span>
                </div>

                {expandedIds.has(notification.id) && notification.body && (
                  <div className="mt-3 ml-7">
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.body}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AgentNotifications;
