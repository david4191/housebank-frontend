import { useState } from 'react';
import useAuth from '../../../hooks/useAuth.tsx';

/**
 * Shared change-password form — Joan, Sep 2026: "the admin should be
 * able to reset their own password" (raised while looking at
 * /admin/settings, but the gap was identical for every role: the only
 * password endpoint that existed anywhere was the unauthenticated
 * forgot-password/OTP flow, which means giving up account access
 * first). Same pattern as TwoFactorSection — self-contained, reads/
 * writes through AuthContext, dropped into any role's settings page.
 */
const ChangePasswordSection = () => {
  const auth = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSaved(false);
    if (!currentPassword) {
      setError('Enter your current password.');
      return;
    }
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('New password must be at least 8 characters and contain at least one letter and one number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setSubmitting(true);
    const result = await auth.changePassword(currentPassword, newPassword);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Password</h3>
      <p className="text-sm text-gray-500 mb-6">
        Change your account password. You'll stay signed in here, but every other device signed
        into this account will be signed out.
      </p>

      <div className="max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Password changed.</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? 'Changing…' : 'Change password'}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
