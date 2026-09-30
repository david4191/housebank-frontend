import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, ExternalLink, LogOut, Search } from "lucide-react";
import useAuth from "../../../hooks/useAuth.tsx";
import {
  useGetMyProfileQuery,
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
} from "../../../redux/housebank.ts";

function avatarUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}


/** Same fix as the customer header's dropdown bug: one shared
 * click-outside ref on the whole controls row, not one per dropdown —
 * see CustomerHeader.tsx (customer-dashboard) for the full writeup of
 * why per-menu refs break Settings/Log Out-style clicks. This header
 * had no working dropdown at all before (hardcoded "John", a stock
 * photo, no click handlers anywhere), so there's no old bug to
 * preserve — this is the same fix applied from scratch. */
function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function timeAgo(isoLike: string) {
  const then = new Date(isoLike.replace(" ", "T") + "Z").getTime();
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

const ROLE_LABELS: Record<string, string> = {
  customer: 'Customer',
  agent: 'Realtor',
  company: 'Company',
  admin: 'Admin',
};

const CustomerHeader = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const displayName = auth.user?.full_name || auth.user?.email || "Account";
  const roleLabel = auth.user?.role
    ? ROLE_LABELS[auth.user.role] ?? (auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1))
    : "Realtor";

  const { data: profile, isLoading: profileLoading } = useGetMyProfileQuery();
  const avatar = avatarUrl(profile?.profile?.avatar_path || profile?.profile?.logo_path);

  const { data: unread } = useGetUnreadNotificationCountQuery();
  const { data: notificationsResult } = useGetNotificationsQuery({ per_page: 5 });
  const [markRead] = useMarkNotificationReadMutation();

  const [openMenu, setOpenMenu] = useState<"profile" | "notifications" | "language" | null>(null);
  const closeMenu = () => setOpenMenu(null);
  const controlsRef = useClickOutside(closeMenu);

  const handleLogout = async () => {
    closeMenu();
    await auth.logout(() => navigate("/signin", { replace: true }));
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <Link
            to="/realtor-landing"
            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-green-700 border border-gray-200 rounded-full px-3 py-1 transition-colors"
            aria-label="View Website"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">View Website</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6" ref={controlsRef}>
          {/* Search Bar — hidden on small screens, same as the customer
              header, since it doesn't filter anything yet and eats the
              whole row on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-56 lg:w-80"
            />
          </div>

          {/* Language Selector — only English is actually supported today;
              honest about that rather than pretending to switch languages. */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
              className="flex items-center space-x-2"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">🇺🇸</span>
              </div>
              <span className="text-sm text-gray-700 hidden lg:inline">Eng (US)</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {openMenu === "language" && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 flex items-center justify-between">
                  Eng (US)
                  <span className="text-green-600 text-xs">Selected</span>
                </div>
                <div className="px-3 py-2 text-xs text-gray-400">More languages coming soon</div>
              </div>
            )}
          </div>

          {/* Notification Bell — real unread count + real list, same as
              the customer header */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
              className="relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {!!unread?.count && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unread.count > 9 ? "9+" : unread.count}
                </span>
              )}
            </button>
            {openMenu === "notifications" && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-900">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(notificationsResult?.data || []).length === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet.</p>
                  ) : (
                    notificationsResult!.data.map((n: any) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => !n.is_read && markRead(n.id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                          n.is_read ? "" : "bg-green-50/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{n.title}</span>
                          <span className="text-xs text-gray-400">{timeAgo(n.created_at)}</span>
                        </div>
                        {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                      </button>
                    ))
                  )}
                </div>
                <Link
                  to="/agent/notifications"
                  onClick={closeMenu}
                  className="block text-center text-sm text-green-600 hover:text-green-700 py-2 border-t border-gray-100"
                >
                  See all
                </Link>
              </div>
            )}
          </div>

          {/* User Profile — real name/role/initials-avatar, real Log Out. */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-semibold overflow-hidden flex-shrink-0">
                {avatar && !profileLoading ? (
                  <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initialsFor(displayName)
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-gray-900">{displayName}</span>
                <span className="text-xs text-gray-500">{roleLabel}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {openMenu === "profile" && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <div className="px-4 py-2 sm:hidden border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{roleLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2 text-gray-400" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
