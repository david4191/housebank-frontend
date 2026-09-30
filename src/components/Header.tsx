import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import useAuth from '../hooks/useAuth.tsx';
import { roleHomePath } from '../context/AuthContext.tsx';
import { useGetMyProfileQuery } from '../redux/housebank.ts';

function avatarUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-slate-900 border-b-2 border-slate-900'
      : 'text-slate-500 hover:text-slate-700'
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-slate-900 bg-slate-100 rounded'
      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded'
  }`;

/**
 * The main website's single public header (distinct from the four
 * dashboard CustomerHeader.tsx files under components/dashboards/).
 * Fixed this tranche (Joan, Sep 2026 -- "theres no way to go back to the
 * website from the dashboards and vice versa" / "fix the header on the
 * main website to allow the switch and dashboard navigations"):
 *  - the profile icon and "Get Started" button used to go nowhere
 *    useful (profile always linked to /signin even for a signed-in
 *    user, and "Get Started" had no onClick/href at all);
 *  - a signed-in visitor now sees a real "Dashboard" button that goes
 *    straight to their own role's home (roleHomePath), plus a quick
 *    Sign Out, instead of being sent back through /signin.
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useGetMyProfileQuery(undefined, { skip: !auth.user });
  const avatar = avatarUrl(profileData?.profile?.avatar_path || profileData?.profile?.logo_path);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const homePath = auth.user?.role === 'agent' ? '/realtor-landing' : '/';

  const handleGetStarted = () => {
    navigate(auth.user ? roleHomePath(auth.user.role) : '/signup');
  };

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    await auth.logout(() => navigate('/', { replace: true }));
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to={homePath}>
            <img src={logo} alt="HouseBank Logo" className="h-9 w-10" />
          </NavLink>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to={homePath} end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to="/investment" className={navLinkClass}>
              Investment
            </NavLink>
            <NavLink to="/help-center" className={navLinkClass}>
              Help Center
            </NavLink>
            <NavLink to="/blogs" className={navLinkClass}>
              Blogs
            </NavLink>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {auth.user ? (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={avatar || profile}
                    alt="Account"
                    className="h-8 w-8 rounded-full cursor-pointer object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                    <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 truncate">
                      {auth.user.email}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        navigate(roleHomePath(auth.user!.role));
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2 text-slate-400" />
                      Go to Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-slate-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/signin" className="hidden md:block">
                <img
                  src={profile}
                  alt="Sign in"
                  className="h-8 w-8 rounded-full cursor-pointer"
                />
              </NavLink>
            )}

            {/* Get Started / Dashboard Button */}
            <button
              onClick={handleGetStarted}
              className="hidden md:flex text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors items-center space-x-1"
              style={{ backgroundColor: '#3A4B3C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4F6C51')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3A4B3C')}
            >
              <span>{auth.user ? 'Go to Dashboard' : 'Get Started'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-500 hover:text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - shown when isMobileMenuOpen is true */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <NavLink to={homePath} end onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                Home
              </NavLink>
              <NavLink to="/explore" onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                Explore
              </NavLink>
              <NavLink to="/investment" onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                Investment
              </NavLink>
              <NavLink to="/help-center" onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                Help Center
              </NavLink>
              <NavLink to="/blogs" onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                Blogs
              </NavLink>
              {auth.user ? (
                <>
                  <NavLink
                    to={roleHomePath(auth.user.role)}
                    onClick={toggleMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    Go to Dashboard
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      toggleMobileMenu();
                      handleLogout();
                    }}
                    className="mt-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 w-full"
                    style={{ backgroundColor: '#3A4B3C' }}
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/signin" onClick={toggleMobileMenu} className={mobileNavLinkClass}>
                    Sign In
                  </NavLink>
                  <button
                    onClick={() => {
                      toggleMobileMenu();
                      handleGetStarted();
                    }}
                    className="mt-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 w-full"
                    style={{ backgroundColor: '#3A4B3C' }}
                  >
                    <span>Get Started</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
