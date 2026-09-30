import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { useGetInvestmentOpportunitiesQuery } from '../redux/housebank.ts';

interface InvestmentOpportunity {
  id: number;
  total_target_amount: number | string;
  min_investment_amount: number | string;
  expected_roi_percent: number | string;
  tenure_months: number;
  amount_raised: number | string;
  status: 'open' | 'fully_funded' | 'closed' | 'matured';
  title: string;
  city: string | null;
  state: string | null;
  company_name: string | null;
  cover_image: string | null;
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
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

/**
 * "Invest in Property" preview on /explore and the homepage (Joan, Sep
 * 2026: "which is not coming from the DB, note there should be no
 * static product, it should all come from DB"). Used to render two
 * identical hardcoded "Magodo property & Co." cards with a fabricated
 * price-per-share/investor-count metaphor that has no basis in the real
 * schema -- the same fake metaphor InvestmentPropertyListing.tsx (the
 * full /investment page) already replaced once. This is that same fix
 * applied to the other place it was still hardcoded: real open
 * investment opportunities from GET /investments/opportunities, capped
 * to a 2-card preview, "See More" going to the full /investment browse
 * page.
 */
const InvestProperty = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetInvestmentOpportunitiesQuery({ status: 'open', per_page: 2 });
  const opportunities: InvestmentOpportunity[] = data?.data ?? [];

  const InvestmentCard = ({ investment }: { investment: InvestmentOpportunity }) => {
    const img = imageUrl(investment.cover_image);
    const pct = fundingPercent(investment);

    return (
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
        <Link to={`/investment-details/${investment.id}`}>
          <div className="w-full h-80 bg-gray-100 overflow-hidden flex items-center justify-center">
            {img ? (
              <img src={img} alt={investment.title} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-gray-300" />
            )}
          </div>
        </Link>

        <div className="p-6 space-y-4">
          <Link to={`/investment-details/${investment.id}`}>
            <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-green-700 transition-colors">
              {investment.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm">
            {investment.company_name ? `by ${investment.company_name}` : 'Listed by an independent realtor'}
            {' · '}
            {[investment.city, investment.state].filter(Boolean).join(', ') || 'Location not specified'}
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-bold text-lg">{investment.expected_roi_percent}% p.a</span>
            <span className="text-gray-500 text-sm">expected returns · {investment.tenure_months} mo tenure</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{formatNaira(investment.amount_raised)} raised</span>
              <span>{pct}% of {formatNaira(investment.total_target_amount)}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{formatNaira(investment.min_investment_amount)}</div>
              <div className="text-gray-500 text-sm">Min. investment</div>
            </div>
          </div>

          <Link
            to={`/investment-details/${investment.id}`}
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mt-6"
          >
            Invest
          </Link>
        </div>
      </div>
    );
  };

  if (!isLoading && opportunities.length === 0) return null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Invest in Property</h2>
          <button
            onClick={() => navigate('/investment')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span className="text-sm font-medium">See More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading investment opportunities…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {opportunities.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestProperty;
