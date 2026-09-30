import { Link } from 'react-router-dom';
import { authContainerStyle } from './SignIn.tsx';

/**
 * /signup-buyer used to be an open "Sign Up as a Realtor" form that
 * anyone could reach and submit — the backend gated it (an account can
 * only actually be created if the submitted email matches a pending
 * company invite), but the page itself gave no indication of that until
 * after someone had filled the whole thing in and hit submit.
 *
 * Joan, Sep 2026: "remove the realtor sign up page. let it be strictly
 * on invitation... once they are invited, they should get an onboarding
 * link to their own signup page, that will also show the company they
 * are signing up with in details." The real form now lives at
 * /realtor-onboarding/:token (see pages/RealtorOnboarding.tsx) — reached
 * only via the one-time link a company's invite emails out, which shows
 * the actual company name and locks the email field to the address that
 * was really invited.
 *
 * This route is kept (rather than deleted, which would 404 anyone who
 * still has the old link bookmarked or half-typed) as an honest dead
 * end, same rule this codebase follows everywhere else for a retired or
 * unbuilt page — no form, no pretending this still works.
 */
import Seo from '../components/Seo.tsx';

export default function SignUpBuyer() {
  return (
    <div className={authContainerStyle}>
      <Seo title="Sign Up" description="Realtor registration on HouseBank is by invitation only." noindex />
      <h2 className="text-3xl font-bold mb-4 text-[color:var(--color-dark)]">Realtor sign-up has moved</h2>
      <p className="text-gray-600 mb-6">
        Realtor registration on HouseBank is by invitation only. If a company has invited you, check
        your email for a link to your own onboarding page. If you haven't been invited yet, ask the
        company you work with to add your email to their roster.
      </p>
      <Link to="/" className="font-semibold text-[color:var(--color-dark)] hover:underline">
        Back to HouseBank
      </Link>
    </div>
  );
}
