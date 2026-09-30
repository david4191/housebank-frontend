// src/components/dashboards/admin-dashboard/ReportsAnalytics.tsx
import { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminReportsQuery,
  useUpdateReportStatusMutation,
  useGetAdminReportStatsQuery,
} from '../../../redux/housebank.ts';

/**
 * Joan, Sep 2026: "/admin/reports ... fix and correct the static
 * pages". This page used to be a fabricated bar chart (fake monthly
 * "Company/Realtor/Customers" counts, a "257,587 Total Users" stat
 * card) with no connection to anything real. The actual backend for
 * this already existed from an earlier tranche -- the /report-concern
 * and /report-scam public forms write to incident_reports, and
 * GET /reports + POST /reports/:id/status were already admin-gated --
 * but nothing in the UI ever surfaced them. This is that inbox, made
 * real: every neighbourhood-concern and scam report submitted through
 * the site, filterable by status and type, with a working
 * new -> reviewing -> resolved workflow.
 *
 * Scope note: this surfaces IncidentReport data only (the two report
 * forms). It intentionally does not cover the separate "leads" module
 * (newsletter/contact submissions) -- that's a similar but distinct
 * gap, not what Joan named "reports" here.
 */

const STATUS_STYLE: Record<string, string> = {
  new: 'border-orange-400 text-orange-600 bg-orange-50',
  reviewing: 'border-blue-400 text-blue-600 bg-blue-50',
  resolved: 'border-green-400 text-green-600 bg-green-50',
};

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  resolved: 'Resolved',
};

const TYPE_LABEL: Record<string, string> = {
  neighbourhood_concern: 'Neighbourhood Concern',
  scam: 'Scam Report',
};

const STATUS_DONUT_COLORS: Record<string, string> = {
  new: '#fb923c',
  reviewing: '#2563eb',
  resolved: '#16a34a',
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

type StatusTab = 'all' | 'new' | 'reviewing' | 'resolved';
const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'all', label: 'All Reports' },
  { key: 'new', label: 'New' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'resolved', label: 'Resolved' },
];

