import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import useAuth from '../hooks/useAuth.tsx';
import { useGetInvestmentOpportunityQuery, useCreateInvestmentMutation } from '../redux/housebank.ts';

interface InvestmentOpportunityDetail {
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
  description: string | null;
  listed_by_user_id: number | null;
  company_address: string | null;
  logo_path: string | null;
  images: { id: number; file_path: string }[];
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `₦${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function fundingPercent(opp: InvestmentOpportunityDetail) {
  const raised = Number(opp.amount_raised) || 0;
  const target = Number(opp.total_target_amount) || 0;
  if (target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

const statusBadge: Record<InvestmentOpportunityDetail['status'], { label: string; className: string }> = {
  open: { label: 'Open for investment', className: 'bg-green-100 text-green-800' },
  fully_funded: { label: 'Fully Funded', className: 'bg-blue-100 text-blue-800' },
  closed: { label: 'Closed', className: 'bg-gray-200 text-gray-700' },
  matured: { label: 'Matured', className: 'bg-gray-200 text-gray-700' },
};

/**
 * The public /investment-details/:id page (Joan, Sep 2026 -- "/investment
 * isn't fixed"). Used to be one hardcoded fake mansion with a fake
 * "shares/investors" metaphor and no :id read from the route at all --
 * every visitor saw the exact same fictional listing. Rebuilt on the real
 * GET investments/opportunities/:id, with an "Invest Now" panel that
 * mirrors PropertyDetails.tsx's "Schedule a TOUR" pattern: gated on
 * whether anyone is signed in and whether they're a customer, since
 * POST /investments requires an authenticated customer account
 * server-side and only records investment INTENT (see
 * investments.routes.js) -- there's no live payment gateway wired up
 * yet, same as the rest of HouseBank.
 */
const InvestmentPropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const isCustomer = !auth.user || auth.user.role === 'customer';

  const { data: opp, isLoading, isError } = useGetInvestmentOpportunityQuery(id as string, { skip: !id }) as {
    data: InvestmentOpportunityDetail | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const [createInvestment, { isLoading: investing }] = useCreateInvestmentMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [amount, setAmount] = useState('');
  const [investError, setInvestError] = useState<string | null>(null);
  const [investSuccess, setInvestSuccess] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">
        Loading investment opportunity…
      </div>
    );
  }

  if (isError || !opp) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            This investment opportunity isn't available anymore — it may have closed or been taken down.
          </p>
          <button
            onClick={() => navigate('/investment')}
            className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Back to Investment Opportunities
          </button>
        </div>
      </div>
    );
  }

  const images: string[] = (opp.images || [])
    .map((img) => imageUrl(img.file_path))
    .filter((u): u is string => !!u);
  const pct = fundingPercent(opp);
  const badge = statusBadge[opp.status];
  const isUnverified = !!opp.company_name && opp.company_verification_status !== 'verified';
  const displayAmount = amount !== '' ? amount : String(opp.min_investment_amount);
  const maturityLabel = opp.maturity_date
    ? new Date(opp.maturity_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const handleInvest = async () => {
    setInvestError(null);
    const numeric = parseFloat(displayAmount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setInvestError('Enter a valid investment amount.');
      return;
    }
    if (numeric < Number(opp.min_investment_amount)) {
      setInvestError(`Minimum investment is ${formatNaira(opp.min_investment_amount)}.`);
      return;
    }
    const result = await createInvestment({ investment_property_id: opp.id, amount: numeric });
    if ('error' in result) {
      const err: any = result.error;
      setInvestError(err?.message || 'Unable to submit your investment. Please try again.');
      return;
    }
    setInvestSuccess(
      "Your investment has been recorded and is pending payment confirmation. HouseBank doesn't do instant checkout — our team will follow up to complete payment before your investment goes active."
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Property Image */}
        <div className="mb-8">
          <div className="w-full h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={images[selectedImage] || images[0]}
                alt={opp.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No images uploaded for this investment property yet.</span>
            )}
          </div>
        </div>

        {/* Property Title and Basic Info */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{opp.title}</h1>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {[opp.city, opp.state].filter(Boolean).join(', ') || 'Location not specified'}
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-4 flex-wrap gap-y-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${badge.className}`}>{badge.label}</span>
            <span className="text-green-600 text-sm font-medium">
              {opp.expected_roi_percent}% p.a expected returns
            </span>
          </div>

          {/* Min investment and ROI */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatNaira(opp.min_investment_amount)}</p>
              <p className="text-gray-500 text-sm">Min. investment</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{opp.tenure_months} mo</p>
              <p className="text-gray-500 text-sm">Tenure</p>
            </div>
          </div>

          {/* Funding progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>{formatNaira(opp.amount_raised)} raised</span>
              <span>
                {pct}% of {formatNaira(opp.total_target_amount)} target
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            {maturityLabel && (
              <p className="text-xs text-gray-500 mt-2">Expected maturity: {maturityLabel}</p>
            )}
          </div>

          {/* Invest Now panel */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invest Now</h3>

            {!auth.user ? (
              <div className="py-2">
                <p className="text-sm text-gray-600 mb-4">
                  Sign in to invest in this opportunity, or to track investments you've already made.
                </p>
                <Link
                  to="/signin"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Sign in to invest
                </Link>
                <p className="text-xs text-gray-500 mt-3">
                  New to HouseBank?{' '}
                  <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Create an account
                  </Link>
                </p>
              </div>
            ) : !isCustomer ? (
              <p className="text-sm text-gray-500">
                Investing is available for customer accounts. Sign in with a customer account to invest in this
                opportunity.
              </p>
            ) : opp.status !== 'open' ? (
              <p className="text-sm text-gray-500">
                This opportunity is {badge.label.toLowerCase()} and is no longer accepting new investments.
              </p>
            ) : investSuccess ? (
              <div className="py-2">
                <p className="text-green-700 font-medium">{investSuccess}</p>
                <button
                  onClick={() => navigate('/investment')}
                  className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Browse more opportunities
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment amount (₦)</label>
                  <input
                    type="number"
                    min={Number(opp.min_investment_amount)}
                    step="1"
                    value={displayAmount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum investment is {formatNaira(opp.min_investment_amount)}.
                  </p>
                </div>

                {investError && <p className="text-sm text-red-600">{investError}</p>}

                <button
                  onClick={handleInvest}
                  disabled={investing}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {investing ? 'Submitting…' : 'Invest Now'}
                </button>

                <p className="text-xs text-gray-500">
                  HouseBank doesn't do instant checkout — this records your investment as pending payment
                  confirmation, not an instant purchase. Our team follows up to complete payment before it goes
                  active.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* About This Property Section */}
        <div className="mb-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>

          <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            <p>{opp.description || 'No description has been provided for this investment opportunity yet.'}</p>
          </div>
        </div>

        {/* Image Gallery Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {images.map((src, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={src}
                  alt={`${opp.title} view ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(index)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Company Information */}
        <div className="text-gray-600 text-sm leading-relaxed space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">
              {opp.company_name ? 'Listed by' : 'Listing details'}
            </h3>
            {isUnverified && (
              <span
                className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full"
                title="This company hasn't completed HouseBank's verification review yet."
              >
                Unverified listing company
              </span>
            )}
          </div>
          {opp.company_name ? (
            <p>
              {opp.company_name}
              {opp.company_address ? ` — ${opp.company_address}` : ''}
            </p>
          ) : (
            <p>This opportunity is listed by an independent realtor rather than a registered company.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPropertyDetailPage;
