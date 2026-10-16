import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone, MessageSquare, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '../hooks/useAuth.tsx';
import {
  useGetPropertyQuery,
  useGetMyViewingsQuery,
  useCreateViewingMutation,
  useAddToWishlistMutation,
  useGetInvestmentOpportunityByPropertyQuery,
  useCreateInvestmentMutation,
} from '../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const listingTypeCta: Record<string, string> = {
  sale: 'Buy Now',
  rent: 'Rent Now',
  investment: 'Invest',
};

/**
 * The main website's public property detail page (Joan, Sep 2026 --
 * "when the company is verified and the post a listing, let it show on
 * the main website"). Used to be a single hardcoded property with a
 * fake booking calendar and no :id in its own route at all -- every
 * visitor saw the exact same fictional listing no matter which card
 * they clicked. Rebuilt on the same real GET /properties/:id +
 * POST /viewings the customer dashboard already uses (see
 * dashboards/customer-dashboard/MainPropertyDetails.tsx), gated by
 * whether anyone is signed in: an anonymous visitor gets a "Sign in to
 * schedule a viewing" prompt instead of the form, since POST /viewings
 * requires an authenticated customer account server-side.
 */
const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const tourFormRef = useRef<HTMLDivElement>(null);
  const isCustomer = !auth.user || auth.user.role === 'customer';

  const { data: property, isLoading, isError } = useGetPropertyQuery(id as string, { skip: !id });
  const { data: myViewings } = useGetMyViewingsQuery(undefined, { skip: !auth.user || auth.user.role !== 'customer' });
  const [createViewing, { isLoading: submitting }] = useCreateViewingMutation();
  const [addToWishlist, { isLoading: savingToWishlist }] = useAddToWishlistMutation();
  // Only fires for an investment-type listing -- no point looking up an
  // investment_properties row for a sale/rent property that will never
  // have one.
  const { data: investmentOpportunity, isLoading: loadingInvestment } = useGetInvestmentOpportunityByPropertyQuery(
    id as string,
    { skip: !id || property?.listing_type !== 'investment' }
  );
  const [createInvestment, { isLoading: investing }] = useCreateInvestmentMutation();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [fullName, setFullName] = useState(auth.user?.full_name || '');
  const [phone, setPhone] = useState(auth.user?.phone || '');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [tourHighlight, setTourHighlight] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investError, setInvestError] = useState<string | null>(null);
  const [investSuccess, setInvestSuccess] = useState<string | null>(null);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const handleAddToWishlist = async () => {
    setWishlistError(null);
    try {
      await addToWishlist({ property_id: Number(id) }).unwrap();
      navigate('/customer/wishlist');
    } catch {
      setWishlistError('Unable to save this property. Please try again.');
    }
  };

  const existingViewing = (myViewings || []).find(
    (v: any) => String(v.property_id) === String(id) && ['requested', 'confirmed'].includes(v.status)
  );

  // The CTA and the Schedule-a-Tour card can end up side by side on a
  // wide desktop viewport (this is a 2-column grid, not stacked), so
  // scrollIntoView alone is sometimes a silent no-op — nothing to
  // scroll to because the target's already on screen (Joan, Sep 2026:
  // "when I click on rent now button, nothing happens"). This adds a
  // visible highlight flash every time, independent of whether a
  // scroll actually happened, so the click always has an unmistakable
  // effect.
  const scrollToTourForm = () => {
    tourFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTourHighlight(true);
    window.setTimeout(() => setTourHighlight(false), 1600);
  };

  const handleSendMessage = async () => {
    setFormError(null);
    if (!selectedDate || !fullName || !phone) {
      setFormError('Please fill in your preferred date, full name, and phone number.');
      return;
    }
    const result = await createViewing({
      property_id: id as string,
      preferred_date: selectedDate,
      preferred_time: selectedTime || undefined,
      full_name: fullName,
      phone,
      message: message || undefined,
    });
    if ('error' in result) {
      const err: any = result.error;
      setFormError(err?.message || 'Unable to submit your viewing request. Please try again.');
      return;
    }
    setFormSuccess('Your viewing request has been sent. A realtor will reach out to confirm a time.');
  };

  // Real per-property invest action (Joan, Sep 2026 -- "fix the
  // Invest"). Previously this CTA just scrolled to the generic viewing
  // form for every listing type, including investment listings, which
  // don't create an actual investment. Backed by the real
  // POST /investments endpoint the customer investment flow already
  // uses -- same 'pending_payment' intent-then-confirm pattern as
  // Buy/Rent and viewings.
  const handleInvestSubmit = async () => {
    setInvestError(null);
    if (!investmentOpportunity || investmentOpportunity.status !== 'open') return;
    const amountNum = Number(investAmount);
    if (!investAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      setInvestError('Enter a valid amount.');
      return;
    }
    if (amountNum < Number(investmentOpportunity.min_investment_amount)) {
      setInvestError(`Minimum investment is ${formatNaira(investmentOpportunity.min_investment_amount)}.`);
      return;
    }
    const result = await createInvestment({
      investment_property_id: investmentOpportunity.id,
      amount: amountNum,
    });
    if ('error' in result) {
      const err: any = result.error;
      setInvestError(err?.message || 'Unable to record your investment. Please try again.');
      return;
    }
    setInvestSuccess('Your investment has been recorded — pending payment confirmation from our team.');
  };

  // Computed ahead of the loading/error early-returns below so the
  // lightbox keyboard effect (a hook — must run unconditionally on
  // every render, same as any other hook) has a stable image count to
  // close over even while `property` is still undefined.
  const images: string[] = (property?.images || [])
    .map((img: any) => imageUrl(img.file_path))
    .filter((u: string | null): u is string => !!u);
  const imageCount = images.length;

  useEffect(() => {
    if (lightboxIndex === null || imageCount === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? i : (i + 1) % imageCount));
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? i : (i - 1 + imageCount) % imageCount));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, imageCount]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">Loading property…</div>;
  }

  if (isError || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            This property isn't available anymore — it may have been sold, rented, or taken down.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const listerLabel = property.company_name || property.realtor_name || null;
  const isUnverified =
    property.company_verification_status && property.company_verification_status !== 'verified';
  // Whoever actually gets messaged: the company's own account if this
  // is a company listing, otherwise the individual agent who listed it.
  const messageTargetUserId = property.company_id ? property.company_user_id : property.listed_by_user_id;
  // Messaging is relationship-gated server-side (POST /messages 403's a
  // "cold message" to a lister the customer has no real dealings with —
  // see messages.routes.js's assertCustomerCanMessage) -- booking a
  // viewing is what unlocks it, same as it would from "My Realtor".
  // existingViewing already reflects that on this page.
  const canMessage = !!auth.user && isCustomer && !!existingViewing && !!messageTargetUserId;

  const handleMessageClick = () => {
    if (canMessage) {
      navigate('/customer/messages', {
        state: {
          startWith: {
            user_id: messageTargetUserId,
            name: listerLabel,
            avatar_path: property.lister_avatar_path,
          },
        },
      });
      return;
    }
    // Not authorized to message yet (or not signed in) -- book a
    // viewing first, which is what actually unlocks messaging.
    scrollToTourForm();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images and Info */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              {/* Main Image and Gallery */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="row-span-2">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(0)}
                      className="relative h-[22rem] w-full bg-gray-200 rounded-lg overflow-hidden cursor-zoom-in group"
                    >
                      <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Available</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                  </div>
                  <div className="grid grid-rows-3 gap-2">
                    {images.slice(1, 4).map((src, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setLightboxIndex(i + 1)}
                        className="bg-gray-200 rounded-lg h-28 w-full overflow-hidden cursor-zoom-in group relative"
                      >
                        <img src={src} alt={`${property.title} view ${i + 2}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        {i === 2 && images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                            +{images.length - 4} more
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No images uploaded for this property yet.</div>
              )}

              {/* Property Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div className="block">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                      {isUnverified && (
                        <span
                          className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full"
                          title="This company hasn't completed HouseBank's verification review yet."
                        >
                          Unverified listing company
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {[property.city, property.state].filter(Boolean).join(', ') || 'Location not specified'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNaira(property.price)}
                      {property.listing_type === 'rent' && (
                        <span className="text-sm font-normal text-gray-500">/mo</span>
                      )}
                    </div>

                    <div className="flex space-x-4 mt-6 mb-4">
                      {property.bedrooms != null && (
                        <div className="flex items-center text-gray-600">
                          <Bed className="w-4 h-4 mr-2" />
                          <span className="text-sm">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms != null && (
                        <div className="flex items-center text-gray-600">
                          <Bath className="w-4 h-4 mr-2" />
                          <span className="text-sm">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.size_sqm != null && (
                        <div className="flex items-center text-gray-600">
                          <Square className="w-4 h-4 mr-2" />
                          <span className="text-sm">{property.size_sqm} sqm</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={property.listing_type === 'investment' ? () => setShowInvestModal(true) : scrollToTourForm}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    {listingTypeCta[property.listing_type] || 'Enquire'}
                  </button>
                  {auth.user?.role === 'customer' && (
                    <button
                      onClick={handleAddToWishlist}
                      disabled={savingToWishlist}
                      className="ml-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      {savingToWishlist ? 'Saving...' : 'Add to wishlist'}
                    </button>
                  )}
                </div>
                {wishlistError && <p role="alert" className="mt-3 text-sm text-red-600">{wishlistError}</p>}
                <p className="text-xs text-gray-500 mt-3">
                  {property.listing_type === 'investment'
                    ? "Investing here records your intent — it's confirmed once our team verifies payment, the same manual-confirm step every investment on HouseBank goes through."
                    : "HouseBank doesn't do instant checkout — buying or renting starts with booking a viewing below. The sale itself is agreed and processed at the office."}
                </p>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description || 'No description has been provided for this property yet.'}
              </p>
            </div>
          </div>

          {/* Right Column - Realtor and Tour Form */}
          <div className="space-y-6">
            {/* Listed By */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {property.company_name ? 'Listing Agency' : 'Listing Realtor'}
              </h3>
              {listerLabel ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-gray-900">{listerLabel}</h4>
                      {property.company_name && isUnverified && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          Unverified
                        </span>
                      )}
                    </div>
                    {property.lister_phone && <p className="text-sm text-gray-500 mt-1">{property.lister_phone}</p>}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleMessageClick}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"
                      title={canMessage ? 'Send a message' : 'Book a viewing first to message the lister'}
                    >
                      <MessageSquare className="w-5 h-5 text-white" />
                    </button>
                    {property.lister_phone && (
                      <a
                        href={`tel:${property.lister_phone}`}
                        className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                        title="Call"
                      >
                        <Phone className="w-5 h-5 text-gray-600" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Listing contact not available.</p>
              )}
            </div>

            {/* Schedule a TOUR */}
            <div
              ref={tourFormRef}
              className={`bg-white rounded-xl p-6 border transition-all duration-500 ${
                tourHighlight ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-200'
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a TOUR</h3>

              {!auth.user ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in to schedule a viewing or message the realtor about this property.
                  </p>
                  <Link
                    to="/signin"
                    className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Sign In
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
                  Viewing requests are available for customer accounts. Sign in with a customer account to book a
                  tour.
                </p>
              ) : formSuccess ? (
                <div className="text-center py-4">
                  <p className="text-green-700 font-medium">{formSuccess}</p>
                  <button
                    onClick={() => navigate('/customer/properties')}
                    className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View my properties
                  </button>
                </div>
              ) : existingViewing ? (
                <p className="text-sm text-gray-600">
                  You already have a viewing request for this property (status:{' '}
                  <span className="font-medium">{existingViewing.status}</span>). We'll notify you once it's
                  confirmed.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    />
                  </div>

                  <div>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Anything the realtor should know before your visit"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 resize-none"
                    />
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="flex justify-center">
                    <button
                      onClick={handleSendMessage}
                      disabled={submitting}
                      className="w-40 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInvestModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowInvestModal(false)}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invest in this property</h3>
              <button
                type="button"
                onClick={() => setShowInvestModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!auth.user ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 mb-4">Sign in to invest in this property.</p>
                <Link
                  to="/signin"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Sign In
                </Link>
              </div>
            ) : !isCustomer ? (
              <p className="text-sm text-gray-500">Investing is available for customer accounts.</p>
            ) : investSuccess ? (
              <div className="text-center py-4">
                <p className="text-green-700 font-medium">{investSuccess}</p>
                <button
                  onClick={() => {
                    setShowInvestModal(false);
                    navigate('/customer/properties');
                  }}
                  className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View my properties
                </button>
              </div>
            ) : loadingInvestment ? (
              <p className="text-sm text-gray-500 py-4 text-center">Checking investment details…</p>
            ) : !investmentOpportunity ? (
              <p className="text-sm text-gray-500">
                This property isn't open for investment yet. Check back soon, or contact the listing agency for
                details.
              </p>
            ) : investmentOpportunity.status !== 'open' ? (
              <p className="text-sm text-gray-500">
                This investment opportunity is currently{' '}
                <span className="font-medium">{String(investmentOpportunity.status).replace('_', ' ')}</span> and no
                longer accepting new investments.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Minimum investment:{' '}
                    <span className="font-medium text-gray-900">
                      {formatNaira(investmentOpportunity.min_investment_amount)}
                    </span>
                  </p>
                  <p>
                    Expected ROI:{' '}
                    <span className="font-medium text-gray-900">{investmentOpportunity.expected_roi_percent}%</span>
                  </p>
                  <p>
                    Tenure: <span className="font-medium text-gray-900">{investmentOpportunity.tenure_months} months</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to invest</label>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder={`Minimum ${formatNaira(investmentOpportunity.min_investment_amount)}`}
                    min={investmentOpportunity.min_investment_amount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                  />
                </div>
                {investError && <p className="text-sm text-red-600">{investError}</p>}
                <div className="flex justify-center">
                  <button
                    onClick={handleInvestSubmit}
                    disabled={investing}
                    className="w-40 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                  >
                    {investing ? 'Submitting…' : 'Invest'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              title="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`${property.title} full view`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              title="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
