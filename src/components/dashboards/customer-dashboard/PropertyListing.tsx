import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetPropertiesQuery } from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const listingTypeBadge: Record<string, { label: string; className: string }> = {
  sale: { label: 'For Sale', className: 'bg-green-500' },
  rent: { label: 'For Rent', className: 'bg-blue-500' },
  investment: { label: 'Investment', className: 'bg-purple-500' },
};

const CustomerPropertiesListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: result, isLoading } = useGetPropertiesQuery({ per_page: 24, ...(searchTerm ? { q: searchTerm } : {}) });
  const properties = result?.items || [];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />
      <div className="p-6">
        {/* Page Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Left: Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <p className="text-gray-600">{result?.total ?? 0} properties available</p>
          </div>

          {/* Middle: Search Filter */}
          <div className="relative mx-auto md:mx-0 order-2 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here..."
              className="pl-12 pr-12 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 w-72 md:w-80 bg-white"
            />
            <SlidersHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Right: Wishlist */}
          <div className="flex items-center justify-end order-3">
            <Link
              to="/customer/wishlist"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            Loading properties…
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            {searchTerm ? 'No properties match your search.' : 'No properties available right now.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property: any) => {
              const badge = listingTypeBadge[property.listing_type] || listingTypeBadge.sale;
              const img = imageUrl(property.cover_image);
              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Property Image */}
                  <div className="relative">
                    <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img src={img} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-sm">No image</span>
                      )}
                    </div>
                    <div className={`absolute top-3 left-3 ${badge.className} text-white text-xs px-2 py-1 rounded`}>
                      {badge.label}
                    </div>
                    {property.company_verification_status && property.company_verification_status !== 'verified' && (
                      <div
                        className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded"
                        title="This company hasn't completed HouseBank's verification review yet."
                      >
                        Unverified
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{property.title}</h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatNaira(property.price)}
                        {property.listing_type === 'rent' && <span className="text-xs font-normal text-gray-500">/mo</span>}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-4">
                      {[property.city, property.state].filter(Boolean).join(', ') || 'Location not specified'}
                    </p>

                    <Link
                      to={`/customer/property-details/${property.id}`}
                      className="block text-center bg-gray-800 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-700"
                    >
                      View Details
                    </Link>
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

export default CustomerPropertiesListingPage;
