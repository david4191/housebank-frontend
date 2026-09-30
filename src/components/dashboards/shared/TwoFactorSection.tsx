import { useState } from 'react';
import useAuth from '../../../hooks/useAuth.tsx';
import {
  useRequestTwoFactorCodeMutation,
  useConfirmTwoFactorMutation,
  useDisableTwoFactorMutation,
} from '../../../redux/housebank.ts';

type TwoFactorStep = 'idle' | 'password' | 'code' | 'recovery-codes';

/**
 * Shared 2FA enable/disable flow — originally lived only inside the
 * customer settings page, but the backend's /auth/2fa/* routes were
 * always role-agnostic (requireAuth only, no requireRole), so this was
 * pulled out here to be reused by the agent settings page too, rather
 * than duplicating ~200 lines of password/code/recovery-code flow.
 */
const TwoFactorSection = () => {
  const auth = useAuth();
  const enabled = !!auth.user?.two_factor_enabled;

  const [action, setAction] = useState<'enable' | 'disable' | null>(null);
  const [step, setStep] = useState<TwoFactorStep>('idle');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [requestCode] = useRequestTwoFactorCodeMutation();
  const [confirmTwoFactor] = useConfirmTwoFactorMutation();
  const [disableTwoFactor] = useDisableTwoFactorMutation();

  const startFlow = (kind: 'enable' | 'disable') => {
    setAction(kind);
    setStep('password');
    setPassword('');
    setCode('');
    setError('');
    setInfo('');
  };

  const cancelFlow = () => {
    setAction(null);
    setStep('idle');
    setPassword('');
    setCode('');
    setError('');
    setInfo('');
  };

  const submitPassword = async () => {
    if (!password) {
      setError('Enter your current password.');
      return;
    }
    setSubmitting(true);
    setError('');
    const result: any = await requestCode({ current_password: password });
    setSubmitting(false);
    if (result.error) {
      const err = result.error;
      setError(err?.errors?.current_password?.[0] || err?.message || 'Incorrect password.');
      return;
    }
    setInfo('A code has been sent to your email.');
    setStep('code');
  };

  const resendCode = async () => {
    setSubmitting(true);
    setError('');
    const result: any = await requestCode({ current_password: password });
    setSubmitting(false);
    if (result.error) {
      const err = result.error;
      setError(err?.message || 'Could not resend the code.');
      return;
    }
    setInfo('A new code has been sent to your email.');
  };

  const submitCode = async () => {
    if (!code) {
      setError('Enter the code we emailed you.');
      return;
    }
    setSubmitting(true);
    setError('');

    if (action === 'enable') {
      const result: any = await confirmTwoFactor({ code });
      setSubmitting(false);
      if (result.error) {
        const err = result.error;
        setError(err?.errors?.code?.[0] || err?.message || 'Invalid or expired code.');
        return;
      }
      const codes: string[] = result.data?.recovery_codes || [];
      setRecoveryCodes(codes);
      setStep('recovery-codes');
      await auth.refreshUser();
    } else {
      const result: any = await disableTwoFactor({ code });
      setSubmitting(false);
      if (result.error) {
        const err = result.error;
        setError(err?.errors?.code?.[0] || err?.message || 'Invalid or expired code.');
        return;
      }
      await auth.refreshUser();
      cancelFlow();
    }
  };

  const finishRecoveryCodes = () => {
    cancelFlow();
    setRecoveryCodes(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Two-Factor Authentication</h3>
      <p className="text-sm text-gray-500 mb-6">
        Add an extra layer of security to your account. When enabled, we'll email you a code to
        confirm it's really you every time you sign in.
      </p>

      {step === 'idle' && (
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          {enabled ? (
            <button
              onClick={() => startFlow('disable')}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Disable
            </button>
          ) : (
            <button
              onClick={() => startFlow('enable')}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800"
            >
              Enable two-factor authentication
            </button>
          )}
        </div>
      )}

      {step === 'password' && (
        <div className="max-w-sm space-y-4">
          <p className="text-sm text-gray-700">
            Confirm your password to {action === 'enable' ? 'turn on' : 'turn off'} two-factor authentication.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Current password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => e.key === 'Enter' && submitPassword()}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={submitPassword}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Send code'}
            </button>
            <button onClick={cancelFlow} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'code' && (
        <div className="max-w-sm space-y-4">
          <p className="text-sm text-gray-700">{info || 'Enter the 6-digit code we emailed you.'}</p>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="w-full border border-gray-300 rounded-md px-4 py-2 tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => e.key === 'Enter' && submitCode()}
          />
          <p className="text-xs text-gray-500">
            Lost access to your email or codes? A recovery code works here too.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={submitCode}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Confirming…' : action === 'enable' ? 'Enable' : 'Disable'}
            </button>
            <button
              onClick={resendCode}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Resend code
            </button>
            <button onClick={cancelFlow} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'recovery-codes' && recoveryCodes && (
        <div className="max-w-md space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm font-medium text-amber-900 mb-1">Save your recovery codes</p>
            <p className="text-xs text-amber-800">
              Each code can be used once to sign in if you lose access to your email. We won't show
              these again — store them somewhere safe.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-gray-50 border border-gray-200 rounded-md p-4">
            {recoveryCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <button
            onClick={finishRecoveryCodes}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800"
          >
            I've saved these codes
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSection;
