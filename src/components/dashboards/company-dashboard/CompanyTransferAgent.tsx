// src/components/dashboards/company-dashboard/CompanyTransferAgent.tsx
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Search, Home, CheckCircle, Building2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetMyPropertiesQuery,
  useGetMyCompanyAgentsQuery,
  useReassignPropertyAgentMutation,
} from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

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

const SuccessCard = ({
  title, subtitle, onDone,
}: { title: string; subtitle: string; onDone: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg mb-5">
      <CheckCircle className="w-9 h-9 text-white fill-white" strokeWidth={2} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 whitespace-pre-line">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
    <button
      onClick={onDone}
      className="mt-6 px-8 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
    >
      Done
    </button>
  </div>
);

/**
 * The old page was entirely fabricated: two hardcoded "Rendez House
 * Bay" property cards, five hardcoded agent names with randomuser.me
 * photos and made-up "N Properties" counts, and a form pre-filled with
 * "Ibrahim Haruna" and a fake license ID that submitted nothing —
 * clicking "Transfer Property" just flipped local state to a canned
 * success screen no matter what was on the page.
 *
 * This is the real thing: pick from the company's actual listings
 * (properties/mine — the same roster-wide data CompanyProperty.tsx
 * uses), pick a real destination from the roster (or "Keep with
 * company"), and submit through the same
 * PATCH /properties/:id/reassign-agent endpoint CompanyAddproperty.tsx
 * already uses for the single-property assign step — this page is
 * just the bulk, standalone version of that same capability. It's
 * reached either directly or via a "Transfer" action on a specific
 * roster agent's row in CompanyRealtor.tsx, which pre-filters "From"
 * to that agent's current listings via a ?agent= query param.
 */
const CompanyTransferAgent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectAgent = searchParams.get('agent') || 'all';

  const { data: properties, isLoading: loadingProps } = useGetMyPropertiesQuery();
  const { data: roster, isLoading: loadingRoster } = useGetMyCompanyAgentsQuery();
  const [reassignAgent] = useReassignPropertyAgentMutation();

  const rows = properties || [];
  const agents = roster || [];

  const [fromFilter, setFromFilter] = useState<string>(preselectAgent);
  const [search, setSearch] = useState('');
  const [selectedProps, setSelectedProps] = useState<number[]>([]);
  const [destAgent, setDestAgent] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pageState, setPageState] = useState<'form' | 'success'>('form');
  const [resultSummary, setResultSummary] = useState<{ count: number; destName: string }>({ count: 0, destName: '' });

  const filteredProps = useMemo(() => {
    let list = rows;
    if (fromFilter === 'company') {
      list = list.filter((p: any) => !p.lister_name);
    } else if (fromFilter !== 'all') {
      const agentId = Number(fromFilter);
      list = list.filter((p: any) => Number(p.listed_by_user_id) === agentId);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p: any) => p.title?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q));
    }
    return list;
  }, [rows, fromFilter, search]);

  const toggleProp = (id: number) =>
    setSelectedProps((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const destAgentName =
    destAgent === 'company'
      ? 'your company'
      : agents.find((a: any) => String(a.user_id) === destAgent)?.full_name || 'the selected realtor';

  const canSubmit = selectedProps.length > 0 && destAgent !== '' && !submitting;

  const handleTransfer = async () => {
    if (!canSubmit) return;
    setSubmitError('');
    setSubmitting(true);
    const agentUserId = destAgent === 'company' ? null : Number(destAgent);
    const results = await Promise.allSettled(
      selectedProps.map((id) => reassignAgent({ id, agent_user_id: agentUserId }).unwrap())
    );
    setSubmitting(false);
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - succeeded;
    if (succeeded > 0) {
      setResultSummary({ count: succeeded, destName: destAgentName });
      setPageState('success');
      setSelectedProps([]);
    }
    if (failed > 0) {
      setSubmitError(`${failed} of ${results.length} propert${failed === 1 ? 'y' : 'ies'} could not be transferred.`);
    }
  };

  if (pageState === 'success') {
    return (
      <div className="flex flex-col h-full">
        <CustomerHeader />
        <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <SuccessCard
              title={'Properties Transferred'}
              subtitle={`${resultSummary.count} propert${resultSummary.count === 1 ? 'y' : 'ies'} now list under ${resultSummary.destName}.`}
              onDone={() => navigate('/company/realtors')}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/company/realtors')} className="text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Transfer Properties</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Select one or more properties, then choose who they should move to.
            </p>
          </div>
        </div>

        {/* ── Property selection ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">From</label>
              <select
                value={fromFilter}
                onChange={(e) => setFromFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All roster properties</option>
                <option value="company">Listed directly by company</option>
                {agents.map((a: any) => (
                  <option key={a.user_id} value={a.user_id}>{a.full_name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-56"
              />
            </div>
          </div>

          {loadingProps ? (
            <p className="text-sm text-gray-500 py-6">Loading properties…</p>
          ) : filteredProps.length === 0 ? (
            <div className="py-10 text-center">
              <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {rows.length === 0 ? "Your company doesn't have any properties yet." : 'No properties match here.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filteredProps.map((property: any) => {
                const img = imageUrl(property.cover_image);
                const checked = selectedProps.includes(property.id);
                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => toggleProp(property.id)}
                    className={`w-56 text-left rounded-xl border-2 overflow-hidden transition-all shadow-sm ${
                      checked ? 'border-green-500' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img src={img} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <Home className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      {checked && (
                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900 truncate">{property.title}</span>
                        <span className="text-xs font-bold text-gray-700 flex-shrink-0">{formatNaira(property.price)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{property.city}</p>
                      <p className="text-xs text-gray-500">
                        Currently: <span className="font-medium">{property.lister_name || 'Company'}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Select destination ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Transfer to</h2>
          {loadingRoster ? (
            <p className="text-sm text-gray-500">Loading roster…</p>
          ) : (
            <div className="flex gap-4 flex-wrap items-center">
              <button
                type="button"
                onClick={() => setDestAgent('company')}
                className={`w-36 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  destAgent === 'company' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-800 text-center">Keep with company</span>
              </button>
              {agents.map((agent: any) => {
                const avatar = imageUrl(agent.avatar_path);
                const active = destAgent === String(agent.user_id);
                return (
                  <button
                    key={agent.user_id}
                    type="button"
                    onClick={() => setDestAgent(String(agent.user_id))}
                    className={`w-36 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      active ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    {avatar ? (
                      <img src={avatar} alt={agent.full_name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold">
                        {initialsFor(agent.full_name)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-800 text-center">{agent.full_name}</span>
                    <span className="text-xs font-semibold text-orange-500">{agent.property_count} Properties</span>
                  </button>
                );
              })}
              {agents.length === 0 && (
                <p className="text-sm text-gray-400">
                  No realtors on your roster yet — add one from Manage Realtors to transfer to a person.
                </p>
              )}
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{submitError}</p>
        )}

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleTransfer}
            className="px-10 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Transferring…'
              : selectedProps.length > 0
              ? `Transfer ${selectedProps.length} Propert${selectedProps.length === 1 ? 'y' : 'ies'}`
              : 'Transfer Properties'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/realtors')}
            className="px-10 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyTransferAgent;
