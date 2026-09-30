import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import {
  useGetPropertyQuery,
  useGetMyPurchasesQuery,
  useGetMyRentalsQuery,
  useRequestPurchaseMutation,
  useRequestRentalMutation,
  useCancelPurchaseRequestMutation,
  useCancelRentalRequestMutation,
} from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const BuyPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const { data: property, isLoading, isError } = useGetPropertyQuery(id as string, { skip: !id });

  const { data: myPurchases } = useGetMyPurchasesQuery();
  const { data: myRentals } = useGetMyRentalsQuery();
  const [requestPurchase, { isLoading: buying }] = useRequestPurchaseMutation();
  const [requestRental, { isLoading: renting }] = useRequestRentalMutation();
  const [cancelPurchaseRequest, { isLoading: cancellingPurchase }] = useCancelPurchaseRequestMutation();
  const [cancelRentalRequest, { isLoading: cancellingRental }] = useCancelRentalRequestMutation();

  const [rentMonths, setRentMonths] = useState(12);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const existingPurchase = (myPurchases || []).find((p: any) => String(p.property_id) === String(id));
  const existingRental = (myRentals || []).find((r: any) => String(r.property_id) === String(id));

  const handleBuy = async () => {
    setActionError(null);
    if (!auth.user?.id) {
      setActionError('You need to be signed in to do this.');
      return;
    }
    // buyer_user_id comes from the auth token server-side, not the body —
    // /purchases (staff-only) is a different endpoint from this one.
    const result = await requestPurchase({ property_id: id as string });
    if ('error' in result) {
      const err: any = result.error;
      setActionError(err?.message || 'Unable to send your purchase request. Please try again.');
      return;
    }
    setActionSuccess('Your purchase request has been sent to the listing agent for review.');
  };

  const handleRent = async () => {
    setActionError(null);
    if (!auth.user?.id) {
      setActionError('You need to be signed in to do this.');
      return;
    }
    const result = await requestRental({ property_id: id as string, rent_period_months: rentMonths });
    if ('error' in result) {
      const err: any = result.error;
      setActionError(err?.message || 'Unable to send your rental request. Please try again.');
      return;
    }
    setActionSuccess('Your rental request has been sent to the listing agent for review.');
  };

  const handleCancelRequest = async (kind: 'purchase' | 'rental', requestId: number | string) => {
    setActionError(null);
    const result = kind === 'purchase' ? await cancelPurchaseRequest(requestId) : await cancelRentalRequest(requestId);
    if ('error' in result) {
      const err: any = result.error;
      setActionError(err?.message || 'Unable to cancel your request. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        <CustomerHeader />
        <div className="p-6 text-center text-gray-500">Loading property…</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        <CustomerHeader />
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              This property isn't available anymore — it may have been sold, rented, or taken down.
            </p>
            <button
              onClick={() => navigate('/customer/property-listing')}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Back to properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images: string[] = (property.images || [])
    .map((img: any) => imageUrl(img.file_path))
    .filter((u: string | null): u is string => !!u);
  const mainImage = images[0] || null;
  const sideImages = images.slice(1, 4);
  const addressLine = [property.address, property.city, property.state].filter(Boolean).join(', ');
  const listerLabel = property.company_name || property.realtor_name || null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <MapPin className="w-4 h-4 mr-1" />
            {addressLine || 'Address not provided'}
          </div>

          {/* Property Images */}
          {mainImage ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-200 w-full rounded-lg overflow-hidden aspect-video">
                <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
              </div>
              {sideImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {sideImages.map((src, idx) => (
                    <div key={idx} className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
                      <img src={src} alt={`${property.title} view ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mb-8 text-gray-500">
              No images uploaded for this property yet.
            </div>
          )}

          {/* Key facts */}
          <div className="flex flex-wrap items-center gap-6 bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNaira(property.price)}
                {property.listing_type === 'rent' && <span className="text-sm font-normal text-gray-500">/mo</span>}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                {property.listing_type === 'sale' ? 'For Sale' : property.listing_type === 'rent' ? 'For Rent' : 'Investment'}
              </div>
            </div>
            {property.bedrooms != null && (
              <div className="flex items-center text-sm text-gray-600">
                <Bed className="w-4 h-4 mr-1" /> {property.bedrooms} Beds
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center text-sm text-gray-600">
                <Bath className="w-4 h-4 mr-1" /> {property.bathrooms} Baths
              </div>
            )}
            {property.size_sqm != null && (
              <div className="flex items-center text-sm text-gray-600">
                <Square className="w-4 h-4 mr-1" /> {property.size_sqm} sqm
              </div>
            )}
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Property Information</h2>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Type:</span>
                <span className="text-gray-900">{property.property_type_name}</span>
              </div>
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Address:</span>
                <span className="text-gray-900 text-right">{addressLine || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-medium">Description:</span>
              </div>
              <p className="text-sm text-gray-600">{property.description || 'No description provided.'}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Listed By</h2>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">{property.company_name ? 'Agency' : "Realtor's Name"}:</span>
                <span className="text-gray-900">{listerLabel || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-medium">Contact:</span>
                <span className="text-gray-900">{property.lister_phone || '—'}</span>
              </div>
            </div>
          </div>

          {/* Action panel */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            {actionSuccess ? (
              <div className="text-center py-4">
                <p className="text-green-700 font-medium">{actionSuccess}</p>
                <button
                  onClick={() => navigate('/customer/properties')}
                  className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View my properties
                </button>
              </div>
            ) : property.listing_type === 'sale' ? (
              existingPurchase ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">
                    You already have a purchase request on this property (status:{' '}
                    <span className="font-medium">{existingPurchase.status.replace('_', ' ')}</span>). Check{' '}
                    <button
                      onClick={() => navigate('/customer/properties')}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      My Properties
                    </button>{' '}
                    for updates.
                  </p>
                  {existingPurchase.status === 'requested' && (
                    <button
                      onClick={() => handleCancelRequest('purchase', existingPurchase.id)}
                      disabled={cancellingPurchase}
                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {cancellingPurchase ? 'Cancelling…' : 'Cancel request'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    No live payment gateway is connected yet — buying records your intent, and our team follows up
                    to arrange payment by bank transfer.
                  </p>
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {buying ? 'Recording your request…' : `Buy Now — ${formatNaira(property.price)}`}
                  </button>
                </div>
              )
            ) : property.listing_type === 'rent' ? (
              existingRental ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">
                    You already have a rental request on this property (status:{' '}
                    <span className="font-medium">{existingRental.status.replace('_', ' ')}</span>). Check{' '}
                    <button
                      onClick={() => navigate('/customer/properties')}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      My Properties
                    </button>{' '}
                    for updates.
                  </p>
                  {existingRental.status === 'requested' && (
                    <button
                      onClick={() => handleCancelRequest('rental', existingRental.id)}
                      disabled={cancellingRental}
                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {cancellingRental ? 'Cancelling…' : 'Cancel request'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Rent is paid upfront for the whole lease term. No live payment gateway is connected yet —
                    renting records your intent, and our team follows up to arrange payment by bank transfer.
                  </p>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <label className="text-sm text-gray-700 font-medium">Lease length:</label>
                    <select
                      value={rentMonths}
                      onChange={(e) => setRentMonths(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {[6, 12, 24, 36].map((m) => (
                        <option key={m} value={m}>
                          {m} months
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleRent}
                    disabled={renting}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {renting
                      ? 'Recording your request…'
                      : `Rent Now — ${formatNaira(Number(property.price) * rentMonths)} total`}
                  </button>
                </div>
              )
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                This is an investment property — visit the Investments section of your dashboard to invest in it.
              </p>
            )}
            {actionError && <p className="text-sm text-red-600 text-center mt-3">{actionError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPropertyDetails;
