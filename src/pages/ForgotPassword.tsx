import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTitle from '../components/AuthTitle.tsx';
import Button from '../components/Button.tsx';
import { authContainerStyle, authInputStyle, authOTPInputStyle } from './SignIn.tsx';
import useAuth from '../hooks/useAuth.tsx';

const CODE_LENGTH = 6; // matches the backend's 6-digit OTP (see hb-backend/src/models/OtpCode.js)

type Step = 'email' | 'reset';

/**
 * POST /auth/forgot-password and POST /auth/reset-password have existed
 * on the backend (and even in AuthContext.tsx as forgotPassword()/
 * resetPassword()) since early in this build, but nothing in the UI
 * ever called them — no page, and no "Forgot password?" link pointing
 * anywhere. This is that missing page: email in, a 6-digit emailed
 * code + new password out.
 *
 * /auth/forgot-password is deliberately generic on the backend (always
 * "a code has been sent", whether or not that email exists — see the
 * route's own comment) to avoid leaking which emails are registered, so
 * this page always advances to the code step after submitting an email
 * rather than branching on found/not-found.
 */
import Seo from '../components/Seo.tsx';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setError('');
    if (!email.trim()) {
      setError('Enter the email address on your account.');
      return;
    }
    setSubmitting(true);
    await auth.forgotPassword(email.trim());
    setSubmitting(false);
    setNotice('If that email is registered, a reset code has been sent.');
    setStep('reset');
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    await auth.forgotPassword(email.trim());
    setResending(false);
    setNotice('A new code has been sent to your email.');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/\D/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleReset = async () => {
    setError('');
    setNotice('');

    const code = otp.join('');
    if (code.length !== CODE_LENGTH) {
      setError(`Please enter the full ${CODE_LENGTH}-digit code.`);
      return;
    }
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await auth.resetPassword(email.trim(), code, newPassword);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/signin', { state: { passwordReset: true } });
  };

  if (step === 'reset') {
    return (
      <div className={authContainerStyle}>
        <AuthTitle headerText="Reset Password" subtitle="Remembered it after all?" linkText="Sign In" linkTo="/signin" />
        <div>
          <div className="mb-8 w-full">
            <label className="block mb-6 font-medium text-[color:var(--color-dark)] text-base">
              Enter the {CODE_LENGTH}-digit code we emailed to {email}
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

          <div className="mb-8 w-full">
            <label className="block mb-3 font-medium text-[color:var(--color-dark)] text-base">
              New password
            </label>
            <input
              type="password"
              className={authInputStyle}
              placeholder="At least 8 characters, with a letter and a number"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-8 w-full">
            <label className="block mb-3 font-medium text-[color:var(--color-dark)] text-base">
              Confirm new password
            </label>
            <input
              type="password"
              className={authInputStyle}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {notice && <p className="mb-4 text-sm text-green-700">{notice}</p>}
        </div>
        <div className="w-full sm:w-2/5 mt-8">
          <Button text={submitting ? 'Resetting…' : 'Reset Password'} onClick={handleReset} />
        </div>
        <div className="w-full sm:w-2/5 mt-8">
          <Button text={resending ? 'Resending…' : 'Resend Code'} onClick={handleResend} variant="link" />
        </div>
      </div>
    );
  }

  return (
    <div className={authContainerStyle}>
      <Seo title="Forgot Password" description="Reset your HouseBank account password." noindex />
      <AuthTitle headerText="Forgot Password" subtitle="Remembered it after all?" linkText="Sign In" linkTo="/signin" />
      <div>
        <div className="mb-8 w-full">
          <label className="block mb-6 font-medium text-[color:var(--color-dark)] text-base">
            Email Address
          </label>
          <input
            type="email"
            className={authInputStyle}
            placeholder="e.g john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
            autoFocus
          />
          <p className="mt-3 text-sm text-gray-500">
            We'll email you a code you can use to set a new password.
          </p>
        </div>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      </div>
      <div className="w-full sm:w-2/5 mt-8">
        <Button text={submitting ? 'Sending…' : 'Send Reset Code'} onClick={handleSendCode} />
      </div>
    </div>
  );
}
