import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Search, ChevronDown } from 'lucide-react';
import { useGetPropertiesQuery, useGetPropertyTypesQuery } from '../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const listingTypeBadge: Record<string, { label: string; className: string }> = {
  sale: { label: 'For Sale', className: 'bg-gray-700' },
  rent: { label: 'For Rent', className: 'bg-blue-600' },
  investment: { label: 'Investment', className: 'bg-emerald-700' },
};

type Filters = Record<string, string | number | undefined>;

/**
 * Real search + category filtering against GET /properties (Joan, Sep
 * 2026 -- "make everything dynamic" / "when the company is verified and
 * the post a listing, let it show on the main website"). This used to
 * be 8 hardcoded properties filtered client-side with no connection to
 * the database at all -- a verified company's real listing could never
 * have shown up here no matter what. "List Property" isn't a filter
 * (there's no such category server-side); it now sends the visitor to
 * the realtor sign-up flow, which is what that tab's label is actually
 * offering.
 */
const ExploreProperty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All Property');
  const initialQ = searchParams.get('q') || '';
  const [searchFilters, setSearchFilters] = useState({
    location: initialQ,
    propertyType: '',
    priceRange: '',
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialQ ? { q: initialQ } : {});

  // A visitor arriving from the homepage hero search (or any /explore?q=…
  // link) should see that search already applied, not an empty form they
  // have to resubmit.
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchFilters((prev) => ({ ...prev, location: q }));
      setAppliedFilters((prev) => ({ ...prev, q }));
    }
    const type = searchParams.get('type');
    const categoryByType: Record<string, string> = { sale: 'Buy', rent: 'Rent', investment: 'Invest' };
    if (type && categoryByType[type]) {
      setActiveCategory(categoryByType[type]);
    }
    // The homepage hero search's Property Type / Price Range fields used to
    // be collected into local state and then silently dropped -- only `q`
    // ever made it into the URL (Joan, Sep 2026: "search forms... not
    // working well"). Now that the hero search forwards these too, pick
    // them back up here the same way `q`/`type` already are.
    const propertyTypeId = searchParams.get('property_type_id');
    if (propertyTypeId) {
      setSearchFilters((prev) => ({ ...prev, propertyType: propertyTypeId }));
      setAppliedFilters((prev) => ({ ...prev, property_type_id: Number(propertyTypeId) }));
    }
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    if (minPrice || maxPrice) {
      setAppliedFilters((prev) => ({
        ...prev,
        ...(minPrice ? { min_price: Number(minPrice) } : {}),
        ...(maxPrice ? { max_price: Number(maxPrice) } : {}),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = ['All Property', 'Buy', 'Rent', 'Land', 'Invest', 'List Property'];

  const { data: propertyTypes } = useGetPropertyTypesQuery();

  const categoryFilter = (): Filters => {
    switch (activeCategory) {
      case 'Buy':
        return { listing_type: 'sale' };
      case 'Rent':
        return { listing_type: 'rent' };
      case 'Invest':
        return { listing_type: 'investment' };
      case 'Land': {
        const land = (propertyTypes || []).find((t: any) => /land/i.test(t.name));
        return land ? { property_type_id: land.id } : {};
      }
      default:
        return {};
    }
  };

  const { data: result, isLoading } = useGetPropertiesQuery({
    per_page: 12,
    ...categoryFilter(),
    ...appliedFilters,
  });
  const properties = result?.items || [];

  const handleCategoryClick = (category: string) => {
    if (category === 'List Property') {
      navigate('/realtor-landing');
      return;
    }
    setActiveCategory(category);
  };

  const handleSearch = () => {
    const next: Filters = {};
    if (searchFilters.location) next.q = searchFilters.location;
    if (searchFilters.propertyType) {
      next.property_type_id = Number(searchFilters.propertyType);
    }
    if (searchFilters.priceRange) {
      const parts = searchFilters.priceRange
        .split('-')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) {
        next.min_price = Number(parts[0].replace(/[^\d.]/g, '')) || undefined;
        next.max_price = Number(parts[1].replace(/[^\d.]/g, '')) || undefined;
      } else if (parts.length === 1) {
        next.max_price = Number(parts[0].replace(/[^\d.]/g, '')) || undefined;
      }
    }
    setAppliedFilters(next);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const PropertyCard = ({ property }: { property: any }) => {
    const isFavorite = favorites.includes(property.id);
    const img = imageUrl(property.cover_image);
    const badge = listingTypeBadge[property.listing_type] || listingTypeBadge.sale;
    const isUnverified =
      property.company_verification_status && property.company_verification_status !== 'verified';

    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
            <span className={`px-3 py-1 text-xs font-medium text-white rounded ${badge.className}`}>
              {badge.label}
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
          <button
            onClick={() => toggleFavorite(property.id)}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Property Details */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Link to={`/property-details/${property.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-green-700 transition-colors truncate">
              {property.title}
            </h3>
          </Link>

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
              <span className="text-sm">{property.size_sqm ? `${property.size_sqm} sqm` : '-'}</span>
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
            <Link
              to={`/property-details/${property.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Explore Property</h1>
          <span className="text-sm text-gray-500">{result?.total ?? 0} properties found</span>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg md:rounded-full p-2 shadow-sm mb-8 w-full md:max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Location Filter */}
            <div className="flex items-center space-x-2 px-4 py-2 w-full md:flex-1 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Location"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, location: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-sm text-gray-600 bg-transparent outline-none w-full"
              />
            </div>

            <div className="md:w-px md:h-6 md:bg-gray-200"></div>

            {/* Property Type Filter */}
            <div className="flex items-center space-x-2 px-4 py-2 w-full md:flex-1 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <select
                value={searchFilters.propertyType}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
                className="text-sm text-gray-600 bg-transparent outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Any Property Type</option>
                {(propertyTypes || []).map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0" />
            </div>

            <div className="md:w-px md:h-6 md:bg-gray-200"></div>

            {/* Price Range Filter */}
            <div className="flex items-center space-x-2 px-4 py-2 w-full md:flex-1 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <input
                type="text"
                placeholder="e.g. 500000-5000000"
                value={searchFilters.priceRange}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-sm text-gray-600 bg-transparent outline-none w-full"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg md:rounded-full transition-colors flex items-center justify-center md:relative md:right-1"
            >
              <Search className="w-4 h-4" />
              <span className="ml-2 md:hidden">Search</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`whitespace-nowrap pb-4 text-sm font-medium transition-colors relative ${
                  activeCategory === category
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading properties…</div>
          ) : properties.length > 0 ? (
            properties.map((property: any) => <PropertyCard key={property.id} property={property} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters or select a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreProperty;
