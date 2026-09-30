import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useGetInvestmentOpportunitiesQuery } from '../redux/housebank.ts';
import PropertyFilterHeader from './Investment';

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
  open: { label: 'Invest Now', className: 'bg-green-600 hover:bg-green-700 text-white' },
  fully_funded: { label: 'View Details', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  closed: { label: 'View Details', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
  matured: { label: 'View Details', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
};

/**
 * The public /investment browse grid (Joan, Sep 2026 -- "/investment
 * isn't fixed"). Used to render 4 hardcoded fake properties with a
 * fabricated "shares/investors" metaphor that has no basis in the real
 * schema. Rebuilt on GET investments/opportunities, using the real
 * progress-bar metaphor the investment_properties table actually
 * supports: amount_raised against total_target_amount, expected ROI,
 * tenure, and minimum investment.
 *
 * This component is also the owner of the filter state for the whole
 * /investment page: it renders the (now fully controlled)
 * PropertyFilterHeader as its own child and keeps both the "draft"
 * values typed into the filter bar and the "applied" values actually
 * sent to the API, so typing doesn't refetch on every keystroke -- only
 * the Active/Sold Out toggle applies immediately, everything else waits
 * for Search (or Enter).
 */
const PropertyListingsPage = () => {
  const [status, setStatus] = useState<'open' | 'fully_funded'>('open');
  const [location, setLocation] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<{ q: string; min_amount: string; max_amount: string }>({
    q: '',
    min_amount: '',
    max_amount: '',
  });

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = { status, per_page: 12 };
    if (appliedFilters.q.trim()) params.q = appliedFilters.q.trim();
    if (appliedFilters.min_amount) params.min_amount = appliedFilters.min_amount;
    if (appliedFilters.max_amount) params.max_amount = appliedFilters.max_amount;
    return params;
  }, [status, appliedFilters]);

  const { data, isLoading, isFetching, isError } = useGetInvestmentOpportunitiesQuery(queryParams);
  const opportunities: InvestmentOpportunity[] = data?.data ?? [];

  const handleSearch = () => {
    setAppliedFilters({ q: location, min_amount: minAmount, max_amount: maxAmount });
  };

  return (
    <div className="bg-white min-h-screen">
      <PropertyFilterHeader
        status={status}
        onStatusChange={setStatus}
        location={location}
        onLocationChange={setLocation}
        minAmount={minAmount}
        onMinAmountChange={setMinAmount}
        maxAmount={maxAmount}
        onMaxAmountChange={setMaxAmount}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || isFetching ? (
          <p className="text-center text-gray-500 py-16">Loading investment opportunities…</p>
        ) : isError ? (
          <p className="text-center text-red-600 py-16">
            Something went wrong loading investment opportunities. Please try again.
          </p>
        ) : opportunities.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No investment opportunities available right now.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {opportunities.map((opp) => {
              const img = imageUrl(opp.cover_image);
              const pct = fundingPercent(opp);
              const badge = statusBadge[opp.status];
              const cta = ctaByStatus[opp.status];
              const isUnverified =
                !!opp.company_name && opp.company_verification_status !== 'verified';

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Main Property Image */}
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

                  {/* Property Details */}
                  <div className="p-6">
                    <Link to={`/investment-details/${opp.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight hover:text-green-700 transition-colors">
                        {opp.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-1">
                      {[opp.city, opp.state].filter(Boolean).join(', ') || 'Location not specified'}
                    </p>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-2 flex-wrap">
                      {opp.company_name ? `Listed by ${opp.company_name}` : 'Listed by an independent realtor'}
                      {isUnverified && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          Unverified
                        </span>
                      )}
                    </p>

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
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatNaira(opp.min_investment_amount)}</p>
                        <p className="text-sm text-gray-500">Min. investment</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-start">
                      <Link
                        to={`/investment-details/${opp.id}`}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${cta.className}`}
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
    </div>
  );
};

export default PropertyListingsPage;
