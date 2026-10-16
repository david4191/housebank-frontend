import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  cookieManager,
  TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  COOKIE_AGE,
  REFRESH_COOKIE_AGE,
  clearAuthCookies,
} from '../utils/cookie.ts';

// Every backend response is { success, message, data } (or { success:false,
// message, errors } on failure) — see docs/API_CONTRACT.md in hb-backend.
// transformResponse/transformErrorResponse below unwrap that envelope once,
// here, so every component just gets the plain data/errors it needs.
interface Envelope<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BACKEND_HOST,
  prepareHeaders: (headers: Headers) => {
    const token = cookieManager.get(TOKEN_COOKIE);
    if (!headers.has('Authorization') && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Access tokens are short-lived (30 min) by design — see docs/SECURITY.md in
 * hb-backend for why. Rather than forcing a full sign-out the moment one
 * expires, this wrapper catches a 401, tries the stored refresh token exactly
 * once, and — only if that succeeds — replays the original request. If the
 * refresh token itself is invalid/expired/revoked, it clears the local
 * session so the app falls back to its normal "not signed in" state.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = cookieManager.get(REFRESH_TOKEN_COOKIE);

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: 'auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );
      const refreshed = (refreshResult.data as Envelope)?.data;

      if (refreshed?.token) {
        cookieManager.set(TOKEN_COOKIE, refreshed.token, { path: '/', maxAge: COOKIE_AGE });
        cookieManager.set(REFRESH_TOKEN_COOKIE, refreshed.refreshToken, {
          path: '/',
          maxAge: REFRESH_COOKIE_AGE,
        });
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        clearAuthCookies();
      }
    } else {
      clearAuthCookies();
    }
  }

  return result;
};

