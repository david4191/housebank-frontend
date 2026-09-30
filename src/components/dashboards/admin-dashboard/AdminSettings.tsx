// src/components/dashboards/admin-dashboard/AdminSettings.tsx
import { Mail, Phone, ShieldCheck, ShieldAlert, Clock, ShieldX } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import TwoFactorSection from '../shared/TwoFactorSection.tsx';
import ChangePasswordSection from '../shared/ChangePasswordSection.tsx';
import AvatarUpload from '../shared/AvatarUpload.tsx';
import { useGetMyProfileQuery } from '../../../redux/housebank.ts';

/**
 * Joan, Sep 2026: "the same notification and profile settings that
 * customer has, do same for ... admin". Admin had no Settings page at
 * all — no route, no sidebar entry, no way to reach 2FA.
 *
 * Unlike every other role, admin has no profile table server-side —
 * see GET /profile/me in profile.routes.js — so full name/bio/etc.
 * stay read-only here (PUT /profile/me still 403s for admin, by
 * design: there's nothing role-specific to edit). Migration 014 (Joan,
 * Sep 2026: "admin should also be able to edit their profile image
 * too") added exactly one column, users.avatar_path, so the shared
 * AvatarUpload component — the same one AgentSettings.tsx/
 * CompanySettings.tsx use — now works here too; its avatar_path/
 * logo_path fallback already reads the right field for every role.
 * "Won't clash with other users' profile image": AuthContext already
 * resets the whole RTK Query cache on every sign-in/out, so this and
 * every other GET /profile/me consumer always refetch fresh per
 * account.
 */
const statusCopy: Record<string, { label: string; classes: string; icon: typeof ShieldCheck }> = {
  active: { label: 'Active', classes: 'bg-green-100 text-green-800', icon: ShieldCheck },
  pending_verification: { label: 'Pending verification', classes: 'bg-orange-100 text-orange-800', icon: Clock },
  suspended: { label: 'Suspended', classes: 'bg-red-100 text-red-800', icon: ShieldAlert },
  banned: { label: 'Banned', classes: 'bg-red-100 text-red-800', icon: ShieldX },
};

const AccountInfoSection = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const status = statusCopy[profile?.status] || statusCopy.active;
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Account</h3>
        <p className="text-sm text-gray-500">
          Your administrator account details. There's no editable profile for the admin role — these
          are read-only.
        </p>
      </div>

      <AvatarUpload />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : profile ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{profile.phone || '—'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                profile.email_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {profile.email_verified ? <ShieldCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {profile.email_verified ? 'Email verified' : 'Email not verified'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
              {profile.role}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Could not load your account details.</p>
      )}
    </div>
  );
};

const AdminSettingsPage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        </div>
        <div className="space-y-6 mb-10">
          <AccountInfoSection />
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

export default AdminSettingsPage;
