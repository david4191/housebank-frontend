import { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  LogOut,
  Building,
  FileText,
  DollarSign,
  Star,
  Bell,
UserCircle,
Receipt,
LifeBuoy,
Sparkles,
Menu,
X,
Settings,
ClipboardCheck,
Newspaper,
FileEdit

} from 'lucide-react';
import { DashboardSidebarProps, MenuItem } from '../../types/menu';
import logo from '../../assets/logo.png';
import logo1 from '../../assets/logo1.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth.tsx';

// Import custom icons
import overview from '../../assets/sidebar/overview.png';
import notifications from '../../assets/sidebar/notification.png';
import property from '../../assets/sidebar/properties.png';
import realtor from '../../assets/sidebar/realtor.png';
import transactions from '../../assets/sidebar/transaction.png';
import settings from '../../assets/sidebar/settings.png';
import help from '../../assets/sidebar/help.png';
import messages from '../../assets/sidebar/messages.png';
import document from '../../assets/sidebar/document.png';

const DashboardSidebar = ({ userRole = 'customer', onMenuClick }: DashboardSidebarProps) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  // Self-contained mobile drawer state. Every page that renders this
  // sidebar used to keep its own `sidebarOpen` state (defaulting to
  // `true`, so the full-width sidebar rendered inline and squeezed the
  // page content on first mobile load) plus a copy-pasted toggle
  // button. Moving that state in here fixes it once, for every role
  // and every page, the same way Log Out/Get Pro were fixed below.
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();


  const lucideIcon = (Icon: any) => () => (
    <Icon className="w-5 h-5" />
  );

  // Define menu items for each role with consistent structure
  const roleMenus: Record<string, MenuItem[]> = {
    customer: [
      { name: 'Overview', icon: () => <img src={overview} alt="Overview" className="w-5 h-5" />, path: '/customer/dashboard' },
      { name: 'Notifications', icon: () => <img src={notifications} alt="Notifications" className="w-5 h-5" />, path: '/customer/notifications' },
      { name: 'My Property', icon: () => <img src={property} alt="My Property" className="w-5 h-5" />, path: '/customer/properties' },
      { name: 'My Realtor', icon: () => <img src={realtor} alt="My Realtor" className="w-5 h-5" />, path: '/customer/my-realtor' },
      { name: 'My Transactions', icon: () => <img src={transactions} alt="My Transactions" className="w-5 h-5" />, path: '/customer/transactions' },
      { name: 'Messages', icon: () => <img src={messages} alt="Messages" className="w-5 h-5" />, path: '/customer/messages' },
      { name: 'Settings', icon: () => <img src={settings} alt="Settings" className="w-5 h-5" />, path: '/customer/settings' },
      { name: 'Help & Support', icon: () => <img src={help} alt="Help & Support" className="w-5 h-5" />, path: '/customer/help' },
    ],
    agent: [
      { name: 'Overview', icon: () => <img src={overview} alt="Overview" className="w-5 h-5" />, path: '/agent/dashboard' },
      { name: 'Notifications', icon: () => <img src={notifications} alt="Notifications" className="w-5 h-5" />, path: '/agent/notifications' },
      { name: 'Manage Property', icon: () => <img src={property} alt="Manage Property" className="w-5 h-5" />, path: '/agent/properties' },
      { name: 'Document/Compliance', icon: () => <img src={document} alt="Documents" className="w-5 h-5" />, path: '/agent/documents' },
      { name: 'Revenue', icon: () => <img src={transactions} alt="Revenue" className="w-5 h-5" />, path: '/agent/revenue' },
      { name: 'Transactions', icon: lucideIcon(Receipt), path: '/agent/transactions' },
      { name: 'Messages', icon: () => <img src={messages} alt="Messages" className="w-5 h-5" />, path: '/agent/messages' },
      { name: 'Settings', icon: () => <img src={settings} alt="Settings" className="w-5 h-5" />, path: '/agent/settings' },
      { name: 'Support & Resources', icon: () => <img src={help} alt="Support" className="w-5 h-5" />, path: '/agent/support' },
      { name: 'Customer Reviews', icon: () => <img src={document} alt="Reviews" className="w-5 h-5" />, path: '/agent/reviews' },
    ],
    admin: [
      { name: 'Overview', icon: lucideIcon(LayoutDashboard), path: '/admin/overview' },
      { name: 'Notifications', icon: lucideIcon(Bell), path: '/admin/notifications' },
      { name: 'Manage Property', icon: lucideIcon(Home), path: '/admin/properties' },
      { name: 'Manage Companies', icon: lucideIcon(Building), path: '/admin/companies' },
      { name: 'Manage Realtor', icon: lucideIcon(Users), path: '/admin/realtors' },
      { name: 'Manage Customers', icon: lucideIcon(Users), path: '/admin/customers' },
      { name: 'Reports & Analytics', icon: lucideIcon(FileText), path: '/admin/reports' },
      { name: 'Messages', icon: lucideIcon(MessageSquare), path: '/admin/messages' },
      { name: 'Reviews', icon: lucideIcon(Star), path: '/admin/reviews' },
      { name: 'Settings', icon: lucideIcon(Settings), path: '/admin/settings' },
      { name: 'Blog', icon: lucideIcon(Newspaper), path: '/admin/blog' },
      { name: 'Site Content', icon: lucideIcon(FileEdit), path: '/admin/site-content' },
    ],
   company: [
  { name: 'Overview', icon: lucideIcon(LayoutDashboard), path: '/company/overview' },
  { name: 'Notifications', icon: lucideIcon(Bell), path: '/company/notifications' },
  { name: 'Property', icon: lucideIcon(Home), path: '/company/property' },
  { name: 'Listing Review', icon: lucideIcon(ClipboardCheck), path: '/company/listing-review' },
  { name: 'Manage Realtor', icon: lucideIcon(Users), path: '/company/realtors' },
  { name: 'Manage Customers', icon: lucideIcon(UserCircle), path: '/company/customers' },
  { name: 'Messages', icon: lucideIcon(MessageSquare), path: '/company/messages' },
  { name: 'Revenue', icon: lucideIcon(DollarSign), path: '/company/revenue' },
  { name: 'Transactions', icon: lucideIcon(Receipt), path: '/company/transactions' },
  { name: 'Settings', icon: lucideIcon(Settings), path: '/company/settings' },
  { name: 'Help & Support', icon: lucideIcon(LifeBuoy), path: '/company/support' },
]

  };

  const currentMenu = roleMenus[userRole] || roleMenus.customer;

  // Determine active item
  const activeItem = currentMenu.find(item => location.pathname.startsWith(item.path || ''))?.name || 'Overview';

  const handleMenuClick = (itemName: string) => {
    setMobileOpen(false);
    if (onMenuClick) {
      onMenuClick(itemName);
    }
  };

  // Self-contained, unlike the regular nav items above: Log Out and Get
  // Pro are rendered on every page that uses this sidebar (every role,
  // every route), but only one page ever passed an onMenuClick handler
  // that actually did something with them — everywhere else, clicking
  // either button silently did nothing. Handling both directly here
  // fixes it everywhere at once instead of patching each page.
  const handleLogout = async () => {
    setMobileOpen(false);
    await auth.logout(() => navigate('/signin', { replace: true }));
  };

  return (
    <>
      {/* Mobile menu toggle. Fixed to the viewport so it's reachable from
          anywhere on the page; hidden at md+ where the sidebar is always
          visible inline and there's nothing to toggle. */}
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="md:hidden fixed bottom-4 left-4 z-50 p-3 bg-gray-900 text-white rounded-full shadow-lg"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop, mobile only — tapping outside the open drawer closes it */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer. Below md it's fixed off-screen (translate-x-full)
          until opened; at md+ it's back in normal flex flow, always
          visible, and the transform is neutralized. */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-white shadow-sm border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <img src={logo} alt="HouseBank Logo" className="h-17 w-full object-contain p-4" />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {currentMenu.map((item: MenuItem) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <li key={item.name}>
                  <Link
                    to={item.path || '#'}
                    onClick={() => handleMenuClick(item.name)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Log Out
          </button>

          {/* Dabang Pro Card */}
          <div className="bg-gradient-to-br from-gray-900 to-green-800 rounded-xl p-4 text-white">
            <img src={logo1} alt="HouseBank Logo" className="h-17 w-full object-contain p-4" />
            <h3 className="text-center font-semibold text-lg mb-2">Dabang Pro</h3>
            <p className="text-center text-sm text-white text-opacity-90 leading-tight mb-4">
              Get access to all features on telumbas
            </p>
            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              className="w-full bg-white text-gray-900 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Get Pro
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon modal — deliberately a sibling of the drawer above,
          not nested inside it: the drawer carries a CSS transform for
          the slide animation, and a `transform` on an ancestor changes
          the containing block for any `position: fixed` descendant. Left
          nested, this modal would end up positioned relative to the
          drawer instead of the viewport on desktop. */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
            <button
              type="button"
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-900 to-green-800 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dabang Pro is coming soon</h3>
            <p className="text-sm text-gray-500 mb-6">
              We're still building out Pro features. There's nothing to upgrade to yet — check back soon.
            </p>
            <button
              type="button"
              onClick={() => setShowComingSoon(false)}
              className="w-full bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-slate-900 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