export const houseBankApi = createApi({
  reducerPath: 'houseBankApi',
  tagTypes: ['auth', 'properties', 'property', 'wishlist', 'adminProperties', 'adminOverview', 'adminNotifications', 'adminAppeals', 'propertyAppeals', 'content', 'investments', 'notifications', 'transactions', 'purchases', 'rentals', 'viewings', 'contacts', 'conversations', 'profile', 'paymentMethods', 'companyAgents', 'publicCompanies', 'publicAgents', 'adminCompanies', 'adminRealtors', 'adminCustomers', 'adminReports', 'adminReviews', 'pageContent'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ---------------------------------------------------------------- auth
    loginInUser: builder.mutation<
      | { token: string; refreshToken: string; user: any }
      | { requires_2fa: true; pending_token: string },
      { userName: string; password: string }
    >({
      query: (credentials) => ({ url: 'auth/signin', method: 'POST', body: credentials }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['auth'],
    }),

    // `body` is either a plain object (customer — JSON) or a FormData
    // instance (agent/company — multipart, because idFile/cacFile ride
    // along). fetchBaseQuery leaves FormData untouched and lets the browser
    // set its own multipart Content-Type/boundary — do NOT spread it into a
    // plain object here, that silently drops every file.
    registerUser: builder.mutation<{ user_id: number; email: string }, any>({
      query: (payload) => ({ url: 'auth/signup', method: 'POST', body: payload, timeout: 15000 }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => ({ status: response.status, data: response.data }),
      invalidatesTags: ['auth'],
    }),

    verifyOtp: builder.mutation<
      { token: string; refreshToken: string; user: any },
      { userId: number; code: string }
    >({
      query: (body) => ({ url: 'auth/verify-otp', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['auth'],
    }),

    resendOtp: builder.mutation<null, { userId: number; purpose: 'signup_verification' | 'password_reset' }>({
      query: (body) => ({ url: 'auth/resend-otp', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    // Authenticated self-service password change (any role) — was
    // missing entirely; only the unauthenticated forgot-password/OTP
    // flow existed. Returns a fresh token pair (see auth.routes.js's
    // POST /auth/change-password doc comment for why).
    changePassword: builder.mutation<{ token: string; refreshToken: string }, { current_password: string; new_password: string }>({
      query: (body) => ({ url: 'auth/change-password', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    forgotPassword: builder.mutation<null, { email: string }>({
      query: (body) => ({ url: 'auth/forgot-password', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    resetPassword: builder.mutation<null, { email: string; code: string; newPassword: string }>({
      query: (body) => ({ url: 'auth/reset-password', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    logoutUser: builder.mutation<null, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      invalidatesTags: ['auth'],
    }),

    getMe: builder.query<any, void>({
      query: () => 'auth/me',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['auth'],
    }),

    // Second half of signing in on a 2FA-enabled account — body carries the
    // short-lived pending_token from loginInUser's requires_2fa response,
    // plus the emailed code (or a recovery code).
    verifyTwoFactorLogin: builder.mutation<
      { token: string; refreshToken: string; user: any; used_recovery_code: boolean },
      { pending_token: string; code: string }
    >({
      query: (body) => ({ url: 'auth/2fa/verify-login', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['auth'],
    }),

    // Proves the caller knows the current password before emailing a fresh
    // login_2fa code — used both to start enabling 2FA and to authorize
    // disabling it.
    requestTwoFactorCode: builder.mutation<null, { current_password: string }>({
      query: (body) => ({ url: 'auth/2fa/request-code', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    // Enables 2FA and returns one-time recovery codes — call
    // requestTwoFactorCode first.
    confirmTwoFactor: builder.mutation<{ recovery_codes: string[] }, { code: string }>({
      query: (body) => ({ url: 'auth/2fa/confirm', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['auth'],
    }),

    disableTwoFactor: builder.mutation<null, { code: string }>({
      query: (body) => ({ url: 'auth/2fa/disable', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['auth'],
    }),

    // ----------------------------------------------------------- properties
    getProperties: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'properties', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['properties'],
    }),

    getMyWishlist: builder.query<any[], void>({
      query: () => 'wishlist/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['wishlist'],
    }),

    addToWishlist: builder.mutation<{ property_id: number }, { property_id: number | string }>({
      query: (body) => ({ url: 'wishlist', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['wishlist'],
    }),

    removeFromWishlist: builder.mutation<null, number | string>({
      query: (propertyId) => ({ url: `wishlist/${propertyId}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['wishlist'],
    }),

    getPropertyTypes: builder.query<any[], void>({
      query: () => 'properties/types',
      transformResponse: (response: Envelope) => response.data,
    }),

    getProperty: builder.query<any, number | string>({
      query: (id) => `properties/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'property', id }],
    }),

    getMyProperties: builder.query<any[], { status?: string } | void>({
      query: (filters) => ({ url: 'properties/mine', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['properties'],
    }),

    // Owner-scoped single property — unlike getProperty above (public,
    // approved-only), this returns the caller's own listing regardless
    // of status, including rejection_reason on a rejected one.
    getMyProperty: builder.query<any, number | string>({
      query: (id) => `properties/mine/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'property', id }],
    }),

    createProperty: builder.mutation<any, any>({
      query: (body) => ({ url: 'properties', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['properties'],
    }),

    uploadPropertyImages: builder.mutation<any, { id: number | string; formData: FormData }>({
      query: ({ id, formData }) => ({ url: `properties/${id}/images`, method: 'POST', body: formData }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'property', id }, 'properties'],
    }),

    updateProperty: builder.mutation<any, { id: number | string; body: any }>({
      query: ({ id, body }) => ({ url: `properties/${id}`, method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'property', id }, 'properties'],
    }),

    deleteProperty: builder.mutation<null, number | string>({
      query: (id) => ({ url: `properties/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['properties'],
    }),

    // ------------------------------------- company review of agent listings
    // Joan, Sep 2026: "the company must approve/vet the listing before it
    // shows for anyone to see". Company-only -- see properties.routes.js
    // company-review / company-approve / company-reject.
    getCompanyPendingListings: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      { page?: number; per_page?: number } | void
    >({
      query: (filters) => ({ url: 'properties/company-review', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['properties'],
    }),

    companyApproveListing: builder.mutation<null, number | string>({
      query: (id) => ({ url: `properties/${id}/company-approve`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, id) => [{ type: 'property', id }, 'properties'],
    }),

    companyRejectListing: builder.mutation<null, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({ url: `properties/${id}/company-reject`, method: 'POST', body: { reason } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'property', id }, 'properties'],
    }),

    // ------------------------------------------------- public directory
    // (the main marketing site's "companies & agents" surface -- see
    // hb-backend modules/companies and modules/agents)
    getPublicCompanies: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'companies', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['publicCompanies'],
    }),

    getPublicCompany: builder.query<any, number | string>({
      query: (id) => `companies/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'publicCompanies', id }],
    }),

    getCompanyAgents: builder.query<any[], number | string>({
      query: (id) => `companies/${id}/agents`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['publicAgents'],
    }),

    getPublicAgents: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'agents', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['publicAgents'],
    }),

    // ------------------------------------------------- public landing-page forms
    // (Joan, Sep 2026 -- "the forms in the landing page are not
    // working": the footer newsletter box and the homepage's "Say Hello
    // to HouseBank" contact form both only called console.log() before
    // this -- no endpoint existed for either. Both are anonymous, no
    // auth header attached.)
    subscribeNewsletter: builder.mutation<null, { email: string; company_website?: string }>({
      query: (body) => ({ url: 'leads/newsletter', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    sendContactMessage: builder.mutation<
      null,
      { full_name: string; email: string; message: string; company_website?: string }
    >({
      query: (body) => ({ url: 'leads/contact', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    // ------------------------------------------------------- incident reports
    submitConcernReport: builder.mutation<
      null,
      {
        description: string;
        company_id?: number | string;
        reporter_full_name?: string;
        reporter_email?: string;
        reporter_phone?: string;
        incident_date?: string;
        company_website?: string;
      }
    >({
      query: (body) => ({ url: 'reports/concern', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    submitScamReport: builder.mutation<
      null,
      {
        description: string;
        reporter_full_name?: string;
        reporter_email?: string;
        reporter_phone?: string;
        incident_date?: string;
        scammer_name?: string;
        scammer_email?: string;
        scammer_phone?: string;
        money_lost?: 'yes' | 'no';
        amount_lost?: number | string;
        company_website?: string;
      }
    >({
      query: (body) => ({ url: 'reports/scam', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    // ---------------------------------------------------------- admin (properties)
    getPendingProperties: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/properties/pending', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminProperties'],
    }),

    approveProperty: builder.mutation<null, number | string>({
      query: (id) => ({ url: `admin/properties/${id}/approve`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminProperties', 'properties'],
    }),

    rejectProperty: builder.mutation<null, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({ url: `admin/properties/${id}/reject`, method: 'POST', body: { reason } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminProperties', 'properties'],
    }),

    // Full admin property console (every status, not just pending) --
    // see Property.findAllForAdmin. Joan, Sep 2026: "admin also can
    // manage properties, flag a property if theres an issue, block a
    // property in which the company will/must appeal."
    getAdminProperties: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/properties', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminProperties'],
    }),

    getAdminProperty: builder.query<any, number | string>({
      query: (id) => `admin/properties/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'adminProperties', id }],
    }),

    flagProperty: builder.mutation<null, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({ url: `admin/properties/${id}/flag`, method: 'POST', body: { reason } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminProperties', 'properties'],
    }),

    unflagProperty: builder.mutation<null, number | string>({
      query: (id) => ({ url: `admin/properties/${id}/unflag`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminProperties', 'properties'],
    }),

    blockProperty: builder.mutation<null, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({ url: `admin/properties/${id}/block`, method: 'POST', body: { reason } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminProperties', 'properties'],
    }),

    // ---------------------------------------------------------- admin (overview + platform notifications)
    getAdminOverview: builder.query<any, void>({
      query: () => 'admin/overview',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminOverview'],
    }),

    getAdminNotifications: builder.query<
      { data: any[]; page: number; per_page: number; total: number },
      { page?: number; per_page?: number } | void
    >({
      query: (filters) => ({ url: 'admin/notifications', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminNotifications'],
    }),

    // -------------------------------------------------------- property appeals (block -> appeal -> resolve)
    getAdminAppeals: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/appeals', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminAppeals'],
    }),

    resolveAppeal: builder.mutation<null, { id: number | string; decision: 'approved' | 'rejected'; response?: string }>({
      query: ({ id, ...body }) => ({ url: `admin/appeals/${id}/resolve`, method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminAppeals', 'adminProperties', 'properties'],
    }),

    // -------------------------------------------------------- admin: company verification (admin's real job -- see Property flow above for why this replaced admin property-approval)
    getAdminCompanies: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/companies', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminCompanies'],
    }),

    getAdminCompany: builder.query<any, number | string>({
      query: (id) => `admin/companies/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'adminCompanies', id }],
    }),

    verifyCompany: builder.mutation<null, { id: number | string; notes?: string }>({
      query: ({ id, notes }) => ({ url: `admin/companies/${id}/verify`, method: 'POST', body: { notes } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminCompanies', 'publicCompanies'],
    }),

    rejectCompanyVerification: builder.mutation<null, { id: number | string; notes: string }>({
      query: ({ id, notes }) => ({ url: `admin/companies/${id}/reject`, method: 'POST', body: { notes } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminCompanies', 'publicCompanies'],
    }),

    // -------------------------------------------------------- admin: realtor / customer directories + account status
    getAdminRealtors: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/realtors', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminRealtors'],
    }),

    getAdminCustomers: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'admin/customers', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminCustomers'],
    }),

    suspendUser: builder.mutation<null, number | string>({
      query: (id) => ({ url: `admin/users/${id}/suspend`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminRealtors', 'adminCustomers'],
    }),

    activateUser: builder.mutation<null, number | string>({
      query: (id) => ({ url: `admin/users/${id}/activate`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminRealtors', 'adminCustomers'],
    }),

    archiveUser: builder.mutation<null, number | string>({
      query: (id) => ({ url: `admin/users/${id}/archive`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminRealtors', 'adminCustomers'],
    }),

    // -------------------------------------------------------- admin: incident reports (report-concern / report-scam)
    getAdminReports: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'reports', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminReports'],
    }),

    updateReportStatus: builder.mutation<null, { id: number | string; status: 'new' | 'reviewing' | 'resolved' }>({
      query: ({ id, status }) => ({ url: `reports/${id}/status`, method: 'POST', body: { status } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminReports'],
    }),

    getAdminReportStats: builder.query<
      { trend: { month: string; concerns: number; scams: number }[]; by_status: { status: string; count: number }[]; total: number },
      void
    >({
      query: () => 'reports/stats',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminReports'],
    }),

    // -------------------------------------------------------- admin: review moderation
    getAdminReviews: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'reviews', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['adminReviews'],
    }),

    updateReviewStatus: builder.mutation<null, { id: number | string; status: 'visible' | 'hidden' | 'flagged' }>({
      query: ({ id, status }) => ({ url: `reviews/${id}/status`, method: 'POST', body: { status } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminReviews'],
    }),

    deleteReview: builder.mutation<null, number | string>({
      query: (id) => ({ url: `reviews/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['adminReviews'],
    }),

    submitPropertyAppeal: builder.mutation<null, { id: number | string; message: string }>({
      query: ({ id, message }) => ({ url: `properties/${id}/appeal`, method: 'POST', body: { message } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['properties', 'propertyAppeals'],
    }),

    getPropertyAppeals: builder.query<any[], number | string>({
      query: (id) => `properties/${id}/appeals`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['propertyAppeals'],
    }),

    // --------------------------------------------------------------- content (CMS)
    getPage: builder.query<any, string>({
      query: (slug) => `content/pages/${slug}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'content', id: slug }],
    }),

    getHelpTopics: builder.query<any[], { category?: string } | void>({
      query: (filters) => ({ url: 'content/help-topics', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['content'],
    }),

    getTestimonials: builder.query<any[], { featured?: 0 | 1 } | void>({
      query: (filters) => ({ url: 'content/testimonials', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['content'],
    }),

    getBlogPosts: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      { page?: number; per_page?: number } | void
    >({
      query: (filters) => ({ url: 'content/blog', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['content'],
    }),

    getBlogPost: builder.query<any, string>({
      query: (slug) => `content/blog/${slug}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'content', id: slug }],
    }),

    // ------------------------------------------------- blog admin (CMS)
    // Joan, Sep 2026: "the blogs are meant to come from the admin, so
    // move the static blocks to the admin." Same content_html/status
    // model the public blog already reads from -- these are the
    // admin-only writes/reads (any status, not just published).
    getAdminBlogPosts: builder.query<
      { items: any[]; total: number; page: number; per_page: number },
      { page?: number; per_page?: number; status?: 'draft' | 'published' } | void
    >({
      query: (filters) => ({ url: 'content/blog/admin', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['content'],
    }),

    getAdminBlogPost: builder.query<any, number | string>({
      query: (id) => `content/blog/admin/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'content', id }],
    }),

    // FormData when a new cover image is attached (field name "cover"),
    // plain fields otherwise -- same convention as uploadMyAvatar/
    // uploadPropertyImages above.
    createBlogPost: builder.mutation<{ id: number }, FormData>({
      query: (formData) => ({ url: 'content/blog', method: 'POST', body: formData }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    updateBlogPost: builder.mutation<null, { id: number | string; body: FormData }>({
      query: ({ id, body }) => ({ url: `content/blog/${id}`, method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'content', id }, 'content'],
    }),

    deleteBlogPost: builder.mutation<null, number | string>({
      query: (id) => ({ url: `content/blog/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    // --------------------------------------------- site content admin (CMS)
    // Joan, Sep 2026: "the website contents are meant to come from the
    // admin, but stored in the DB, make sure its done." Static pages
    // (Privacy Policy, Anti-Discrimination, HouseBank Cover) already read
    // from GET /content/pages/:slug on the public side -- these are the
    // admin-only list + write endpoints, plus Help Topics and
    // Testimonials CRUD, all behind the new Site Content manager.
    getAdminStaticPages: builder.query<any[], void>({
      query: () => 'content/pages',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['content'],
    }),

    upsertStaticPage: builder.mutation<null, { slug: string; title: string; content_html: string }>({
      query: ({ slug, ...body }) => ({ url: `content/pages/${slug}`, method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    createHelpTopic: builder.mutation<
      { id: number },
      { category: string; question: string; answer: string; sort_order?: number }
    >({
      query: (body) => ({ url: 'content/help-topics', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    updateHelpTopic: builder.mutation<null, { id: number | string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `content/help-topics/${id}`, method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    deleteHelpTopic: builder.mutation<null, number | string>({
      query: (id) => ({ url: `content/help-topics/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    // FormData when an avatar is attached (field name "avatar"), plain
    // fields otherwise -- same convention as createBlogPost above.
    createTestimonial: builder.mutation<{ id: number }, FormData>({
      query: (formData) => ({ url: 'content/testimonials', method: 'POST', body: formData }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    deleteTestimonial: builder.mutation<null, number | string>({
      query: (id) => ({ url: `content/testimonials/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['content'],
    }),

    // ------------------------------------------- page content (CMS) ---
    // Joan, Sep 2026: "whole main website in one push" -- the marketing/
    // landing-page components (About, Services, Realtor landing, Property
    // Management landing, homepage sections) were still 100% hardcoded
    // JSX. These back the generic page_content_items table (migration
    // 015) that now drives all of them, plus the admin "Page Content"
    // manager.
    getPageContent: builder.query<any[], string>({
      query: (page) => ({ url: 'content/page-items', params: { page } }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, page) => [{ type: 'pageContent', id: page }],
    }),

    getAdminPageContent: builder.query<any[], string>({
      query: (page) => ({ url: 'content/page-items/admin', params: { page } }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, page) => [{ type: 'pageContent', id: page }, 'pageContent'],
    }),

    getPageContentSections: builder.query<
      { page: string; section: string; item_count: number }[],
      void
    >({
      query: () => 'content/page-items/admin/sections',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['pageContent'],
    }),

    // FormData when a new image is attached (field name "image"), plain
    // fields otherwise -- same convention as createBlogPost/createTestimonial above.
    createPageContentItem: builder.mutation<{ id: number }, FormData>({
      query: (formData) => ({ url: 'content/page-items', method: 'POST', body: formData }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['pageContent'],
    }),

    updatePageContentItem: builder.mutation<null, { id: number | string; body: FormData }>({
      query: ({ id, body }) => ({ url: `content/page-items/${id}`, method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['pageContent'],
    }),

    deletePageContentItem: builder.mutation<null, number | string>({
      query: (id) => ({ url: `content/page-items/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['pageContent'],
    }),

    // ------------------------------------------------------------ investments
    getInvestmentOpportunities: builder.query<
      { data: any[]; total: number; page: number; per_page: number },
      Record<string, string | number | undefined> | void
    >({
      query: (filters) => ({ url: 'investments/opportunities', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['investments'],
    }),

    getInvestmentOpportunity: builder.query<any, number | string>({
      query: (id) => `investments/opportunities/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'investments', id }],
    }),

    getInvestmentOpportunityByProperty: builder.query<any, number | string>({
      query: (propertyId) => `investments/opportunities/by-property/${propertyId}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, propertyId) => [{ type: 'investments', id: `property-${propertyId}` }],
    }),

    getMyInvestments: builder.query<any[], void>({
      query: () => 'investments/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['investments'],
    }),

    getInvestmentStats: builder.query<
      { total_invested: number; estimated_returns: number; active_count: number },
      void
    >({
      query: () => 'investments/stats',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['investments'],
    }),

    createInvestment: builder.mutation<
      { id: number },
      { investment_property_id: number | string; amount: number | string }
    >({
      query: (body) => ({ url: 'investments', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['investments'],
    }),

    // ------------------------------------------------------------ transactions
    getMyTransactions: builder.query<
      { data: any[]; total: number; page: number; per_page: number },
      { page?: number; per_page?: number } | void
    >({
      query: (filters) => ({ url: 'transactions/mine', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['transactions'],
    }),

    // ------------------------------------------------------------ notifications
    getNotifications: builder.query<
      { data: any[]; total: number; page: number; per_page: number },
      { unread?: 0 | 1; page?: number; per_page?: number } | void
    >({
      query: (filters) => ({ url: 'notifications', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['notifications'],
    }),

    getUnreadNotificationCount: builder.query<{ count: number }, void>({
      query: () => 'notifications/unread-count',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['notifications'],
    }),

    markNotificationRead: builder.mutation<null, number | string>({
      query: (id) => ({ url: `notifications/${id}/read`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['notifications'],
    }),

    markAllNotificationsRead: builder.mutation<null, void>({
      query: () => ({ url: 'notifications/read-all', method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['notifications'],
    }),

    // ------------------------------------------------------------ purchases
    getMyPurchases: builder.query<any[], void>({
      query: () => 'purchases/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['purchases'],
    }),

    // Staff-initiated (agent/company/admin) — a sale is agreed and
    // processed at the office after a viewing, not self-checkout by the
    // customer. Kept here for whenever that staff-facing screen is built.
    createPurchase: builder.mutation<
      { id: number },
      { property_id: number | string; buyer_user_id: number | string }
    >({
      query: (body) => ({ url: 'purchases', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases'],
    }),

    // Agent/company view of purchases against properties THEY list (not
    // their own purchases as a buyer — that's getMyPurchases above).
    // Powers Agent Revenue/Transactions. Optional status filter (e.g.
    // 'requested') matches the backend's ?status= support, though the
    // Transactions pages currently fetch everything and filter client-side.
    getPurchasesForMyListings: builder.query<any[], string | void>({
      query: (status) => (status ? `purchases/for-my-listings?status=${status}` : 'purchases/for-my-listings'),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['purchases'],
    }),

    // Customer-facing front door — creates a 'requested' row for staff
    // to approve/decline below, instead of the staff-only createPurchase
    // above (which 403's for a customer). See BuyPropertyDetails.tsx.
    requestPurchase: builder.mutation<{ id: number }, { property_id: number | string }>({
      query: (body) => ({ url: 'purchases/request', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases'],
    }),

    // Customer withdraws their own still-open ('requested') purchase request.
    cancelPurchaseRequest: builder.mutation<null, number | string>({
      query: (id) => ({ url: `purchases/${id}/cancel`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases'],
    }),

    // Staff approves a customer's purchase request — promotes it to
    // pending_payment (same state createPurchase starts at directly).
    approvePurchaseRequest: builder.mutation<null, { id: number | string; note?: string }>({
      query: ({ id, note }) => ({ url: `purchases/${id}/approve`, method: 'POST', body: note ? { note } : {} }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases', 'properties', 'property'],
    }),

    // Staff declines a customer's purchase request.
    declinePurchaseRequest: builder.mutation<null, { id: number | string; note?: string }>({
      query: ({ id, note }) => ({ url: `purchases/${id}/decline`, method: 'POST', body: note ? { note } : {} }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases'],
    }),

    confirmPurchase: builder.mutation<null, number | string>({
      query: (id) => ({ url: `purchases/${id}/confirm`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['purchases', 'properties', 'property'],
    }),

    // ------------------------------------------------------------ rentals
    getMyRentals: builder.query<any[], void>({
      query: () => 'rentals/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['rentals'],
    }),

    // Staff-initiated (agent/company/admin) — same reasoning as
    // createPurchase above.
    createRental: builder.mutation<
      { id: number },
      { property_id: number | string; tenant_user_id: number | string; rent_period_months?: number }
    >({
      query: (body) => ({ url: 'rentals', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals'],
    }),

    getRentalsForMyListings: builder.query<any[], string | void>({
      query: (status) => (status ? `rentals/for-my-listings?status=${status}` : 'rentals/for-my-listings'),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['rentals'],
    }),

    // Customer-facing front door — same reasoning as requestPurchase above.
    requestRental: builder.mutation<
      { id: number },
      { property_id: number | string; rent_period_months?: number }
    >({
      query: (body) => ({ url: 'rentals/request', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals'],
    }),

    // Customer withdraws their own still-open ('requested') rental request.
    cancelRentalRequest: builder.mutation<null, number | string>({
      query: (id) => ({ url: `rentals/${id}/cancel`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals'],
    }),

    // Staff approves a customer's rental request — promotes it to
    // pending_payment (same state createRental starts at directly).
    approveRentalRequest: builder.mutation<null, { id: number | string; note?: string }>({
      query: ({ id, note }) => ({ url: `rentals/${id}/approve`, method: 'POST', body: note ? { note } : {} }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals', 'properties', 'property'],
    }),

    // Staff declines a customer's rental request.
    declineRentalRequest: builder.mutation<null, { id: number | string; note?: string }>({
      query: ({ id, note }) => ({ url: `rentals/${id}/decline`, method: 'POST', body: note ? { note } : {} }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals'],
    }),

    confirmRental: builder.mutation<null, number | string>({
      query: (id) => ({ url: `rentals/${id}/confirm`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['rentals', 'properties', 'property'],
    }),

    // ------------------------------------------------------------ viewings
    // The real customer-facing entry point into buying/renting/selling:
    // book a property for an in-person viewing with an agent. See
    // BuyPropertyDetails.tsx / MainPropertyDetailsPage's "Schedule a
    // TOUR" form.
    getMyViewings: builder.query<any[], void>({
      query: () => 'viewings/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['viewings'],
    }),

    createViewing: builder.mutation<
      { id: number },
      {
        property_id: number | string;
        preferred_date: string;
        preferred_time?: string;
        full_name: string;
        phone: string;
        message?: string;
      }
    >({
      query: (body) => ({ url: 'viewings', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['viewings'],
    }),

    cancelViewing: builder.mutation<null, number | string>({
      query: (id) => ({ url: `viewings/${id}/cancel`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['viewings'],
    }),

    // Staff view: viewing requests against properties this agent/company
    // lists (optionally filtered by status, e.g. 'requested' for a
    // "needs your action" list). Closes the gap noted since the viewings
    // module was built — confirm/complete existed with nothing to call
    // them from.
    getViewingsForMyProperties: builder.query<any[], { status?: string } | void>({
      query: (filters) => ({ url: 'viewings/for-my-properties', params: filters ?? {} }),
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['viewings'],
    }),

    confirmViewing: builder.mutation<null, { id: number | string; scheduled_at?: string }>({
      query: ({ id, scheduled_at }) => ({
        url: `viewings/${id}/confirm`,
        method: 'POST',
        body: scheduled_at ? { scheduled_at } : {},
      }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['viewings'],
    }),

    completeViewing: builder.mutation<null, number | string>({
      query: (id) => ({ url: `viewings/${id}/complete`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['viewings'],
    }),

    // ------------------------------------------------------------ contacts / messages
    // "My realtor" isn't a directory of every agent on the platform —
    // it's the real agents/companies this customer has actually dealt
    // with (booked a viewing, bought, rented, or invested), and it's
    // also the only set of people a customer is allowed to message
    // (enforced server-side, see hb-backend modules/messages).
    getMyContacts: builder.query<any[], void>({
      query: () => 'contacts/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['contacts'],
    }),

    getConversations: builder.query<any[], void>({
      query: () => 'messages',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['conversations'],
    }),

    getConversation: builder.query<any, number | string>({
      query: (id) => `messages/${id}`,
      transformResponse: (response: Envelope) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'conversations', id }],
    }),

    // Starts a new thread with target_user_id, or continues the
    // existing one with that same contact if there already is one —
    // the backend decides which, so the frontend never has to track it.
    startConversation: builder.mutation<
      { id: number },
      { target_user_id: number | string; message: string; property_id?: number | string; subject?: string }
    >({
      query: (body) => ({ url: 'messages', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['conversations'],
    }),

    sendMessage: builder.mutation<{ id: number }, { conversationId: number | string; body: string }>({
      query: ({ conversationId, body }) => ({ url: `messages/${conversationId}`, method: 'POST', body: { body } }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'conversations', id: conversationId },
        'conversations',
      ],
    }),

    markConversationRead: builder.mutation<null, number | string>({
      query: (id) => ({ url: `messages/${id}/read`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      invalidatesTags: ['conversations'],
    }),

    // Backs the Help page's "Get in Touch" form — the recipient (the
    // customer's own company relationship) is resolved server-side,
    // never passed from here. An automated acknowledgment lands in the
    // same conversation immediately; the real reply comes later.
    contactCompany: builder.mutation<{ conversation_id: number; company_name: string }, { message: string }>({
      query: (body) => ({ url: 'messages/contact-company', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['conversations', 'notifications'],
    }),

    // ---------------------------------------------------------- profile (all roles)
    getMyProfile: builder.query<any, void>({
      query: () => 'profile/me',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['profile'],
    }),

    updateMyProfile: builder.mutation<null, Record<string, any>>({
      query: (body) => ({ url: 'profile/me', method: 'PUT', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['profile', 'auth'],
    }),

    // FormData with a single "avatar" file field — fetchBaseQuery leaves
    // FormData untouched and lets the browser set its own multipart
    // Content-Type/boundary (see uploadPropertyImages above for the same
    // pattern already used for property photos).
    uploadMyAvatar: builder.mutation<{ avatar_path: string }, FormData>({
      query: (formData) => ({ url: 'profile/me/avatar', method: 'POST', body: formData }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['profile'],
    }),

    // Public — no auth, the invited realtor has no account yet. Backs
    // the /realtor-onboarding/:token page: shows which company sent the
    // invite and locks the signup form's email to the one that was
    // actually invited.
    getInviteByToken: builder.query<{ email: string; company_name: string }, string>({
      query: (token) => `company-agents/invites/${token}`,
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
    }),

    // -------------------------------------------------- payment methods (customer)
    // Reference-only saved-card metadata — brand, last 4, expiry, name.
    // There is no full card number or CVV field anywhere in this API by
    // design; see the backend's payment-methods.routes.js for why.
    getMyPaymentMethods: builder.query<any[], void>({
      query: () => 'payment-methods/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['paymentMethods'],
    }),

    addPaymentMethod: builder.mutation<
      { id: number },
      { card_brand: string; last4: string; expiry_month: number; expiry_year: number; cardholder_name: string }
    >({
      query: (body) => ({ url: 'payment-methods', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['paymentMethods'],
    }),

    deletePaymentMethod: builder.mutation<null, number | string>({
      query: (id) => ({ url: `payment-methods/${id}`, method: 'DELETE' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['paymentMethods'],
    }),

    setDefaultPaymentMethod: builder.mutation<null, number | string>({
      query: (id) => ({ url: `payment-methods/${id}/default`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['paymentMethods'],
    }),

    // ------------------------------------------------------- company-agents
    // A company's realtor roster — see company-agents.routes.js in
    // hb-backend. Agent-attach is staff-initiated (company adds an
    // independent agent by email), so there's no agent-facing hook here.
    getMyCompanyAgents: builder.query<any[], void>({
      query: () => 'company-agents/mine',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['companyAgents'],
    }),

    getCompanyAgentRanking: builder.query<any[], void>({
      query: () => 'company-agents/ranking',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['companyAgents'],
    }),

    addCompanyAgent: builder.mutation<null, { email: string }>({
      query: (body) => ({ url: 'company-agents', method: 'POST', body }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['companyAgents'],
    }),

    removeCompanyAgent: builder.mutation<null, number | string>({
      query: (agentUserId) => ({ url: `company-agents/${agentUserId}/remove`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['companyAgents'],
    }),

    // Emails with no HouseBank account yet that a company has invited --
    // see POST /company-agents and GET /company-agents/invites. These
    // rows disappear on their own once the invited person signs up
    // (auth.routes.js accepts the invite and attaches them), so this
    // list is only ever the ones still waiting.
    getPendingCompanyInvites: builder.query<any[], void>({
      query: () => 'company-agents/invites',
      transformResponse: (response: Envelope) => response.data,
      providesTags: ['companyAgents'],
    }),

    revokeCompanyAgentInvite: builder.mutation<null, number | string>({
      query: (id) => ({ url: `company-agents/invites/${id}/revoke`, method: 'POST' }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['companyAgents'],
    }),

    // Reassigns one of the company's own listings to a different roster
    // agent (or back to the company itself when agent_user_id is null) —
    // see PATCH /properties/:id/reassign-agent in properties.routes.js.
    reassignPropertyAgent: builder.mutation<null, { id: number | string; agent_user_id?: number | string | null }>({
      query: ({ id, agent_user_id }) => ({
        url: `properties/${id}/reassign-agent`,
        method: 'PATCH',
        body: { agent_user_id },
      }),
      transformResponse: (response: Envelope) => response.data,
      transformErrorResponse: (response) => response.data as Envelope,
      invalidatesTags: ['properties'],
    }),
  }),
});

export const {
  useLoginInUserMutation,
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useVerifyTwoFactorLoginMutation,
  useRequestTwoFactorCodeMutation,
  useConfirmTwoFactorMutation,
  useDisableTwoFactorMutation,
  useGetPropertiesQuery,
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetPropertyTypesQuery,
  useGetPropertyQuery,
  useGetMyPropertiesQuery,
  useGetMyPropertyQuery,
  useCreatePropertyMutation,
  useUploadPropertyImagesMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPendingPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useGetAdminPropertiesQuery,
  useGetAdminPropertyQuery,
  useFlagPropertyMutation,
  useUnflagPropertyMutation,
  useBlockPropertyMutation,
  useGetAdminOverviewQuery,
  useGetAdminNotificationsQuery,
  useGetAdminAppealsQuery,
  useResolveAppealMutation,
  useGetAdminCompaniesQuery,
  useGetAdminCompanyQuery,
  useVerifyCompanyMutation,
  useRejectCompanyVerificationMutation,
  useGetAdminRealtorsQuery,
  useGetAdminCustomersQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useArchiveUserMutation,
  useGetAdminReportsQuery,
  useUpdateReportStatusMutation,
  useSubmitPropertyAppealMutation,
  useGetPropertyAppealsQuery,
  useGetPageQuery,
  useGetHelpTopicsQuery,
  useGetTestimonialsQuery,
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useGetInvestmentOpportunitiesQuery,
  useGetMyInvestmentsQuery,
  useGetInvestmentStatsQuery,
  useCreateInvestmentMutation,
  useGetMyTransactionsQuery,
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetMyPurchasesQuery,
  useCreatePurchaseMutation,
  useGetPurchasesForMyListingsQuery,
  useRequestPurchaseMutation,
  useCancelPurchaseRequestMutation,
  useApprovePurchaseRequestMutation,
  useDeclinePurchaseRequestMutation,
  useConfirmPurchaseMutation,
  useGetMyRentalsQuery,
  useCreateRentalMutation,
  useGetRentalsForMyListingsQuery,
  useRequestRentalMutation,
  useCancelRentalRequestMutation,
  useApproveRentalRequestMutation,
  useDeclineRentalRequestMutation,
  useConfirmRentalMutation,
  useGetMyViewingsQuery,
  useCreateViewingMutation,
  useCancelViewingMutation,
  useGetViewingsForMyPropertiesQuery,
  useConfirmViewingMutation,
  useCompleteViewingMutation,
  useGetMyContactsQuery,
  useGetConversationsQuery,
  useGetConversationQuery,
  useStartConversationMutation,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useContactCompanyMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadMyAvatarMutation,
  useGetMyPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetMyCompanyAgentsQuery,
  useGetCompanyAgentRankingQuery,
  useAddCompanyAgentMutation,
  useRemoveCompanyAgentMutation,
  useGetPendingCompanyInvitesQuery,
  useRevokeCompanyAgentInviteMutation,
  useReassignPropertyAgentMutation,
  useGetPublicCompaniesQuery,
  useGetPublicCompanyQuery,
  useGetCompanyAgentsQuery,
  useGetPublicAgentsQuery,
  useSubscribeNewsletterMutation,
  useSendContactMessageMutation,
  useGetInvestmentOpportunityQuery,
  useGetInvestmentOpportunityByPropertyQuery,
  useSubmitConcernReportMutation,
  useSubmitScamReportMutation,
  useGetCompanyPendingListingsQuery,
  useCompanyApproveListingMutation,
  useCompanyRejectListingMutation,
  useGetAdminBlogPostsQuery,
  useGetAdminBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetAdminStaticPagesQuery,
  useUpsertStaticPageMutation,
  useCreateHelpTopicMutation,
  useUpdateHelpTopicMutation,
  useDeleteHelpTopicMutation,
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetInviteByTokenQuery,
  useChangePasswordMutation,
  useGetAdminReportStatsQuery,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
  useGetPageContentQuery,
  useGetAdminPageContentQuery,
  useGetPageContentSectionsQuery,
  useCreatePageContentItemMutation,
  useUpdatePageContentItemMutation,
  useDeletePageContentItemMutation,
} = houseBankApi;

export const { endpoints, reducerPath, reducer, middleware } = houseBankApi;
