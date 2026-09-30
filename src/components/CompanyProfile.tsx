import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Building2, MapPin, ShieldCheck, Square, Star } from 'lucide-react';
import {
  useGetCompanyAgentsQuery,
  useGetPropertiesQuery,
  useGetPublicCompanyQuery,
} from '../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function initialsFor(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const listingTypeLabel: Record<string, string> = { sale: 'For Sale', rent: 'For Rent', investment: 'Investment' };

/**
 * A single company's public profile -- logo, verification status, its
 * agent roster, and its approved listings (Joan, Sep 2026 -- "the main
 * website is meant to have property listings from the various companies
 * also show the agents"). Linked from AgentsDirectory.tsx and from
 * every property card's "Listed by" panel isn't wired here yet, just
 * the directory; reachable at /companies/:id.
 */
const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading, isError } = useGetPublicCompanyQuery(id as string, { skip: !id });
  const { data: agents } = useGetCompanyAgentsQuery(id as string, { skip: !id });
  const { data: propertiesResult } = useGetPropertiesQuery(
    { company_id: id, per_page: 12 },
    { skip: !id }
  );
  const properties = propertiesResult?.items || [];

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">Loading company…</div>;
  }

  if (isError || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">This company profile isn't available.</p>
          <Link to="/agents" className="mt-4 inline-block text-sm text-green-600 hover:text-green-700 font-medium">
            Back to directory
          </Link>
        </div>
      </div>
    );
  }

  const logo = imageUrl(company.logo_path);
  const verified = company.verification_status === 'verified';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Company header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo ? (
                <img src={logo} alt={company.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{company.company_name}</h1>
                {verified ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span
                    className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full"
                    title="This company hasn't completed HouseBank's verification review yet."
                  >
                    Unverified
                  </span>
                )}
              </div>
              {company.company_address && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  {company.company_address}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-600 mt-4">
                <span>{company.property_count} listing{company.property_count === 1 ? '' : 's'}</span>
                <span>{company.agent_count} realtor{company.agent_count === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agents roster */}
        {agents && agents.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Realtors at {company.company_name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((a: any) => {
                const avatar = imageUrl(a.avatar_path);
                return (
                  <div key={a.user_id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-semibold overflow-hidden flex-shrink-0">
                        {avatar ? (
                          <img src={avatar} alt={a.full_name} className="w-full h-full object-cover" />
                        ) : (
                          initialsFor(a.full_name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{a.full_name}</p>
                        {Number(a.rating_count) > 0 && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            {Number(a.rating_avg).toFixed(1)} ({a.rating_count})
                          </p>
                        )}
                      </div>
                    </div>
                    {a.bio && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{a.bio}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Properties */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Listings from {company.company_name}</h2>
          {properties.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No active listings from this company right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: any) => {
                const img = imageUrl(property.cover_image);
                return (
                  <Link
                    key={property.id}
                    to={`/property-details/${property.id}`}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-44 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img src={img} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                      <span className="absolute top-3 left-3 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        {listingTypeLabel[property.listing_type] || 'For Sale'}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {property.bedrooms ?? '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          {property.bathrooms ?? '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3.5 h-3.5" />
                          {property.size_sqm ?? '-'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatNaira(property.price)}
                        {property.listing_type === 'rent' && (
                          <span className="text-xs font-normal text-gray-500">/mo</span>
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
