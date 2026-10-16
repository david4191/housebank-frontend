import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import Button from '../components/Button.tsx';
import { authContainerStyle, authInputStyle } from './SignIn.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { useGetInviteByTokenQuery } from '../redux/housebank.ts';
import { AuthFieldError, AuthFormNotice } from '../components/AuthFormFeedback.tsx';

/**
 * Realtor onboarding — Joan, Sep 2026: "since its the company that adds
 * the realtors email, and they go on to click on the onboarding link
 * and do their registration, remove the realtor sign up page. let it
 * be strictly on invitation... once they are invited, they should get
 * an onboarding link to their own signup page, that will also show the
 * company they are signing up with in details."
 *
 * This replaces the old model, where the ONLY "invite" was an email row
 * a company added and the realtor had to independently find their own
 * way to the generic, publicly-reachable /signup-buyer form and hope
 * their email matched (see SignUpBuyer.tsx, now retired). This page is
 * reached only via a unique link emailed to the invited address
 * (company-agents.routes.js's POST / sends it), and the link itself is
 * the proof of invitation — the email field below is locked to the
 * invited address rather than left open, so the account that actually
 * gets created can't drift from who the company meant to invite.
 */
import Seo from '../components/Seo.tsx';

export default function RealtorOnboarding() {
  const { token } = useParams<{ token: string }>();
  const { data: invite, isLoading, isError } = useGetInviteByTokenQuery(token || '', { skip: !token });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idFile: null as File | null,
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const update = (field: 'fullName' | 'phone' | 'password' | 'confirmPassword') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
      setError('');
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFormData({ ...formData, idFile: e.target.files[0] });
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.idFile;
      return next;
    });
    setError('');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError('');
    setFieldErrors({});

    if (!invite) {
      setError('We could not verify this invitation. Please refresh the page and try again.');
      return;
    }

    const validationErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) validationErrors.fullName = 'Enter your full name.';
    if (!formData.phone.trim()) validationErrors.phone = 'Enter your phone number.';
    if (!formData.password) validationErrors.password = 'Choose a password.';
    else if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      validationErrors.password = 'Use at least 8 characters, including a letter and a number.';
    }
    if (!formData.confirmPassword) validationErrors.confirmPassword = 'Confirm your password.';
    else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.idFile) validationErrors.idFile = 'Upload a valid government-issued ID.';
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    const body = new FormData();
    body.append('role', 'agent');
    body.append('fullName', formData.fullName);
    body.append('email', invite.email);
    body.append('phone', formData.phone);
    body.append('password', formData.password);
    if (formData.idFile) body.append('idFile', formData.idFile);

    setSubmitting(true);
    try {
      const result = await auth.register(body);
      if (result.ok) {
        navigate('/verify-otp', { state: { userId: result.userId, purpose: 'signup_verification' } });
        return;
      }
      setFieldErrors(result.errors);
      setError(result.message);
    } catch {
      setError("We couldn't reach our service just now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={authContainerStyle}>
        <p className="text-gray-500">Checking your invitation…</p>
      </div>
    );
  }

  // Honest dead end for an unknown, already-used, revoked, or expired
  // token — same "don't invent a page that isn't real" rule this
  // codebase follows everywhere else, rather than silently falling
  // through to a blank or broken form.
  if (isError || !invite) {
    return (
      <div className={authContainerStyle}>
        <h2 className="text-3xl font-bold mb-4 text-[color:var(--color-dark)]">Invitation not found</h2>
        <p className="text-gray-600 mb-6">
          This onboarding link is invalid or has expired. If you're expecting an invitation, ask the
          company that's adding you to HouseBank to send a fresh one, or check the link they gave you
          for typos.
        </p>
        <Link to="/" className="font-semibold text-[color:var(--color-dark)] hover:underline">
          Back to HouseBank
        </Link>
      </div>
    );
  }

  return (
    <div className={authContainerStyle}>
      <Seo title="Complete Your Registration" description="Complete your realtor onboarding on HouseBank." noindex />
      <AuthTitle headerText="Complete Your Registration" subtitle="Have an account?" linkText="Sign In" linkTo="/signin" />

      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-sm text-gray-700">
          You've been invited to join <span className="font-semibold">{invite.company_name}</span> as a
          Realtor on HouseBank.
        </p>
      </div>

      <div>
        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Full Name</label>
          <input
            type="text"
            className={authInputStyle}
            placeholder="e.g John Doe"
            value={formData.fullName}
            onChange={update('fullName')}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? 'onboarding-full-name-error' : undefined}
          />
          <AuthFieldError id="onboarding-full-name-error" message={fieldErrors.fullName} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Email Address</label>
          <input
            type="email"
            className={`${authInputStyle} bg-gray-100 text-gray-500 cursor-not-allowed`}
            value={invite.email}
            readOnly
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">
            Locked to the email {invite.company_name} invited — contact them if this isn't right.
          </p>
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Phone Number</label>
          <input
            type="tel"
            className={authInputStyle}
            placeholder="+234"
            value={formData.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'onboarding-phone-error' : undefined}
          />
          <AuthFieldError id="onboarding-phone-error" message={fieldErrors.phone} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={update('password')}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'onboarding-password-error' : undefined}
          />
          <AuthFieldError id="onboarding-password-error" message={fieldErrors.password} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Confirm Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={update('confirmPassword')}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? 'onboarding-confirm-password-error' : undefined}
          />
          <AuthFieldError id="onboarding-confirm-password-error" message={fieldErrors.confirmPassword} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Verification</label>
          <div
            className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500"
            onClick={() => document.getElementById('id-upload')?.click()}
          >
            <span className="text-[16px] text-gray-600 truncate mr-2">
              {formData.idFile ? formData.idFile.name : 'Upload Government-Issued ID'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400 flex-shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <input
            type="file"
            id="id-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            aria-invalid={Boolean(fieldErrors.idFile)}
            aria-describedby={fieldErrors.idFile ? 'onboarding-id-error' : undefined}
          />
          <AuthFieldError id="onboarding-id-error" message={fieldErrors.idFile} />
        </div>

        <AuthFormNotice message={error} />
      </div>

      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Signing up…' : 'Complete Registration'} onClick={handleSubmit} />
      </div>
    </div>
  );
}
