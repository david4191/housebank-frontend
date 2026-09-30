import { ChevronRight, Building2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetInvestmentOpportunitiesQuery } from '../redux/housebank.ts';

interface InvestmentOpportunity {
  id: number;
  property_id: number;
  total_target_amount: number | string;
  min_investment_amount: number | string;
  expected_roi_percent: number | string;
  tenure_months: number;
  maturity_date: string | null;
  amount_raised: number | string;
  status: 'open' | 'fully_funded' | 'closed' | 'matured';
  created_at: string;
  title: string;
  city: string | null;
  state: string | null;
  address: string | null;
  company_id: number | null;
  company_name: string | null;
  company_verification_status: 'verified' | 'pending' | 'rejected' | null;
  cover_image: string | null;
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `₦${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function fundingPercent(opp: InvestmentOpportunity) {
  const raised = Number(opp.amount_raised) || 0;
  const target = Number(opp.total_target_amount) || 0;
  if (target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

const statusBadge: Record<InvestmentOpportunity['status'], { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-green-100 text-green-800' },
  fully_funded: { label: 'Fully Funded', className: 'bg-blue-100 text-blue-800' },
  closed: { label: 'Closed', className: 'bg-gray-200 text-gray-700' },
  matured: { label: 'Matured', className: 'bg-gray-200 text-gray-700' },
};

const ctaByStatus: Record<InvestmentOpportunity['status'], { label: string; className: string }> = {
  open: { label: 'Invest', className: 'bg-green-600 hover:bg-green-700 text-white' },
  fully_funded: { label: 'View Details', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  closed: { label: 'View Details', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
  matured: { label: 'View Details', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
};

/**
 * "Similar Properties" strip on /investment-details/:id (Joan, Sep 2026
 * -- "/investment isn't fixed"). Used to be 2 hardcoded fake entries with
 * the same fabricated "shares/investors" metaphor as the rest of the
 * page. Rebuilt on the same GET investments/opportunities list endpoint
 * the browse grid uses, reading :id straight from the route (this
 * component is rendered as a descendant of the /investment-details/:id
 * route in pages/InvestmentDetails.tsx, so useParams resolves correctly
 * without any prop drilling) and filtering the current opportunity out
 * of its own "similar" results client-side.
 */
const SimilarPropertiesSection = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetInvestmentOpportunitiesQuery({ per_page: 3 });

  const similarProperties: InvestmentOpportunity[] = (data?.data ?? []).filter(
    (opp: InvestmentOpportunity) => String(opp.id) !== String(id)
  );

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Similar Properties</h2>
          <Link
            to="/investment"
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-sm font-medium">See More</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading similar opportunities…</p>
        ) : isError ? (
          <p className="text-center text-red-600 py-8">Couldn't load similar opportunities right now.</p>
        ) : similarProperties.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No other investment opportunities available right now.</p>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {similarProperties.map((opp) => {
              const img = imageUrl(opp.cover_image);
              const pct = fundingPercent(opp);
              const badge = statusBadge[opp.status];
              const cta = ctaByStatus[opp.status];

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Property Image */}
                  <Link to={`/investment-details/${opp.id}`}>
                    <div className="relative h-64 lg:h-80 bg-gray-100">
                      {img ? (
                        <img src={img} alt={opp.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Building2 className="w-10 h-10" />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </Link>

                  {/* Property Information */}
                  <div className="p-6">
                    {/* Title */}
                    <Link to={`/investment-details/${opp.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight hover:text-green-700 transition-colors cursor-pointer">
                        {opp.title}
                      </h3>
                    </Link>

                    {/* Location */}
                    <p className="text-sm text-gray-500 mb-3">
                      {[opp.city, opp.state].filter(Boolean).join(', ') || 'Location not specified'}
                    </p>

                    {/* Expected Returns */}
                    <p className="text-sm text-green-600 font-medium mb-4">
                      {opp.expected_roi_percent}% p.a expected returns · {opp.tenure_months} mo tenure
                    </p>

                    {/* Funding progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{formatNaira(opp.amount_raised)} raised</span>
                        <span>
                          {pct}% of {formatNaira(opp.total_target_amount)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {/* Min investment */}
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                          {formatNaira(opp.min_investment_amount)}
                        </p>
                        <p className="text-sm text-gray-500">Min. investment</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-start">
                      <Link
                        to={`/investment-details/${opp.id}`}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${cta.className}`}
                      >
                        {cta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SimilarPropertiesSection;
