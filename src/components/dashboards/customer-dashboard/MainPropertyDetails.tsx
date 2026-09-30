import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone, MessageSquare } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import {
  useGetPropertyQuery,
  useGetMyViewingsQuery,
  useCreateViewingMutation,
} from '../../../redux/housebank.ts';

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

const CustomerPropertyDetailsPageOne = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const tourFormRef = useRef<HTMLDivElement>(null);

  const { data: property, isLoading, isError } = useGetPropertyQuery(id as string, { skip: !id });
  const { data: myViewings } = useGetMyViewingsQuery();
  const [createViewing, { isLoading: submitting }] = useCreateViewingMutation();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [fullName, setFullName] = useState(auth.user?.full_name || '');
  const [phone, setPhone] = useState(auth.user?.phone || '');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const existingViewing = (myViewings || []).find(
    (v: any) => String(v.property_id) === String(id) && ['requested', 'confirmed'].includes(v.status)
  );

  const scrollToTourForm = () => {
    tourFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
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
  const listerLabel = property.company_name || property.realtor_name || null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images and Info */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              {/* Main Image and Gallery */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="row-span-2">
                    <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Available</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-rows-3 gap-2">
                    {images.slice(1, 4).map((src, i) => (
                      <div key={i} className="bg-gray-200 rounded-lg h-24 overflow-hidden">
                        <img src={src} alt={`${property.title} view ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
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
                      {property.company_verification_status && property.company_verification_status !== 'verified' && (
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
                    onClick={scrollToTourForm}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    {listingTypeCta[property.listing_type] || 'Enquire'}
                  </button>
                  <button
                    onClick={() => navigate('/customer/wishlist')}
                    className="ml-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium"
                  >
                    Add to wishlist
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  HouseBank doesn't do instant checkout — buying, renting, or investing starts with booking a
                  viewing below. The sale itself is agreed and processed at the office.
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
                      {property.company_name && property.company_verification_status && property.company_verification_status !== 'verified' && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          Unverified
                        </span>
                      )}
                    </div>
                    {property.lister_phone && <p className="text-sm text-gray-500 mt-1">{property.lister_phone}</p>}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={scrollToTourForm}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"
                      title="Send a message"
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
            <div ref={tourFormRef} className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a TOUR</h3>

              {formSuccess ? (
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
    </div>
  );
};

export default CustomerPropertyDetailsPageOne;
