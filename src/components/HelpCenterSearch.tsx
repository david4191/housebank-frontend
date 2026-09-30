import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import useAuth from '../hooks/useAuth.tsx';
import { useGetHelpTopicsQuery } from '../redux/housebank.ts';

interface HelpTopic {
  id: number;
  category?: string;
  question: string;
  answer: string;
  sort_order?: number;
}

const HelpSearchPage = () => {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Real Help Center topics from the DB — search box and category tabs
  // below filter this live instead of doing nothing.
  const { data: topics, isLoading, isError } = useGetHelpTopicsQuery();

  const categories = useMemo(() => {
    const rows = (topics || []) as HelpTopic[];
    const unique = Array.from(
      new Set(rows.map((t) => t.category).filter((c): c is string => Boolean(c)))
    );
    return ['All', ...unique];
  }, [topics]);

  const results = useMemo(() => {
    const rows = (topics || []) as HelpTopic[];
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesQuery =
        !q || t.question.toLowerCase().includes(q) || (t.answer || '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [topics, searchQuery, activeCategory]);

  const greetingName = (auth.user?.full_name || '').trim().split(/\s+/)[0] || 'there';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleItem = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="help-search" className="bg-white">
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

        {/* Category Tabs — real categories present in help_topics, not a fixed guess */}
        {categories.length > 1 && (
          <div className="flex">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live results — real rows from help_topics, filtered by the search box
            and category tabs above. This is also what the "Browse all topics"
            button on the guides section below scrolls back up to. */}
        <div className="mt-6 max-w-3xl mx-auto text-left">
          {isLoading && <p className="text-sm text-gray-500 text-center py-6">Loading help topics…</p>}
          {isError && (
            <p className="text-sm text-red-600 text-center py-6">Couldn't load help topics right now.</p>
          )}
          {!isLoading && !isError && results.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              {searchQuery ? `No results for "${searchQuery}".` : 'No help topics yet.'}
            </p>
          )}
          {!isLoading && !isError && results.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
              {results.map((topic) => {
                const isExpanded = expandedId === topic.id;
                return (
                  <div key={topic.id}>
                    <button
                      type="button"
                      onClick={() => toggleItem(topic.id)}
                      className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-800 font-medium text-base pr-4">{topic.question}</span>
                      <span className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </span>
                    </button>
                    {isExpanded && topic.answer && (
                      <div className="px-6 pb-5 -mt-2">
                        <p className="text-gray-600 text-sm leading-relaxed">{topic.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSearchPage;
