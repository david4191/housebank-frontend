# HouseBank Frontend Testing Guide

## Purpose

Use this guide to decide where to begin exploratory and regression testing of the HouseBank web app. It groups the app by user journey and role, and calls out the paths where failures have the greatest impact. It is a starting checklist, not a replacement for approved product requirements or backend/API testing.

## Recommended Test Order

1. Run the public-site smoke checks.
2. Verify sign-up, sign-in, password recovery, and access control.
3. Exercise the core customer property journey.
4. Exercise agent and company listing workflows.
5. Verify admin moderation and site-content management.
6. Check shared UI, responsive behavior, error states, and deployment deep links.

Start with the first three groups for a short smoke pass. Continue through all groups for a broader release pass.

## Before Testing

- Use the agreed test environment and confirm `VITE_APP_BACKEND_HOST` points to its API. Do not test write actions against production unless explicitly approved.
- Get test accounts for customer, agent, company, and admin roles. Confirm the accounts are verified and have the data/permissions needed for the cases being run.
- Prepare representative listings: sale, rental, and investment; include approved, pending, rejected, and (where available) blocked states. Use safe test documents and payment methods only.
- Record the browser, device/viewport, environment URL, account role, and test-data IDs when reporting issues. Do not include passwords, OTPs, tokens, or real personal/financial data.
- Keep in mind that many screens load live API data. Capture loading, empty, success, and API-failure behavior; do not treat an empty dataset as a rendering failure without checking the test data.

## 1. Public Site and Property Discovery

Start at `/` and follow the navigation. Key routes include `/explore`, `/explores`, `/property-details/:id`, `/agents`, `/companies/:id`, `/investment`, `/investment-details/:id`, `/about-us`, `/services`, `/property-management`, `/help-center`, and `/blogs`.

- Confirm the homepage, header, navigation, footer, and primary calls to action load and navigate to the intended destination.
- Search/filter properties by available criteria; confirm results, counts, and selected filters stay consistent. Try no-result and API-error cases.
- Open a listing and verify its details, images, price, location, listing type, and listed-by information agree with the result card.
- Check sale, rent, and investment listing actions. Confirm the next step matches the product flow; property transactions are not instant checkout and may begin with a viewing or enquiry.
- Check public agent/company directories and profiles, including empty or missing image/profile data.
- Verify public informational pages, blog links, help search/FAQ interactions, and report-concern/report-scam forms where available.
- Refresh a deep route directly and use browser back/forward. Confirm the app does not show a server 404.

## 2. Authentication and Account Access

Start at `/signup`, `/signup-seller`, `/signin`, `/verify-otp`, and `/forgot-password`. Realtor registration is invitation-based via `/realtor-onboarding/:token`.

- Submit valid and invalid values: required fields, malformed email, password constraints, duplicate account, and server-side validation errors.
- Complete signup and OTP verification; test incorrect, expired, and resent codes. Confirm successful verification signs in or routes to the correct next step.
- Sign in with each role and verify the expected landing page: customer `/customer/dashboard`, agent `/agent/dashboard`, company `/company/overview`, admin `/admin/overview`.
- Test unverified accounts, incorrect credentials, two-factor login when enabled, and forgot-password/reset-password including invalid codes and password mismatch.
- Open a protected dashboard URL while signed out; expect redirection to sign-in. Open another role's dashboard while signed in; expect denial/redirect, not access to that role's data.
- Sign out and confirm protected pages require authentication again. Refresh after signing in and confirm the session behaves consistently.

## 3. Customer Workspace

Start at `/customer/dashboard`. Main areas include properties, wishlist, transactions, investment, realtor management, messages, notifications, profile/security settings, and help.

- Browse a property, add/remove it from the wishlist, and verify the change persists after refresh and appears in `/customer/wishlist`.
- Request a viewing or enquiry from a property detail page. Check required fields, validation, success/failure feedback, and the resulting request state.
- Review `/customer/properties` and transaction views, including pending/completed states, filters, details, and consistent amounts/statuses.
- Exercise the investment journey from public investment discovery through customer investment request/payment/status views. Use a sandbox or approved test data; do not submit real payments.
- Check realtor assignment/transfer/report/delete flows where test data supports them. Confirm confirmation steps and resulting relationships/statuses.
- Check messages, notifications/read state, profile edits/avatar upload, password change, security/two-factor settings, and support navigation.

