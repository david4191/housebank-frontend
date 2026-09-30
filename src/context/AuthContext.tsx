import React from 'react';
import { useDispatch } from 'react-redux';
import {
  useRegisterUserMutation,
  useLogoutUserMutation,
  useLoginInUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyTwoFactorLoginMutation,
  useLazyGetMeQuery,
  useChangePasswordMutation,
  houseBankApi,
} from '../redux/housebank.ts';
import {
  cookieManager,
  TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_COOKIE,
  COOKIE_AGE,
  REFRESH_COOKIE_AGE,
  clearAuthCookies,
} from '../utils/cookie.ts';

export type HouseBankRole = 'customer' | 'agent' | 'company' | 'admin';

export interface HouseBankUser {
  id: number;
  email: string;
  phone?: string;
  role: HouseBankRole;
  status?: string;
  [key: string]: any;
}

/** Where each role lands after signing in / verifying — used by SignIn, OTPVerification, etc. */
export function roleHomePath(role?: HouseBankRole | string) {
  switch (role) {
    case 'agent':
      return '/agent/dashboard';
    case 'company':
      return '/company/overview';
    case 'admin':
      return '/admin/overview';
    case 'customer':
    default:
      return '/customer/dashboard';
  }
}

function readCachedUser(): HouseBankUser | null {
  const raw = cookieManager.get(USER_COOKIE);
  if (!raw) return null;
  // react-cookie already JSON-decodes object-shaped cookie values for us,
  // but guard against a corrupted/partial cookie so a bad value can't crash
  // every page that reads auth.user.
  if (typeof raw === 'object') return raw as HouseBankUser;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistSession(token: string, refreshToken: string, user: HouseBankUser) {
  cookieManager.set(TOKEN_COOKIE, token, { path: '/', maxAge: COOKIE_AGE });
  cookieManager.set(REFRESH_TOKEN_COOKIE, refreshToken, { path: '/', maxAge: REFRESH_COOKIE_AGE });
  cookieManager.set(USER_COOKIE, user, { path: '/', maxAge: REFRESH_COOKIE_AGE });
}

interface AuthContextType {
  user: HouseBankUser | null;
  login: (credentials: { userName: string; password: string }) => Promise<
    | { ok: true; user: HouseBankUser }
    | { ok: false; message: string; requiresVerification?: boolean; userId?: number }
    | { ok: false; requires2fa: true; pendingToken: string }
  >;
  // Second half of signing in when login() comes back with requires2fa —
  // pendingToken proves the password was just verified, code is the emailed
  // 6-digit code or a recovery code.
  verifyTwoFactorLogin: (
    pendingToken: string,
    code: string
  ) => Promise<{ ok: true; user: HouseBankUser; usedRecoveryCode: boolean } | { ok: false; message: string }>;
  register: (
    payload: any
  ) => Promise<{ ok: true; userId: number; email: string } | { ok: false; message: string; errors?: Record<string, string[]> }>;
  verifyOtp: (
    userId: number,
    code: string
  ) => Promise<{ ok: true; user: HouseBankUser } | { ok: false; message: string }>;
  resendOtp: (userId: number, purpose: 'signup_verification' | 'password_reset') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  // Re-syncs the cached user object from the server (e.g. after toggling
  // 2FA in Settings) without a full re-login — the token/refresh token
  // don't change, only what's cached about the user.
  refreshUser: () => Promise<HouseBankUser | null>;
  // Self-service password change (any role) — requires the current
  // password, issues a fresh token pair for THIS session (every other
  // session gets signed out server-side), so calling this does not log
  // the caller out the way resetPassword()'s forgot-password flow does.
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: (callback?: VoidFunction) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registerUser] = useRegisterUserMutation();
  const [logoutUser] = useLogoutUserMutation();
  const [loginInUser] = useLoginInUserMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [resendOtpMutation] = useResendOtpMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verifyTwoFactorLoginMutation] = useVerifyTwoFactorLoginMutation();
  const [triggerGetMe] = useLazyGetMeQuery();
  const [changePasswordMutation] = useChangePasswordMutation();
  const dispatch = useDispatch();

  // Every account (customer/agent/company/admin) that ever signs in on
  // this device shares ONE Redux store for the life of the browser tab --
  // RTK Query caches getMyProfile/getNotifications/etc under a cache key
  // that has no user id in it (these are all "my own" endpoints, no
  // args), so switching accounts without a hard page reload left the
  // PREVIOUS user's cached data (most visibly: their avatar) showing on
  // the newly signed-in user's dashboard until something forced a
  // refetch. Nothing ever did. Wiping the whole API cache on every
  // successful sign-in and on sign-out closes this for every endpoint at
  // once, not just avatars -- resetApiState() clears cached data AND
  // active subscriptions immediately refetch, so this doesn't cost more
  // than the loading flicker every fresh sign-in already has.
  const resetApiCache = () => dispatch(houseBankApi.util.resetApiState());

  const [user, setUser] = React.useState<HouseBankUser | null>(() => readCachedUser());

  const login: AuthContextType['login'] = async (credentials) => {
    const result = await loginInUser(credentials);
    if ('data' in result && result.data) {
      if ('requires_2fa' in result.data && result.data.requires_2fa) {
        return { ok: false, requires2fa: true, pendingToken: result.data.pending_token };
      }
      const { token, refreshToken, user: loggedInUser } = result.data as {
        token: string;
        refreshToken: string;
        user: HouseBankUser;
      };
      resetApiCache();
      persistSession(token, refreshToken, loggedInUser);
      setUser(loggedInUser);
      return { ok: true, user: loggedInUser };
    }
    const err: any = 'error' in result ? result.error : null;
    // The backend nests these two under `errors` (see hb-backend's
    // src/utils/response.js: the 4th arg to error() always lands in the
    // `errors` field, not spread onto the envelope's top level) — reading
    // err.requires_verification directly was always undefined, which
    // silently broke the redirect to the OTP screen for any unverified
    // account trying to sign in.
    return {
      ok: false,
      message: err?.message || 'Unable to sign in. Please check your details and try again.',
      requiresVerification: err?.errors?.requires_verification,
      userId: err?.errors?.user_id,
    };
  };

  // Signup does NOT log the user in — an email OTP has to be verified first
  // (see hb-backend/docs/API_CONTRACT.md). Callers should route to the OTP
  // screen with the returned userId.
  const register: AuthContextType['register'] = async (payload) => {
    const result = await registerUser(payload);
    if ('data' in result && result.data) {
      return { ok: true, userId: result.data.user_id, email: result.data.email };
    }
    const err: any = 'error' in result ? result.error : null;
    return {
      ok: false,
      message: err?.message || 'Unable to create your account. Please check your details and try again.',
      errors: err?.errors,
    };
  };

  const verifyOtp: AuthContextType['verifyOtp'] = async (userId, code) => {
    const result = await verifyOtpMutation({ userId, code });
    if ('data' in result && result.data) {
      const { token, refreshToken, user: verifiedUser } = result.data;
      resetApiCache();
      persistSession(token, refreshToken, verifiedUser);
      setUser(verifiedUser);
      return { ok: true, user: verifiedUser };
    }
    const err: any = 'error' in result ? result.error : null;
    return { ok: false, message: err?.message || 'Invalid or expired code.' };
  };

  const verifyTwoFactorLogin: AuthContextType['verifyTwoFactorLogin'] = async (pendingToken, code) => {
    const result = await verifyTwoFactorLoginMutation({ pending_token: pendingToken, code });
    if ('data' in result && result.data) {
      const { token, refreshToken, user: loggedInUser, used_recovery_code } = result.data;
      resetApiCache();
      persistSession(token, refreshToken, loggedInUser);
      setUser(loggedInUser);
      return { ok: true, user: loggedInUser, usedRecoveryCode: !!used_recovery_code };
    }
    const err: any = 'error' in result ? result.error : null;
    return { ok: false, message: err?.message || 'Invalid or expired code.' };
  };

  const refreshUser: AuthContextType['refreshUser'] = async () => {
    const result = await triggerGetMe();
    if ('data' in result && result.data) {
      const refreshed = result.data as HouseBankUser;
      // Only re-syncs the cached user object (e.g. two_factor_enabled after
      // a Settings change) — the active token/refresh token are untouched.
      cookieManager.set(USER_COOKIE, refreshed, { path: '/', maxAge: REFRESH_COOKIE_AGE });
      setUser(refreshed);
      return refreshed;
    }
    return null;
  };

  const resendOtp: AuthContextType['resendOtp'] = async (userId, purpose) => {
    await resendOtpMutation({ userId, purpose });
  };

  const forgotPassword: AuthContextType['forgotPassword'] = async (email) => {
    await forgotPasswordMutation({ email });
  };

  const resetPassword: AuthContextType['resetPassword'] = async (email, code, newPassword) => {
    const result = await resetPasswordMutation({ email, code, newPassword });
    if ('error' in result && result.error) {
      const err: any = result.error;
      return { ok: false, message: err?.message || 'Invalid or expired code.' };
    }
    return { ok: true };
  };

  const changePassword: AuthContextType['changePassword'] = async (currentPassword, newPassword) => {
    const result = await changePasswordMutation({ current_password: currentPassword, new_password: newPassword });
    if ('data' in result && result.data) {
      const { token, refreshToken } = result.data as { token: string; refreshToken: string };
      // Same account, same cached user object — only the token pair
      // changed, so there's no resetApiCache()/setUser() the way
      // login()/verifyOtp() need when switching accounts.
      if (user) persistSession(token, refreshToken, user);
      return { ok: true };
    }
    const err: any = 'error' in result ? result.error : null;
    return { ok: false, message: err?.errors?.current_password?.[0] || err?.message || 'Could not change your password.' };
  };

  const logout: AuthContextType['logout'] = async (callback) => {
    try {
      await logoutUser();
    } finally {
      // Always clear the local session, even if the network call fails
      // (expired token, offline, etc.) — the user clicked "log out",
      // staying signed in locally would be the wrong failure mode.
      clearAuthCookies();
      resetApiCache();
      setUser(null);
      callback?.();
    }
  };

  const providerValue: AuthContextType = {
    user,
    login,
    verifyTwoFactorLogin,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};
