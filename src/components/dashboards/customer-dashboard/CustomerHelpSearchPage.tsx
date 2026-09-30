import { Search } from 'lucide-react';

interface CustomerHelpSearchProps {
  greetingName: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const CustomerHelpSearch = ({ greetingName, value, onChange, onSubmit }: CustomerHelpSearchProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Page Header */}

        <div className="text-center mb-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Hi {greetingName}, how can we help?
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative flex items-center max-w-2xl mx-auto">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search how - tos and more"
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
    </div>
  );
};

export default CustomerHelpSearch;
