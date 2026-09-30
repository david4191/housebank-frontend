import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGetHelpTopicsQuery } from '../redux/housebank.ts';

interface HelpTopic {
  id: number;
  category?: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: number;
}

/**
 * Real FAQ section, used on both HomePage.tsx and HelpCenterPage.tsx
 * (Joan, Sep 2026 -- "the website contents are meant to come from the
 * admin, but stored in the DB" / "the buttons and links in
 * http://localhost:5173/help-center are not working"). This used to be
 * a hardcoded faqData array -- literally the same 5 questions duplicated
 * into two columns, several with an empty answer so clicking them
 * expanded nothing -- plus a "View More" button with no onClick handler
 * at all (a dead button). Now it fetches real topics from
 * GET /content/help-topics and "View More" links to /help-center, which
 * is correct whether this renders on the homepage or on Help Center
 * itself.
 */
const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const { data: topics, isLoading, isError } = useGetHelpTopicsQuery();
  const rows = (topics || []) as HelpTopic[];

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const FAQItem = ({ faq, isExpanded }: { faq: HelpTopic, isExpanded: boolean }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleItem(faq.id)}
        className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-gray-800 font-medium text-base pr-4 leading-relaxed">
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && faq.answer && (
        <div className="pb-6 -mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );

  // Split real FAQ rows into two columns -- don't assume exactly 10.
  const midpoint = Math.ceil(rows.length / 2);
  const leftColumnFAQs = rows.slice(0, midpoint);
  const rightColumnFAQs = rows.slice(midpoint);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 py-6">Loading FAQs…</p>
        )}

        {!isLoading && isError && (
          <p className="text-center text-gray-500 py-6">Couldn't load FAQs right now.</p>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <p className="text-center text-gray-500 py-6">No FAQs yet.</p>
        )}

        {/* FAQ Content */}
        {!isLoading && !isError && rows.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column */}
              <div className="p-8 lg:pr-4">
                <div className="space-y-0">
                  {leftColumnFAQs.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isExpanded={expandedItems.includes(faq.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gray-100 transform -translate-x-1/2"></div>

              {/* Right Column */}
              {rightColumnFAQs.length > 0 && (
                <div className="p-8 lg:pl-4 border-t lg:border-t-0 lg:border-l border-gray-100">
                  <div className="space-y-0">
                    {rightColumnFAQs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedItems.includes(faq.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View More Button -- this component doesn't know whether it's
            already on the Help Center page or on the homepage, so
            linking to /help-center is correct either way. */}
        <div className="text-center mt-8">
          <Link
            to="/help-center"
            className="inline-block px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
