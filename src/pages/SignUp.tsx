import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import Button from '../components/Button.tsx';
import { authContainerStyle, authInputStyle } from './SignIn.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { isValidEmail } from '../utils/emailValidation.ts';
import { AuthFieldError, AuthFormNotice } from '../components/AuthFormFeedback.tsx';

// Registered company / agency sign-up. Matches hb-backend's `role: 'company'`
// shape: companyName, companyAddress, cacNumber, email, phone, password, and
// a CAC registration certificate upload. Individual realtors don't self-
// register anywhere -- a company invites them, and they complete
// registration through the one-time link that invite emails them (see
// pages/RealtorOnboarding.tsx).
import Seo from '../components/Seo.tsx';

export default function SignUpSeller() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    cacNumber: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cacFile: null as File | null,
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const update =
    (field: 'companyName' | 'companyAddress' | 'cacNumber' | 'email' | 'phone' | 'password' | 'confirmPassword') =>
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
    if (e.target.files) setFormData({ ...formData, cacFile: e.target.files[0] });
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.cacFile;
      return next;
    });
    setError('');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError('');
    setFieldErrors({});

    const validationErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) validationErrors.companyName = 'Enter your company name.';
    if (!formData.companyAddress.trim()) validationErrors.companyAddress = 'Enter your company address.';
    if (!formData.cacNumber.trim()) validationErrors.cacNumber = 'Enter your registration number.';
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
    if (!formData.cacFile) validationErrors.cacFile = 'Upload your registration certificate.';
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    const body = new FormData();
    body.append('role', 'company');
    body.append('companyName', formData.companyName);
    body.append('companyAddress', formData.companyAddress);
    body.append('cacNumber', formData.cacNumber);
    body.append('email', formData.email.trim());
    body.append('phone', formData.phone);
    body.append('password', formData.password);
    if (formData.cacFile) body.append('cacFile', formData.cacFile);

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

  return (
    <div className={authContainerStyle}>
      <Seo title="Register Your Company" description="Register your real estate company on HouseBank." noindex />
      <AuthTitle
        headerText="Register Your Company"
        subtitle="Have an account?"
        linkText="Sign In"
        linkTo="/signin"
      />
      <div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 text-[19px]">Company's Name</label>
            <input
              type="text"
              className={authInputStyle}
              placeholder="e.g Acme Realty Ltd"
              value={formData.companyName}
              onChange={update('companyName')}
              aria-invalid={Boolean(fieldErrors.companyName)}
              aria-describedby={fieldErrors.companyName ? 'company-name-error' : undefined}
            />
            <AuthFieldError id="company-name-error" message={fieldErrors.companyName} />
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 text-[19px]">Company's Address</label>
            <input
              type="text"
              className={authInputStyle}
              placeholder="e.g 123 Main Street"
              value={formData.companyAddress}
              onChange={update('companyAddress')}
              aria-invalid={Boolean(fieldErrors.companyAddress)}
              aria-describedby={fieldErrors.companyAddress ? 'company-address-error' : undefined}
            />
            <AuthFieldError id="company-address-error" message={fieldErrors.companyAddress} />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">CAC Registration No</label>
          <input
            type="text"
            className={authInputStyle}
            placeholder="e.g RC123456"
            value={formData.cacNumber}
            onChange={update('cacNumber')}
            aria-invalid={Boolean(fieldErrors.cacNumber)}
            aria-describedby={fieldErrors.cacNumber ? 'cac-number-error' : undefined}
          />
          <AuthFieldError id="cac-number-error" message={fieldErrors.cacNumber} />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Email Address</label>
          <input
            type="email"
            className={authInputStyle}
            placeholder="e.g john@company.com"
            value={formData.email}
            onChange={update('email')}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'company-email-error' : undefined}
          />
          <AuthFieldError id="company-email-error" message={fieldErrors.email} />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Phone Number</label>
          <input
            type="tel"
            className={authInputStyle}
            placeholder="+234"
            value={formData.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'company-phone-error' : undefined}
          />
          <AuthFieldError id="company-phone-error" message={fieldErrors.phone} />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={update('password')}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'company-password-error' : undefined}
          />
          <AuthFieldError id="company-password-error" message={fieldErrors.password} />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Confirm Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={update('confirmPassword')}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? 'company-confirm-password-error' : undefined}
          />
          <AuthFieldError id="company-confirm-password-error" message={fieldErrors.confirmPassword} />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Verification</label>
          <div
            className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500"
            onClick={() => document.getElementById('cac-upload')?.click()}
          >
            <span className="text-[16px] text-gray-600 truncate mr-2">
              {formData.cacFile ? formData.cacFile.name : 'Upload CAC Certificate'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 flex-shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <input
            type="file"
            id="cac-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            aria-invalid={Boolean(fieldErrors.cacFile)}
            aria-describedby={fieldErrors.cacFile ? 'company-certificate-error' : undefined}
          />
          <AuthFieldError id="company-certificate-error" message={fieldErrors.cacFile} />
        </div>

        <AuthFormNotice message={error} />
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Signing up…' : 'Sign Up'} onClick={handleSubmit} />
      </div>
    </div>
  );
}
