// src/components/dashboards/company-dashboard/CompanyRealtor.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, Users, Home as HomeIcon, BarChart3, ArrowLeftRight, Mail, X } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetMyCompanyAgentsQuery,
  useAddCompanyAgentMutation,
  useRemoveCompanyAgentMutation,
  useGetPendingCompanyInvitesQuery,
  useRevokeCompanyAgentInviteMutation,
} from '../../../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function initialsFor(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(isoLike: string | null | undefined) {
  if (!isoLike) return '—';
  const d = new Date(isoLike.replace(' ', 'T') + (isoLike.includes('Z') ? '' : 'Z'));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
}

const verificationStyle: Record<string, string> = {
  verified: 'bg-white text-green-700 border border-green-300',
  pending: 'bg-white text-orange-600 border border-orange-300',
  unverified: 'bg-white text-gray-500 border border-gray-300',
  rejected: 'bg-white text-red-500 border border-red-300',
};

/**
 * The old version of this page was a flat mock table (6 hardcoded
 * "Abubakar/Ibrahim/..." rows with randomuser.me photos), a "No of
 * Agents 12" stat that never moved, an "Add Agent" button pointing at
 * a route (/company/new-agent) that doesn't exist, and a "Remove
 * Agent" button with no click handler at all. That was replaced once
 * with a real roster + attach-by-email for existing independent
 * agents.
 *
 * "Every agent must work for a company" (Joan, Sep 2026) removed
 * independent-agent signup entirely, so attach-by-email alone isn't
 * enough anymore — most of the time the email won't have an account
 * yet. POST /company-agents now handles both cases itself: if the
 * email belongs to an existing independent agent it's attached
 * immediately (unchanged), otherwise it records a pending invite and
 * the person joins the roster automatically the moment they sign up
 * as an agent using that same email (see auth.routes.js's signup
 * gate). This page shows both outcomes: the live roster below, and a
 * "Pending Invites" list for the ones still waiting to sign up.
 */
const CompanyManageRealtor = () => {
  const navigate = useNavigate();
  const { data: roster, isLoading } = useGetMyCompanyAgentsQuery();
  const { data: invites, isLoading: invitesLoading } = useGetPendingCompanyInvitesQuery();
  const [addAgent, { isLoading: adding }] = useAddCompanyAgentMutation();
  const [removeAgent, { isLoading: removing }] = useRemoveCompanyAgentMutation();
  const [revokeInvite, { isLoading: revoking }] = useRevokeCompanyAgentInviteMutation();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<number | null>(null);

  const rows = roster || [];
  const pendingInvites = invites || [];
  const filtered = rows.filter(
    (r: any) =>
      (r.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalProperties = rows.reduce((sum: number, r: any) => sum + Number(r.property_count || 0), 0);

  const handleAdd = async () => {
    setFormError('');
    setFormNotice('');
    if (!email.trim()) {
      setFormError('Enter the realtor\'s email address.');
      return;
    }
    const result: any = await addAgent({ email: email.trim() });
    if (result?.error) {
      const errs = result.error?.errors?.email;
      setFormError(Array.isArray(errs) ? errs[0] : result.error?.message || 'Could not add that realtor.');
      return;
    }
    setFormNotice(result?.data?.message || 'Done.');
    setEmail('');
    setShowAddForm(false);
  };

  const handleRemove = async (agentUserId: number) => {
    await removeAgent(agentUserId);
    setConfirmRemoveId(null);
  };

  const handleRevoke = async (inviteId: number) => {
    await revokeInvite(inviteId);
    setConfirmRevokeId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto space-y-6">
        {/* Stat Cards — real counts only; no fabricated "Clients" or
            "Revenue" here, those belong on Revenue/Customers. */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Realtors on Roster</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-orange-100">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '—' : rows.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Properties Listed by Roster</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-100">
                <HomeIcon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '—' : totalProperties}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Pending Invites</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-100">
                <Mail className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{invitesLoading ? '—' : pendingInvites.length}</p>
          </div>
        </div>

        {formNotice && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">{formNotice}</p>}

        {/* Realtors Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search realtors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/company/realtor-rankings"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-gray-500" />
                Ranking
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm((s) => !s);
                  setFormError('');
                }}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Realtor
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Add a realtor by email
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="realtor@example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button
                  type="button"
                  disabled={adding}
                  onClick={handleAdd}
                  className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50"
                >
                  {adding ? 'Adding…' : 'Add'}
                </button>
              </div>
              {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
              <p className="text-xs text-gray-400 mt-2">
                If they already have an unattached HouseBank realtor account, they're added instantly. If
                not, they'll get a spot waiting for them — they just need to sign up as a realtor using
                this same email, and they'll join your roster automatically.
              </p>
            </div>
          )}

          {isLoading ? (
            <p className="px-6 py-8 text-sm text-gray-500">Loading your roster…</p>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {rows.length === 0
                  ? "No realtors on your roster yet — add one by email above."
                  : 'No realtors match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs font-medium border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Realtor</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Phone</th>
                    <th className="px-6 py-3 text-left">Properties</th>
                    <th className="px-6 py-3 text-left">Verification</th>
                    <th className="px-6 py-3 text-left">Joined</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((realtor: any) => {
                    const avatar = imageUrl(realtor.avatar_path);
                    return (
                      <tr key={realtor.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {avatar ? (
                              <img src={avatar} alt={realtor.full_name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {initialsFor(realtor.full_name)}
                              </div>
                            )}
                            <span className="font-medium text-gray-800">{realtor.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{realtor.email}</td>
                        <td className="px-6 py-4 text-gray-600">{realtor.phone || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium text-center">{realtor.property_count}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificationStyle[realtor.verification_status] || verificationStyle.unverified}`}>
                            {(realtor.verification_status || 'unverified').replace(/^./, (c: string) => c.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(realtor.joined_at)}</td>
                        <td className="px-6 py-4">
                          {confirmRemoveId === realtor.user_id ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={removing}
                                onClick={() => handleRemove(realtor.user_id)}
                                className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRemoveId(null)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => navigate(`/company/transfer-agent?agent=${realtor.user_id}`)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                title="Transfer this realtor's properties"
                              >
                                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRemoveId(realtor.user_id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                title="Remove from roster"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Invites — emails added before the person had an
            account. Nothing here means every recent invite either got
            attached immediately (independent agent already existed) or
            hasn't been added yet. */}
        {pendingInvites.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Pending Invites</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Waiting for these people to sign up as a realtor on HouseBank using the email shown.
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingInvites.map((invite: any) => (
                <div key={invite.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{invite.email}</p>
                      <p className="text-xs text-gray-400">Invited {formatDate(invite.created_at)}</p>
                    </div>
                  </div>
                  {confirmRevokeId === invite.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={revoking}
                        onClick={() => handleRevoke(invite.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRevokeId(null)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmRevokeId(invite.id)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      title="Revoke invite"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyManageRealtor;
