import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import { authContainerStyle, authInputStyle } from './SignIn.tsx';
import Button from '../components/Button.tsx';
import useAuth from '../hooks/useAuth.tsx';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const update = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in every field.');
      return;
    }
    if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await auth.register({
      role: 'customer',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setSubmitting(false);

    if (result.ok) {
      navigate('/verify-otp', { state: { userId: result.userId, purpose: 'signup_verification' } });
      return;
    }
    if (result.errors) setFieldErrors(result.errors);
    setError(result.message);
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
          />
          {fieldErrors.fullName && <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName[0]}</p>}
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Email Address</label>
          <input
            type="email"
            className={authInputStyle}
            placeholder="e.g john@example.com"
            value={formData.email}
            onChange={update('email')}
          />
          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>}
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Phone Number</label>
          <input
            type="tel"
            className={authInputStyle}
            placeholder="+234 800 000 0000"
            value={formData.phone}
            onChange={update('phone')}
          />
          {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>}
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={update('password')}
          />
        </div>

        <div className="mb-6 w-full">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Confirm Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={update('confirmPassword')}
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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
