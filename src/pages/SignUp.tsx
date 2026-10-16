import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import Button from '../components/Button.tsx';
import { authContainerStyle, authInputStyle } from './SignIn.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { isValidEmail } from '../utils/emailValidation.ts';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const update =
    (field: 'companyName' | 'companyAddress' | 'cacNumber' | 'email' | 'phone' | 'password' | 'confirmPassword') =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFormData({ ...formData, cacFile: e.target.files[0] });
  };

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});

    if (
      !formData.companyName ||
      !formData.companyAddress ||
      !formData.cacNumber ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError('Please fill in every field.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
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
    if (!formData.cacFile) {
      setError('A CAC registration certificate is required.');
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
    body.append('cacFile', formData.cacFile);

    setSubmitting(true);
    const result = await auth.register(body);
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
            />
            {fieldErrors.companyName && <p className="mt-1 text-sm text-red-600">{fieldErrors.companyName[0]}</p>}
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 text-[19px]">Company's Address</label>
            <input
              type="text"
              className={authInputStyle}
              placeholder="e.g 123 Main Street"
              value={formData.companyAddress}
              onChange={update('companyAddress')}
            />
            {fieldErrors.companyAddress && <p className="mt-1 text-sm text-red-600">{fieldErrors.companyAddress[0]}</p>}
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
          />
          {fieldErrors.cacNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.cacNumber[0]}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Email Address</label>
          <input
            type="email"
            className={authInputStyle}
            placeholder="e.g john@company.com"
            value={formData.email}
            onChange={update('email')}
          />
          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Phone Number</label>
          <input
            type="tel"
            className={authInputStyle}
            placeholder="+234"
            value={formData.phone}
            onChange={update('phone')}
          />
          {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={update('password')}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-800 text-[19px]">Confirm Password</label>
          <input
            type="password"
            className={authInputStyle}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={update('confirmPassword')}
          />
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
          />
          {fieldErrors.cacFile && <p className="mt-1 text-sm text-red-600">{fieldErrors.cacFile[0]}</p>}
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Signing up…' : 'Sign Up'} onClick={handleSubmit} />
      </div>
    </div>
  );
}
