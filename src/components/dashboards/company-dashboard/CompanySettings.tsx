// src/components/dashboards/company-dashboard/CompanySettings.tsx
import { Building2, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import TwoFactorSection from '../shared/TwoFactorSection.tsx';
import ChangePasswordSection from '../shared/ChangePasswordSection.tsx';
import AvatarUpload from '../shared/AvatarUpload.tsx';
import { useGetMyProfileQuery } from '../../../redux/housebank.ts';

/**
 * There was no company settings page anywhere in this build — flagged
 * as a gap in the company-dashboard rebuild and now filled in. Mirrors
 * AgentSettings.tsx (same shared AvatarUpload + TwoFactorSection, same
 * GET /profile/me), but the profile half is read-only, not a form: see
 * PUT /profile/me in profile.routes.js, which deliberately returns 403
 * for the company role — company_name/company_address/cac_number are
 * identity-verification facts, not something to quietly self-edit.
 * Only the logo (POST /profile/me/avatar) and 2FA are actually
 * changeable here, same as the real backend allows.
 */
const verificationCopy: Record<string, { label: string; classes: string; icon: typeof ShieldCheck }> = {
  verified: { label: 'Verified', classes: 'bg-green-100 text-green-800', icon: ShieldCheck },
  pending: { label: 'Verification pending', classes: 'bg-orange-100 text-orange-800', icon: Clock },
  rejected: { label: 'Verification rejected', classes: 'bg-red-100 text-red-800', icon: ShieldAlert },
};

const ProfileSection = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const p = profile?.profile;
  const statusInfo = verificationCopy[p?.verification_status] || verificationCopy.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Company profile</h3>
        <p className="text-sm text-gray-500">
          Your registered company details. These are identity-verification facts and can't be edited
          here — contact support if something needs to be corrected.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Logo</p>
        <AvatarUpload />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : p ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{p.company_name}</p>
              <span
                className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.classes}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <p className="text-sm text-gray-600 max-w-md">{p.company_address || '—'}</p>
          </div>

          {p.verification_status !== 'verified' && (
            <p className="text-xs text-gray-500 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              While your company is unverified, properties you list are shown to customers with an
              "Unverified" tag until an admin reviews your CAC documents.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Could not load your company profile.</p>
      )}
    </div>
  );
};

const CompanySettingsPage = () => {
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

export default CompanySettingsPage;
