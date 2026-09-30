import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import CustomerHeader from './CustomerHeader';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../../../redux/housebank.ts';

// Type definitions
type NotificationCategory = 'all' | 'property' | 'realtor' | 'transaction';

/**
 * Notification `type` is a free-form string set by whatever backend
 * module creates it (see hb-backend/src/models/Notification.js) — today
 * only 'investment' exists, but property/realtor-related types are
 * expected as more modules land. This buckets a real type string into
 * one of the page's tabs without assuming an exact fixed vocabulary.
 */
function categoryForType(type: string): NotificationCategory {
  const t = (type || '').toLowerCase();
  if (t.startsWith('property')) return 'property';
  if (t.startsWith('realtor') || t.startsWith('agent')) return 'realtor';
  if (t.startsWith('transaction') || t.startsWith('payment') || t.startsWith('investment')) return 'transaction';
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

const NotificationPage = () => {
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
    { key: 'transaction', label: 'Transaction' },
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
    <div className="flex-1 bg-gray-50 min-h-screen" onClick={() => setShowFilterDropdown(false)}>
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        {/* Page Header with Search and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative">
          {/* Left: Title */}
          <h2 className="text-2xl font-bold text-gray-900 order-1 md:order-1 self-start md:self-auto">
            Notification
          </h2>

          {/* Center: Search */}
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

            {/* Filter Icon */}
            <SlidersHorizontal
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                         w-5 h-5 cursor-pointer hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
            />

            {/* Filter Dropdown — the only real filter the API supports today is
                unread-only, so that's the only option offered here. */}
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

          {/* Right: Mark all as read */}
          <button
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
            className="text-sm text-gray-600 hover:text-gray-800 order-2 md:order-3 self-end md:self-auto mt-3 md:mt-0 disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>

        {/* Category Tabs */}
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

        {/* Notifications List */}
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
      </div>
    </div>
  );
};

export default NotificationPage;