type TypeFilter = 'all' | 'neighbourhood_concern' | 'scam';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [detailsReport, setDetailsReport] = useState<any | null>(null);

  const { data, isLoading } = useGetAdminReportsQuery({
    page,
    per_page: perPage,
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
  });
  const { data: stats } = useGetAdminReportStatsQuery();

  const items = data?.items || [];
  const total = data?.total || 0;
  const newCount = items.filter((r: any) => r.status === 'new').length;

  const trend = (stats?.trend || []).length > 0 ? stats!.trend : [{ month: '—', concerns: 0, scams: 0 }];
  const byStatus = (stats?.by_status || []).filter((s) => s.count > 0);

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reports {total ? `(${total})` : ''}</h2>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); setPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="all">All Types</option>
            <option value="neighbourhood_concern">Neighbourhood Concern</option>
            <option value="scam">Scam Report</option>
          </select>
        </div>

        {/* Real charts, driven by GET /reports/stats — replaced a
            fabricated bar chart on fake data in an earlier pass of this
            page; Joan, Sep 2026: "I didn't see the graphs and charts
            anymore" after that pass swapped the chart for a table with
            nothing to visually summarize the inbox. */}
        <div className="flex flex-col lg:flex-row gap-5 mb-6">
          <div className="flex-[1.6] bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Reports Filed, Last 6 Months</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trend}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="4 4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={28} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'concerns' ? 'Neighbourhood Concern' : 'Scam Report')} />
                <Bar dataKey="concerns" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scams" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 mb-3">By Status</h3>
            {byStatus.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400 text-center px-4">
                No reports yet.
              </div>
            ) : (
              <div className="flex flex-col items-center flex-1 justify-center">
                <PieChart width={180} height={160}>
                  <Pie data={byStatus} cx={90} cy={80} innerRadius={46} outerRadius={76} dataKey="count" startAngle={90} endAngle={-270}>
                    {byStatus.map((s, idx) => (
                      <Cell key={idx} fill={STATUS_DONUT_COLORS[s.status] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
                <div className="space-y-1.5 w-full mt-2">
                  {byStatus.map((s) => (
                    <div key={s.status} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_DONUT_COLORS[s.status] || '#94a3b8' }} />
                        <span className="text-gray-600">{STATUS_LABEL[s.status] || s.status}</span>
                      </div>
                      <span className="font-medium text-gray-800">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-6">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setPage(1); }}
                className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === t.key ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">Loading reports…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No reports in this view.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Reporter</th>
                    <th className="px-6 py-3 text-left">Concerns</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Submitted</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((r: any) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${r.type === 'scam' ? 'text-red-600' : 'text-gray-700'}`}>
                          {r.type === 'scam' ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {TYPE_LABEL[r.type] || r.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {r.reporter_full_name || <span className="text-gray-400">Anonymous</span>}
                        {r.reporter_email && <div className="text-xs text-gray-400">{r.reporter_email}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {r.type === 'scam' ? (r.scammer_name || <span className="text-gray-400">—</span>) : (r.company_name || <span className="text-gray-400">—</span>)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">{r.description}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[r.status] || 'border-gray-300 text-gray-500 bg-white'}`}>
                          {STATUS_LABEL[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setDetailsReport(r)} className="text-sm font-medium text-green-700 hover:text-green-800">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > perPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40">
                  Previous
                </button>
                <span>Page {page} of {Math.max(1, Math.ceil(total / perPage))} &middot; {total} total</span>
                <button onClick={() => setPage((p) => (p * perPage < total ? p + 1 : p))} disabled={page * perPage >= total} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {newCount > 0 && (
          <p className="mt-3 text-xs text-gray-400">{newCount} unreviewed report{newCount === 1 ? '' : 's'} on this page.</p>
        )}
      </main>

      {detailsReport && <ReportDetailsModal report={detailsReport} onClose={() => setDetailsReport(null)} />}
    </div>
  );
};

// ── Detail / status-change modal ────────────────────────────────────────────
const ReportDetailsModal = ({ report, onClose }: { report: any; onClose: () => void }) => {
  const [updateStatus, { isLoading }] = useUpdateReportStatusMutation();
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (status: 'new' | 'reviewing' | 'resolved') => {
    setError(null);
    const result: any = await updateStatus({ id: report.id, status });
    if (result?.error) {
      setError(result.error?.message || 'Could not update this report.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium mb-1 ${report.type === 'scam' ? 'text-red-600' : 'text-gray-700'}`}>
              {report.type === 'scam' ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {TYPE_LABEL[report.type] || report.type}
            </span>
            <h3 className="text-base font-bold text-gray-900">Report #{report.id}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3 mb-5 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Reporter</p>
            <p className="text-gray-800">{report.reporter_full_name || 'Anonymous'}</p>
            {report.reporter_email && <p className="text-gray-500 text-xs">{report.reporter_email}</p>}
            {report.reporter_phone && <p className="text-gray-500 text-xs">{report.reporter_phone}</p>}
          </div>

          {report.type === 'neighbourhood_concern' && report.company_name && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Company Concerned</p>
              <p className="text-gray-800">{report.company_name}</p>
            </div>
          )}

          {report.type === 'scam' && (report.scammer_name || report.scammer_email || report.scammer_phone) && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Reported Scammer</p>
              {report.scammer_name && <p className="text-gray-800">{report.scammer_name}</p>}
              {report.scammer_email && <p className="text-gray-500 text-xs">{report.scammer_email}</p>}
              {report.scammer_phone && <p className="text-gray-500 text-xs">{report.scammer_phone}</p>}
              {report.money_lost !== null && report.money_lost !== undefined && (
                <p className="text-gray-600 text-xs mt-1">
                  Money lost: {report.money_lost ? `Yes${report.amount_lost ? ` (₦${Number(report.amount_lost).toLocaleString()})` : ''}` : 'No'}
                </p>
              )}
            </div>
          )}

          {report.incident_date && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Incident Date</p>
              <p className="text-gray-800">{report.incident_date}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{report.description}</p>
          </div>

          <p className="text-xs text-gray-400">Submitted {formatDate(report.created_at)}</p>
        </div>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <div className="flex flex-wrap gap-2">
          {(['new', 'reviewing', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              disabled={isLoading || report.status === s}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-50 ${
                report.status === s ? 'bg-gray-100 border-gray-200 text-gray-400' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {report.status === s ? `Currently ${STATUS_LABEL[s]}` : `Mark ${STATUS_LABEL[s]}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
