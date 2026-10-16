import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import { authContainerStyle, authInputStyle } from './SignIn.tsx';
import Button from '../components/Button.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { isValidEmail } from '../utils/emailValidation.ts';
import { AuthFieldError, AuthFormNotice } from '../components/AuthFormFeedback.tsx';

// This is the plain customer (property buyer/browser) sign-up form — no
// documents required, matching hb-backend's `role: 'customer'` signup shape
// (fullName, email, phone, password). Registered companies have their own
// dedicated form at /signup-seller, linked below. Realtors have no public
// signup entry point at all — they're invited by a company and complete
// registration through a one-time link emailed to them
// (/realtor-onboarding/:token, see pages/RealtorOnboarding.tsx).
import Seo from '../components/Seo.tsx';

export default function SignUpUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const update = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setError('');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError('');
    setFieldErrors({});

    const validationErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) validationErrors.fullName = 'Enter your full name.';
    if (!formData.email.trim()) validationErrors.email = 'Enter your email address.';
    else if (!isValidEmail(formData.email)) validationErrors.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) validationErrors.phone = 'Enter your phone number.';
    if (!formData.password) validationErrors.password = 'Choose a password.';
    else if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      validationErrors.password = 'Use at least 8 characters, including a letter and a number.';
    }
    if (!formData.confirmPassword) validationErrors.confirmPassword = 'Confirm your password.';
    else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await auth.register({
        role: 'customer',
        fullName: formData.fullName,
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
      });
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

  return (
    <div className={authContainerStyle}>
      <Seo title="Sign Up" description="Create your HouseBank account to browse, buy, rent, and invest in property." noindex />
      <AuthTitle
        headerText="Sign Up"
        subtitle="Have an account?"
        linkText="Sign In"
        linkTo="/signin"
      />
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
            aria-describedby={fieldErrors.fullName ? 'signup-full-name-error' : undefined}
          />
          <AuthFieldError id="signup-full-name-error" message={fieldErrors.fullName} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Email Address</label>
          <input
            type="email"
            className={authInputStyle}
            placeholder="e.g john@example.com"
            value={formData.email}
            onChange={update('email')}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
          />
          <AuthFieldError id="signup-email-error" message={fieldErrors.email} />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Phone Number</label>
          <input
            type="tel"
            className={authInputStyle}
            placeholder="+234 800 000 0000"
            value={formData.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'signup-phone-error' : undefined}
          />
          <AuthFieldError id="signup-phone-error" message={fieldErrors.phone} />
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
            aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
          />
          <AuthFieldError id="signup-password-error" message={fieldErrors.password} />
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
            aria-describedby={fieldErrors.confirmPassword ? 'signup-confirm-password-error' : undefined}
          />
          <AuthFieldError id="signup-confirm-password-error" message={fieldErrors.confirmPassword} />
        </div>

        <AuthFormNotice message={error} />

        {/* Realtors don't self-register here or anywhere public (Joan,
            Sep 2026: "the registration for realtors shouldnt show in
            /signup... let it be strictly on invitation"). A company
            invites a realtor by email, and the invite email itself
            carries their one-time onboarding link
            (/realtor-onboarding/:token) -- there's deliberately no
            generic "I'm a realtor" entry point on this page for someone
            to click without having actually been invited. */}
        <div className="text-sm text-gray-600">
          Registering a company?{' '}
          <Link to="/signup-seller" className="font-semibold text-[color:var(--color-dark)] hover:underline">
            Register your company
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Signing up…' : 'Sign Up'} onClick={handleSubmit} />
      </div>
    </div>
  );
}
