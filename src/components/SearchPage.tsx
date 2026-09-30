import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

/**
 * Search bar shown at the top of /listed-properties-cover (and
 * /housebank-Users-cover). There is no backend "how-to" search endpoint
 * behind this box -- it previously just console.logged the query and went
 * nowhere. Rather than fake a results page, it now sends the query to the
 * real property search on /explore (see ExploreProperty.tsx, which already
 * reads `q` from the URL), the one real, working search this platform has.
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  return (
    <div className=" flex items-center justify-center py-4 mt-6">
      <div className="w-100 max-w-2xl">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search how - tos and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-16 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="absolute right-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;
