import { Cookies } from 'react-cookie';

// Single shared cookie jar used by both the RTK Query layer (redux/housebank.ts)
// and AuthContext — previously these read/wrote two different cookie jars under
// different key names (note_user_token vs hb_user_token), which meant the
// Authorization header was NEVER actually sent on any "protected" request.
export const cookieManager = new Cookies();

// Access token: short-lived (matches backend JWT_ACCESS_TTL_SECONDS, 30 min by
// default), but we keep the cookie itself around a bit longer than that so the
// reauth flow in housebank.ts has a chance to silently refresh it instead of
// forcing a full logout the moment the JWT itself expires server-side.
export const TOKEN_COOKIE = 'hb_user_token';
export const COOKIE_AGE: number = 3600; // 1 hour

// Refresh token: opaque, rotated on every use, matches backend's 14-day TTL.
export const REFRESH_TOKEN_COOKIE = 'hb_refresh_token';
export const REFRESH_COOKIE_AGE: number = 1209600; // 14 days

// Cached copy of the logged-in user object (id, email, role, ...), so the app
// can render role-aware UI (route guards, dashboard sidebars) without waiting
// on a network round trip on every page load. Never treated as a source of
// truth for authorization — every actual write/read still goes through the
// backend, which re-checks the JWT and ownership independently.
export const USER_COOKIE = 'hb_user';

export function clearAuthCookies() {
  cookieManager.remove(TOKEN_COOKIE, { path: '/' });
  cookieManager.remove(REFRESH_TOKEN_COOKIE, { path: '/' });
  cookieManager.remove(USER_COOKIE, { path: '/' });
}
