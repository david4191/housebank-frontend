import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.tsx';
import { roleHomePath } from '../context/AuthContext.tsx';
import houseImage from '../assets/housebank.png';
import arrowTop from '../assets/arrow-top.png';
import about from '../assets/about.png';
import close from '../assets/close.png';
import teamOne from '../assets/1.png';
import teamTwo from '../assets/2.png';
import teamThree from '../assets/3.png';
import teamFour from '../assets/4.png';
import companyOne from '../assets/company1.png';
import companyTwo from '../assets/company2.png';
import companyThree from '../assets/company3.png';
import companyFour from '../assets/company4.png';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { useGetPropertyTypesQuery } from '../redux/housebank.ts';

const MainContent = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  // State to manage search filters
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });
  const { data: propertyTypes } = useGetPropertyTypesQuery();

  const handleGetStarted = () => {
    navigate(auth.user ? roleHomePath(auth.user.role) : '/signup');
  };

  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.location) params.set('q', searchFilters.location);
    if (searchFilters.propertyType) params.set('property_type_id', searchFilters.propertyType);
    if (searchFilters.priceRange) {
      const parts = searchFilters.priceRange
        .split('-')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) {
        const min = Number(parts[0].replace(/[^\d.]/g, ''));
        const max = Number(parts[1].replace(/[^\d.]/g, ''));
        if (min) params.set('min_price', String(min));
        if (max) params.set('max_price', String(max));
      } else if (parts.length === 1) {
        const max = Number(parts[0].replace(/[^\d.]/g, ''));
        if (max) params.set('max_price', String(max));
      }
    }
    navigate(params.toString() ? `/explore?${params.toString()}` : '/explore');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-green-700">Rent, Buy & Invest</span>
                <br />
                <span className="text-gray-900">with </span>
                <span className="text-green-700">HouseBank</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Discover premium properties tailored to your lifestyle.
              </p>
            </div>

            <button
              onClick={handleGetStarted}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <span>{auth.user ? 'Go to Dashboard' : 'Get Started'}</span>
              <img 
                src={arrowTop}
                alt="arrow icon" 
                className="w-4 h-4"
              />
            </button>

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
                    onChange={(e) => setSearchFilters(prev => ({...prev, location: e.target.value}))}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
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
                    onChange={(e) => setSearchFilters(prev => ({...prev, propertyType: e.target.value}))}
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
                    onChange={(e) => setSearchFilters(prev => ({...prev, priceRange: e.target.value}))}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                    className="text-sm text-gray-600 bg-transparent outline-none w-full"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleHeroSearch}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg md:rounded-full transition-colors flex items-center justify-center md:relative md:right-1"
                >
                  <Search className="w-4 h-4" />
                  <span className="ml-2 md:hidden">Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - House Image */}
          <div className="pointer-events-none absolute inset-0 z-0 lg:pointer-events-auto lg:static">
            <div className="absolute inset-0 overflow-hidden lg:relative lg:inset-auto lg:h-[500px] lg:rounded-3xl">
              <img 
                src={houseImage}
                alt="Modern luxury house" 
                className="h-full w-full object-cover opacity-20 lg:opacity-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Partners</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Partner 1 - Check D'Deck Homes */}
            <div className="flex flex-col items-center space-y-2">
              <img src={companyOne} alt="Check D'Deck Homes" className="w-26 h-26 mb-2" />
            </div>

            {/* Partner 2 - Lane*Wey */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-center">
                <img src={companyTwo} alt="Lane*Wey" className="w-26 h-26 mb-2" />
              </div>
            </div>

            {/* Partner 3 - Telos Properties */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <img src={companyThree} alt="Telos Properties" className="w-16 h-11 mb-2" />
                  <div>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Partner 4 - Golden Partner */}
            <div className="flex flex-col items-center space-y-2">
             
              <img src={companyFour} alt="Golden Partner" className="w-full h-full object-cover rounded-full" />
              
            </div>
          </div>
        </div>
      </section>

       {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Trusted by</h2>
              <p className="text-4xl font-bold text-green-700">10 Million Buyers</p>
              <p className="text-gray-600 text-lg max-w-md">
                We connect you directly to the person that knows the most about property for sale, the listing realtor.
              </p>
            </div>
            
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              About Us
            </button>

            {/* Professional Meeting Image */}
            <div className="mt-12">
              <div className="w-full h-94 bg-gray-200 rounded-xl overflow-hidden">
                <img 
                  src={about}
                  alt="Professional handshake meeting" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Team avatars */}
              <div className="flex -mt-6 ml-4 space-x-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white overflow-hidden">
                  <img 
                   src={teamOne} alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-green-600 border-4 border-white overflow-hidden">
                  <img 
                    src={teamTwo} alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-white overflow-hidden">
                  <img 
                    src={teamThree} alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-600 border-4 border-white overflow-hidden">
                  <img 
                    src={teamFour} alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">20k</h3>
                <p className="text-gray-600 text-sm">Happy customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">10k+</h3>
                <p className="text-gray-600 text-sm">Client reviews</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">4.5</h3>
                <p className="text-gray-600 text-sm">Positive Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                 <img src={close} alt="icon" className="w-6 h-6 text-gray-600" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Explore</h3>
              <h4 className="text-lg text-green-700 font-semibold mb-3">Great Neighborhoods</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We connect you directly to the person that knows the most about property for sale, the listing realtor.
              </p>
              <button className="text-green-700 hover:text-green-800 font-medium text-sm flex items-center space-x-2">
                <span>Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src={close} alt="icon" className="w-6 h-6 text-gray-600" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find Highly</h3>
              <h4 className="text-lg text-green-700 font-semibold mb-3">Rated Best Property</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We connect you directly to the person that knows the most about property for sale, the listing realtor.
              </p>
              <button className="text-green-700 hover:text-green-800 font-medium text-sm flex items-center space-x-2">
                <span>Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src={close} alt="icon" className="w-6 h-6 text-gray-600" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discover</h3>
              <h4 className="text-lg text-green-700 font-semibold mb-3">Quality Buildings</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We connect you directly to the person that knows the most about property for sale, the listing realtor.
              </p>
              <button className="text-green-700 hover:text-green-800 font-medium text-sm flex items-center space-x-2">
                <span>Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>   

      
      
    </div>
  );
};

export default MainContent;