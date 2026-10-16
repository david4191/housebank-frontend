import { useState } from 'react';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import {
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
} from '../../../redux/housebank.ts';

function imageUrl(path: string | null | undefined) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

function formatPrice(price: number | string | null | undefined, currency: string | null | undefined) {
  const amount = typeof price === 'string' ? Number(price) : price;
  if (amount == null || !Number.isFinite(amount)) return 'Price on request';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency || 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

const CustomerWishlist = () => {
  const { data: properties = [], isLoading, isError } = useGetMyWishlistQuery();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleRemove = async (propertyId: number | string) => {
    setRemoveError(null);
    try {
      await removeFromWishlist(propertyId).unwrap();
    } catch {
      setRemoveError('Could not remove this property. Please try again.');
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Wishlist</h2>
            {!isLoading && <p className="mt-1 text-sm text-gray-500">{properties.length} saved {properties.length === 1 ? 'property' : 'properties'}</p>}
          </div>
          <Link to="/explore" className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
            Explore properties
          </Link>
        </div>

        {removeError && <p role="alert" className="mb-4 text-sm text-red-600">{removeError}</p>}

        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading your saved properties...</div>
        ) : isError ? (
          <div role="alert" className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-700">
            We could not load your wishlist. Please refresh and try again.
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-14 text-center">
            <Heart className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-3 font-semibold text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Save properties you like and they will appear here.</p>
            <Link to="/explore" className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Property</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Company / Realtor</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property: any) => {
                    const image = imageUrl(property.cover_image);
                    const location = [property.address, property.city, property.state].filter(Boolean).join(', ');
                    const listingType = ({ sale: 'For sale', rent: 'For rent', investment: 'Investment' } as Record<string, string>)[property.listing_type] || property.listing_type;

                    return (
                      <tr key={property.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <Link to={`/property-details/${property.id}`} className="flex min-w-56 items-center gap-3">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                              {image && <img src={image} alt={property.title} className="h-full w-full object-cover" />}
                            </div>
                            <span className="font-medium text-gray-900">{property.title}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          <span className="flex max-w-56 items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                            {location || 'Location not specified'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          <span className="block">{property.company_name || 'Independent listing'}</span>
                          {property.realtor_name && <span className="mt-1 block text-xs text-gray-500">{property.realtor_name}</span>}
                        </td>
                        <td className="px-5 py-4 text-sm capitalize text-gray-600">{property.property_type_name || listingType}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">{formatPrice(property.price, property.currency)}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleRemove(property.id)}
                            disabled={isRemoving}
                            aria-label={`Remove ${property.title} from wishlist`}
                            className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerWishlist;