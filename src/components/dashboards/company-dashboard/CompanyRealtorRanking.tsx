// src/components/dashboards/company-dashboard/CompanyRealtorRanking.tsx
import { useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetCompanyAgentRankingQuery } from '../../../redux/housebank.ts';

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

const rankStyle = ['bg-yellow-400', 'bg-gray-400', 'bg-orange-400'];

/**
 * The old page hardcoded exactly 3 podium entries with fields that
 * don't exist anywhere in this schema (a "HouseBank ID", "Year of
 * Experience", a "Bio / Motivation" tagline) and a fake "Request (11)"
 * button. A real roster can have 0, 1, 2 or many agents — forcing that
 * onto a fixed 3-slot podium either fabricates entries or hides real
 * ones, so this is a straightforward ranked list instead: agents on
 * this company's roster ordered by distinct customers reached (see
 * CompanyAgent.ranking() in hb-backend), then by property count.
 */
const CompanyRealtorRanking = () => {
  const { data: ranked, isLoading } = useGetCompanyAgentRankingQuery();
  const [search, setSearch] = useState('');

  const rows = ranked || [];
  const filtered = rows.filter((r: any) => (r.full_name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Realtor Ranking</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked by customers reached across the properties each realtor lists.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search realtors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-gray-500">Loading ranking…</p>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {rows.length === 0
                  ? 'No realtors on your roster yet — add one from the Manage Realtor page to see rankings here.'
                  : 'No realtors match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs font-medium border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Rank</th>
                    <th className="px-6 py-3 text-left">Realtor</th>
                    <th className="px-6 py-3 text-left">Customers Reached</th>
                    <th className="px-6 py-3 text-left">Properties Listed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((realtor: any, idx: number) => {
                    const avatar = imageUrl(realtor.avatar_path);
                    return (
                      <tr key={realtor.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              rankStyle[idx] || 'bg-gray-300'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
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
                        <td className="px-6 py-4 text-gray-700 font-medium">{realtor.customer_count}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{realtor.property_count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyRealtorRanking;
