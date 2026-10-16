import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import { useGetPropertiesQuery } from '../redux/housebank.ts';
import usePropertyWishlist from '../hooks/usePropertyWishlist.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const listingTypeLabel: Record<string, string> = {
  sale: 'For Sale',
  rent: 'For Rent',
  investment: 'Investment',
};

/**
 * Real, DB-backed replacement for what used to be four hardcoded
 * "Rendez House Bay" cards with local stock images and a dead "View
 * Details" button (Joan, Sep 2026 -- "when the company is verified and
 * the post a listing, let it show on the main website" -- the reason it
 * didn't before had nothing to do with verification, this component
 * simply never called the API at all). Pulls the newest approved
 * listings from GET /properties, same query the dashboards already use.
 */
const HotSales = () => {
  const navigate = useNavigate();
  const wishlist = usePropertyWishlist();
  const { data: result, isLoading } = useGetPropertiesQuery({ per_page: 4 });
  const properties = result?.items || [];

  const PropertyCard = ({ property }: { property: any }) => {
    const isFavorite = wishlist.isSaved(property.id);
    const img = imageUrl(property.cover_image);
    const isUnverified =
      property.company_verification_status && property.company_verification_status !== 'verified';

    return (
      <div
        onClick={() => navigate(`/property-details/${property.id}`)}
        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        {/* Property Image */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
            {img ? (
              <img src={img} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">No image</span>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium text-white bg-gray-700 rounded">
              {listingTypeLabel[property.listing_type] || 'For Sale'}
            </span>
          </div>

          {isUnverified && (
            <div
              className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded"
              title="This company hasn't completed HouseBank's verification review yet."
            >
              Unverified
            </div>
          )}

          {/* Heart Icon */}
          {wishlist.canSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void wishlist.toggle(property.id);
              }}
              disabled={String(wishlist.busyId) === String(property.id)}
              aria-label={`${isFavorite ? 'Remove' : 'Add'} ${property.title} ${isFavorite ? 'from' : 'to'} wishlist`}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h3>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">
              {[property.city, property.state].filter(Boolean).join(', ') || 'Location not specified'}
            </span>
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.bedrooms ?? '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.bathrooms ?? '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span className="text-sm">{property.size_sqm ?? '-'}</span>
            </div>
          </div>

          {/* Price and View Details */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xl font-bold text-gray-900">
              {formatNaira(property.price)}
              {property.listing_type === 'rent' && (
                <span className="text-xs font-normal text-gray-500">/mo</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/property-details/${property.id}`);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Hot Sales</h2>
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span className="text-sm font-medium">See More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {wishlist.error && <p role="alert" className="mb-4 text-sm text-red-600">{wishlist.error}</p>}

        {/* Property Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading properties…</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No properties available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotSales;
