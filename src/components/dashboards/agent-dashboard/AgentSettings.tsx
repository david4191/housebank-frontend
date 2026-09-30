import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import TwoFactorSection from '../shared/TwoFactorSection.tsx';
import ChangePasswordSection from '../shared/ChangePasswordSection.tsx';
import AvatarUpload from '../shared/AvatarUpload.tsx';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../../redux/housebank.ts';

function logoUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const companyVerificationBadge: Record<string, string> = {
  verified: 'bg-green-100 text-green-800',
  pending: 'bg-orange-100 text-orange-800',
  rejected: 'bg-red-100 text-red-800',
};

/**
 * The agent-side counterpart to the customer's My Settings page —
 * previously agents had no settings page at all, so there was nowhere
 * to turn on 2FA, edit a profile, or see which company they're
 * attached to. Profile + avatar + 2FA reuse the exact same shared
 * components and GET/PUT /profile/me, POST /profile/me/avatar
 * endpoints as the customer page; the company section is read-only
 * here on purpose — an agent's company affiliation is managed through
 * the company/agent-transfer flow (company_agents,
 * realtor_transfer_requests), never by editing their own profile.
 */
const ProfileSection = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateMyProfileMutation();
  const [form, setForm] = useState({ full_name: '', bio: '' });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.profile) {
      setForm({
        full_name: profile.profile.full_name || '',
        bio: profile.profile.bio || '',
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setError('');
    setSaved(false);
    const result: any = await updateProfile(form);
    if (result.error) {
      const err = result.error;
      const firstError = err?.errors ? (Object.values(err.errors)[0] as string[])?.[0] : null;
      setError(firstError || err?.message || 'Could not save your profile.');
      return;
    }
    setSaved(true);
  };

  const company = profile?.profile?.company;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile</h3>
        <p className="text-sm text-gray-500">Your public profile, shown to the customers you're assigned to.</p>
      </div>

      <AvatarUpload />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              placeholder="A short introduction customers will see on your profile."
              className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving || isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : company ? (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {company.logo_path ? (
                <img src={logoUrl(company.logo_path) || ''} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                You work for {company.name}
                <span
                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    companyVerificationBadge[company.verification_status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {company.verification_status}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                To change companies, use the transfer request under Document/Compliance.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            You're currently an independent agent — not attached to any company.
          </p>
        )}
      </div>
    </div>
  );
};

const AgentSettingsPage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        </div>
        <div className="space-y-6 mb-10">
          <ProfileSection />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        </div>
        <div className="space-y-6">
          <ChangePasswordSection />
          <TwoFactorSection />
        </div>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
