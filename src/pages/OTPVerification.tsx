import { useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import Button from '../components/Button.tsx';
import { authContainerStyle, authOTPInputStyle } from './SignIn.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { roleHomePath } from '../context/AuthContext.tsx';

const CODE_LENGTH = 6; // matches the backend's 6-digit OTP (see hb-backend/src/models/OtpCode.js)

import Seo from '../components/Seo.tsx';

export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateUserId = (location.state as any)?.userId;
  const paramUserId = searchParams.get('userId');
  const userId: number | undefined = stateUserId ?? (paramUserId ? Number(paramUserId) : undefined);

  const handleOtpChange = (index: number, value: string) => {
    if (/\D/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError('');
    setNotice('');

    if (!userId) {
      setError('We lost track of which account this is for — please sign up again.');
      return;
    }

    const code = otp.join('');
    if (code.length !== CODE_LENGTH) {
      setError(`Please enter the full ${CODE_LENGTH}-digit code.`);
      return;
    }

    setSubmitting(true);
    const result = await auth.verifyOtp(userId, code);
    setSubmitting(false);

    if (result.ok) {
      navigate(roleHomePath(result.user.role), { replace: true });
      return;
    }
    setError(result.message);
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    if (!userId) {
      setError('We lost track of which account this is for — please sign up again.');
      return;
    }
    setResending(true);
    await auth.resendOtp(userId, 'signup_verification');
    setResending(false);
    setNotice('A new code has been sent to your email.');
  };

  return (
    <div className={authContainerStyle}>
      <Seo title="OTP Verification" description="Verify your HouseBank account." noindex />
      <AuthTitle
        headerText="OTP Verification"
        subtitle="You don't have an account?"
        linkText="Sign Up"
        linkTo="/signup"
      />
      <div>
        {/* OTP Input Section */}
        <div className="mb-8 w-full">
          <label className="block mb-6 font-medium text-gray-800 text-[19px]">
            Enter {CODE_LENGTH}-digit Code
          </label>
          <div className="flex gap-2 sm:gap-3 justify-start">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={authOTPInputStyle}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  if (el) inputsRef.current[index] = el;
                }}
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {notice && <p className="mb-4 text-sm text-green-700">{notice}</p>}
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Verifying…' : 'Verify'} onClick={handleVerify} />
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button
          text={resending ? 'Resending…' : 'Resend Code'}
          onClick={handleResend}
          variant="link"
        />
      </div>
    </div>
  );
}
