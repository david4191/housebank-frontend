import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Search, ShieldCheck, Star, User } from 'lucide-react';
import { useGetPublicAgentsQuery, useGetPublicCompaniesQuery } from '../redux/housebank.ts';

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

/**
 * The public "companies & agents" directory (Joan, Sep 2026 -- "the main
 * website is meant to have property listings from the various companies
 * also show the agents"). No such page existed at all before this
 * tranche -- RealtorLanding.tsx is a recruitment/marketing page ("become
 * a realtor"), not a directory of who's already on the platform. Backed
 * by the new public GET /companies and GET /agents endpoints.
 */
const AgentsDirectory = () => {
  const [tab, setTab] = useState<'companies' | 'agents'>('companies');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(12);

  const { data: companiesResult, isLoading: companiesLoading } = useGetPublicCompaniesQuery(
    { per_page: perPage, ...(search ? { q: search } : {}) },
    { skip: tab !== 'companies' }
  );
  const { data: agentsResult, isLoading: agentsLoading } = useGetPublicAgentsQuery(
    { per_page: perPage, ...(search ? { q: search } : {}) },
    { skip: tab !== 'agents' }
  );

  const companies = companiesResult?.items || [];
  const agents = agentsResult?.items || [];
  const total = tab === 'companies' ? companiesResult?.total ?? 0 : agentsResult?.total ?? 0;
  const isLoading = tab === 'companies' ? companiesLoading : agentsLoading;
  const shown = tab === 'companies' ? companies.length : agents.length;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Companies & Realtors</h1>
          <p className="text-gray-600 mt-2">
            Browse verified real estate companies and the realtors listing on HouseBank.
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex space-x-2 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            <button
              onClick={() => {
                setTab('companies');
                setPerPage(12);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === 'companies' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => {
                setTab('agents');
                setPerPage(12);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === 'agents' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Realtors
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPerPage(12);
              }}
              placeholder={tab === 'companies' ? 'Search companies…' : 'Search realtors…'}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-16">Loading…</div>
        ) : tab === 'companies' ? (
          companies.length === 0 ? (
            <div className="text-center text-gray-500 py-16">No companies found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((c: any) => {
                const logo = imageUrl(c.logo_path);
                const verified = c.verification_status === 'verified';
                return (
                  <Link
                    key={c.id}
                    to={`/companies/${c.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logo ? (
                          <img src={logo} alt={c.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate">{c.company_name}</h3>
                          {verified ? (
                            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                              Unverified
                            </span>
                          )}
                        </div>
                        {c.company_address && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {c.company_address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-100">
                      <span>{c.property_count} listing{c.property_count === 1 ? '' : 's'}</span>
                      <span>{c.agent_count} realtor{c.agent_count === 1 ? '' : 's'}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        ) : agents.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No realtors found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((a: any) => {
              const avatar = imageUrl(a.avatar_path);
              const companyUnverified =
                a.company_id && a.company_verification_status && a.company_verification_status !== 'verified';
              const content = (
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold overflow-hidden flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={a.full_name} className="w-full h-full object-cover" />
                      ) : (
                        initialsFor(a.full_name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{a.full_name}</h3>
                      {a.company_name ? (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          {a.company_name}
                          {companyUnverified && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          Independent
                        </p>
                      )}
                    </div>
                  </div>
                  {a.bio && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{a.bio}</p>}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
                    {Number(a.rating_count) > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        {Number(a.rating_avg).toFixed(1)}
                      </span>
                    )}
                    <span>{a.property_count} listing{a.property_count === 1 ? '' : 's'}</span>
                  </div>
                </div>
              );
              return a.company_id ? (
                <Link key={a.user_id} to={`/companies/${a.company_id}`}>
                  {content}
                </Link>
              ) : (
                <div key={a.user_id}>{content}</div>
              );
            })}
          </div>
        )}

        {!isLoading && shown < total && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPerPage((p) => p + 12)}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsDirectory;
