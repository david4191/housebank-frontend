import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import { useGetAdminOverviewQuery } from '../../../redux/housebank.ts';

/** Same imageUrl() convention as every other property-image consumer in
 * this codebase (see AdminPropertyManagement.tsx for the full note) --
 * this dashboard's "Recent Properties" table had the same raw-path bug. */
function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const DONUT_COLORS = ['#2563eb', '#15803d', '#fb923c', '#a855f7', '#ec4899'];

const ROLE_LABELS: Record<string, string> = {
  customer: 'Customer',
  agent: 'Realtor',
  company: 'Company',
  admin: 'Admin',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_company_review: 'Awaiting Company Review',
  pending: 'Pending Review',
  approved: 'Live',
  rejected: 'Rejected',
  sold: 'Sold',
  rented: 'Rented',
  archived: 'Archived',
  blocked: 'Blocked',
};

function timeAgo(isoLike: string) {
  const then = new Date(isoLike.replace(' ', 'T') + 'Z').getTime();
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

function formatMoney(price: string | number, currency: string) {
  const n = Number(price);
  if (Number.isNaN(n)) return `${currency} ${price}`;
  if (n >= 1_000_000) return `${currency === 'NGN' ? '₦' : currency}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${currency === 'NGN' ? '₦' : currency}${(n / 1_000).toFixed(0)}K`;
  return `${currency === 'NGN' ? '₦' : currency}${n}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({
  title, value, iconBg, icon, change, changeColor = 'text-green-600',
}: {
  title: string; value: string; iconBg: string; icon: React.ReactNode;
  change: string; changeColor?: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 flex-1 min-w-[160px]">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
    <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Custom donut label
// ─────────────────────────────────────────────────────────────────────────────
const DonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = Math.round(percent * 100);
  if (pct < 10) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {pct}%
    </text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Joan, Sep 2026: "most pages are still static... admin/overview". Every
 * number and row on this page used to be a hardcoded sample (1500
 * properties, "Mathew", a donut that always showed the same three
 * companies) with no backend behind any of it. GET /admin/overview
 * (AdminStats.js) now computes every one of these from live tables --
 * counts, month-over-month signup growth, a real properties-per-month
 * trend, real top companies by live listing count, the real platform
 * activity feed, and the real most-recently-created listings.
 */
const AdminOverview = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const displayName = auth.user?.full_name || auth.user?.email || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const { data, isLoading } = useGetAdminOverviewQuery();

  const counts = data?.counts || { total_properties: 0, total_companies: 0, total_realtors: 0, total_customers: 0 };
  const platformGrowth = data?.platform_growth ?? 0;
  const trend = (data?.properties_trend || []).length > 0
    ? data.properties_trend
    : [{ month: '—', value: 0 }];
  const topCompanies = data?.top_companies || [];
  const activity = data?.recent_activity || [];
  const recentProperties = data?.recently_added_properties || [];

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto space-y-6">

        {/* ── Title row ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-gray-400">Hello {displayName}</p>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
          </div>
          <button
            onClick={() => navigate('/admin/companies')}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Manage Companies
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            Loading dashboard…
          </div>
        ) : (
          <>
            {/* ── Stat cards ── */}
            <div className="flex flex-wrap gap-4">
              <StatCard title="Total Properties" value={String(counts.total_properties)} iconBg="bg-blue-100"
                icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75V21H3V9.75z" /></svg>}
                change="Live count from the database" />
              <StatCard title="Companies" value={String(counts.total_companies)} iconBg="bg-pink-100"
                icon={<svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" /></svg>}
                change="Registered companies" />
              <StatCard title="Total Realtors" value={String(counts.total_realtors)} iconBg="bg-orange-100"
                icon={<svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                change="Individual + company-attached" />
              <StatCard title="Total Customers" value={String(counts.total_customers)} iconBg="bg-orange-100"
                icon={<svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                change="Registered customer accounts" />
              <StatCard title="Platform Growth" value={`${platformGrowth > 0 ? '+' : ''}${platformGrowth}%`} iconBg="bg-green-100"
                icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                change="New signups, this month vs last" changeColor={platformGrowth >= 0 ? 'text-green-600' : 'text-red-500'} />
            </div>

            {/* ── Charts + Activity row ── */}
            <div className="flex flex-col lg:flex-row gap-5">

              {/* Properties Listed Trend */}
              <div className="flex-[1.4] bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Properties Listed Trend</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={36} allowDecimals={false} />
                    <Tooltip formatter={(v: any) => [v ?? 0, 'Properties']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Area
                      type="monotone" dataKey="value"
                      stroke="#16a34a" strokeWidth={2.5}
                      fill="url(#trendGrad)"
                      dot={{ r: 5, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Top Performing Companies */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Top Performing Companies</h2>
                {topCompanies.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-gray-400 text-center px-4">
                    No approved listings under any company yet.
                  </div>
                ) : (
                  <div className="flex flex-col items-center flex-1 justify-center">
                    <PieChart width={200} height={180}>
                      <Pie
                        data={topCompanies} cx={100} cy={90}
                        innerRadius={52} outerRadius={88}
                        dataKey="value" labelLine={false}
                        label={DonutLabel}
                        startAngle={90} endAngle={-270}
                      >
                        {topCompanies.map((_: any, idx: number) => (
                          <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="space-y-2 w-full mt-2">
                      {topCompanies.map((d: any, idx: number) => (
                        <div key={d.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }} />
                            <span className="text-gray-600">{d.name}</span>
                          </div>
                          <span className="font-medium text-gray-800">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activities */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
                  <button onClick={() => navigate('/admin/notifications')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">See all</button>
                </div>
                {activity.length === 0 ? (
                  <p className="text-sm text-gray-400">No activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((act: any) => (
                      <div key={act.id} className="border border-gray-100 rounded-lg p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-800">
                            {ROLE_LABELS[act.recipient_role] ?? act.recipient_role}
                          </span>
                          <span className="text-xs text-gray-400">{timeAgo(act.created_at)}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{act.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Recently Added Properties ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Recently Added Properties</h2>
                <button onClick={() => navigate('/admin/properties')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  See All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {recentProperties.length === 0 ? (
                <p className="text-sm text-gray-400 px-6 py-8 text-center">No properties listed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                      <th className="px-6 py-3 text-left">Property</th>
                      <th className="px-6 py-3 text-left">Company</th>
                      <th className="px-6 py-3 text-left">Realtor</th>
                      <th className="px-6 py-3 text-left">Price</th>
                      <th className="px-6 py-3 text-left">Type</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentProperties.map((prop: any) => (
                      <tr key={prop.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/admin/properties')}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {prop.cover_image ? (
                              <img src={imageUrl(prop.cover_image) || ''} alt={prop.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                            )}
                            <span className="font-medium text-gray-800">{prop.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{prop.company_name || '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{prop.lister_name || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{formatMoney(prop.price, prop.currency)}</td>
                        <td className="px-6 py-4 text-gray-600 capitalize">{prop.listing_type}</td>
                        <td className="px-6 py-4">
                          <span className="px-4 py-1 rounded-full border border-blue-300 text-blue-500 text-xs font-medium">
                            {STATUS_LABELS[prop.status] || prop.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminOverview;