## 4. Agent Workspace

Start at `/agent/dashboard`. Main areas include property management, add/list property, requests, customers, transactions/revenue, messages, reviews, notifications, settings, and support.

- Create a listing with valid and invalid data, images, and documents. Confirm validation and the correct review status after submission.
- Check listing tabs/statuses and detail views. For a company-associated listing, verify it waits for company review and does not appear publicly before approval.
- Exercise viewing and purchase/rental request handling, including approve/decline/confirm actions. Verify customer-visible status and notifications update as expected.
- Check customer/contact records, messages, transaction/revenue totals, filters, and detail navigation against the seeded data.
- Check settings, profile/avatar, password/security, notifications, reviews, and support links.
- Treat document/compliance screens carefully: verify the current availability/placeholder state and do not expect a workflow if the feature is not implemented in this build.

## 5. Company Workspace

Start at `/company/overview`. Main areas include properties, listing review, realtor/customer management, messages, revenue, transactions, notifications, settings, and support.

- Add a property with valid and invalid data, image uploads, and required fields. Confirm submission enters the expected review state and is not immediately published.
- Review agent-submitted listings: approve or reject with the required reason; confirm status changes, visibility, and feedback to the relevant user.
- Check property details, listing requests, assigned realtors, realtor transfer/rankings, and customer views against test data.
- Check company messages, revenue/transaction data, notifications, logo/profile, security/password settings, and support.
- Verify company identity details are presented according to the product rules and cannot be edited through an unsupported self-service path.

## 6. Admin Workspace

Start at `/admin/overview`. Main areas include company verification, realtor/customer management, property moderation, reports, messaging, reviews, notifications, settings, blog, and site content.

- Verify and reject a test company; confirm required rejection notes, status changes, and that the company receives the correct outcome. Check gated CAC-document viewing with authorized access.
- Review properties across relevant states, including awaiting company review, live, flagged, blocked, rejected, and appeals. Confirm each action's confirmation/reason, resulting state, public visibility, and appeal outcome.
- Review reports created through the public concern/scam forms and update their status.
- Check user/company/property search, filters, pagination, detail views, and access boundaries.
- Check messages, reviews, notifications, admin profile/security, blog management, and site-content editing. For content changes, verify the saved content appears on the intended public page and that delete/cancel paths behave safely.

## 7. Shared Quality Checks

Apply these checks across the routes above:

- Responsive layout at a narrow mobile viewport, tablet, and desktop; navigation, dashboards, tables, dialogs, and forms remain usable without unintended horizontal overflow.
- Keyboard-only operation, visible focus, sensible tab order, labeled inputs, accessible validation/error announcements, and dialogs that can be closed and navigated by keyboard.
- Loading indicators, empty states, API errors, retry behavior, disabled/submitting states, and duplicate-submit prevention.
- Form boundaries: blank values, whitespace, long text, invalid formats, and repeated submissions. Confirm errors are actionable and entered values are retained when appropriate.
- Data consistency after actions and refresh; no cross-account data leaking after sign-out/sign-in or switching roles.
- Images and uploaded files: valid file types/sizes, upload failures, missing images, and private-document authorization. Do not expose private documents through a public URL.
- Browser console and Network panel for uncaught errors, failed API calls, CORS issues, incorrect API host, and unexpected requests.

## 8. Deployment Smoke Checks

For a deployed build, run the checks in [DEPLOYMENT.md](DEPLOYMENT.md) as well as this guide. At minimum, load the homepage, directly open and refresh `/explore` and a protected deep route after signing in, and confirm API requests target the configured environment rather than localhost.

## Defect Reporting

For each issue, include:

- Short title and severity/impact.
- Environment URL, browser/device, viewport, and user role.
- Starting route and exact steps to reproduce.
- Expected result and actual result.
- Test-data identifiers and timestamp; redact personal data and secrets.
- Screenshot/video and relevant console or Network error, with tokens and sensitive values removed.

Mark a case blocked when its account, backend behavior, test data, or external integration is unavailable. Record what was unavailable rather than interpreting the block as a pass.

## Available Project Checks

This frontend currently has no dedicated automated test script in `package.json`. The available checks are:

```bash
npm run lint
npm run build
```

These checks validate code quality and production compilation; they do not replace the manual user-flow checks above.