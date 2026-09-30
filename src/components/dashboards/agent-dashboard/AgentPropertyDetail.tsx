import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Eye, AlertTriangle, ArrowLeft } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyPropertyQuery } from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const statusColor: Record<string, string> = {
  approved: 'bg-blue-100 text-blue-800',
  pending: 'bg-orange-100 text-orange-800',
  rejected: 'bg-red-100 text-red-800',
  sold: 'bg-gray-200 text-gray-800',
  rented: 'bg-purple-100 text-purple-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-gray-100 text-gray-800',
};

const statusExplainer: Record<string, string> = {
  pending: "Submitted and waiting on admin review. It won't show up in public search until it's approved.",
  approved: "Live — this listing is visible in public search results.",
  rejected: 'An admin reviewed and rejected this listing. See the reason below.',
  sold: 'Marked sold. No longer visible in public search.',
  rented: 'Marked rented. No longer visible in public search.',
  draft: "Saved as a draft — hasn't been submitted for review yet.",
  archived: 'Archived. No longer visible in public search.',
};

/**
 * The one real, canonical agent property-detail page — :id-parameterized,
 * replacing three fragmented, non-:id fake pages (a fake "Earnings" view,
 * a fake page with invented messages/reviews/lease-progress, and a fake
 * rejection view) plus a fourth fake rent-specific one, none of which
 * could ever have known which property to show even in principle.
 *
 * Deliberately property-centric rather than customer-centric: an agent
 * manages the properties of customers they're assigned to, not a roster
 * of customers in the abstract, so there's no invented "customer" or
 * "reviews" panel here — just the real state of the listing itself
 * (status, why it was rejected if it was, how many people have viewed
 * it) via GET /properties/mine/:id, which — unlike the public property
 * endpoint — returns the owner's own listing regardless of status.
 */
const AgentPropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  const { data: property, isLoading, isError } = useGetMyPropertyQuery(id as string, { skip: !id });

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
        <div className="p-4 sm:p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              This listing isn't in your account, or it doesn't exist.
            </p>
            <button
              onClick={() => navigate('/agent/properties')}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images: string[] = (property.images || [])
    .map((img: any) => imageUrl(img.file_path))
    .filter((u: string | null): u is string => !!u);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />
      <div className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/agent/properties"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                {images.length > 0 ? (
                  <div className="space-y-2 p-2">
                    <div className="relative h-72 sm:h-80 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                              i === activeImage ? 'border-green-600' : 'border-transparent'
                            }`}
                          >
                            <img src={src} alt={`${property.title} view ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">No images uploaded for this property yet.</div>
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{property.title}</h1>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColor[property.status] || 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {property.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {[property.address, property.city, property.state].filter(Boolean).join(', ') || 'Location not specified'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatNaira(property.price)}
                      {property.listing_type === 'rent' && (
                        <span className="text-sm font-normal text-gray-500">/mo</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {property.bedrooms != null && (
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-4 h-4 mr-2" />
                      <span className="text-sm">{property.bedrooms} bed</span>
                    </div>
                  )}
                  {property.bathrooms != null && (
                    <div className="flex items-center text-gray-600">
                      <Bath className="w-4 h-4 mr-2" />
                      <span className="text-sm">{property.bathrooms} bath</span>
                    </div>
                  )}
                  {property.size_sqm != null && (
                    <div className="flex items-center text-gray-600">
                      <Square className="w-4 h-4 mr-2" />
                      <span className="text-sm">{property.size_sqm} sqm</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.views_count ?? 0} views</span>
                  </div>
                </div>

                { property.status === 'rejected' && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Rejected</p>
                      <p className="text-sm text-red-700 mt-1">
                        {property.rejection_reason || 'No reason was recorded for this rejection.'}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">{statusExplainer[property.status] || ''}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description || 'No description has been provided for this property yet.'}
              </p>
            </div>
          </div>

          {/* Right column — listing facts, nothing invented */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="text-gray-900 capitalize">{property.listing_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-900">{property.property_type_name || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Listed on</dt>
                  <dd className="text-gray-900">{formatDate(property.created_at)}</dd>
                </div>
                { property.status === 'approved' && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Approved on</dt>
                    <dd className="text-gray-900">{formatDate(property.approved_at)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Views</dt>
                  <dd className="text-gray-900">{property.views_count ?? 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AgentPropertyDetailPage;
