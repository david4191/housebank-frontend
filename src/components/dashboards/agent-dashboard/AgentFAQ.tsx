import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGetHelpTopicsQuery } from '../../../redux/housebank.ts';

interface AgentFAQProps {
  searchQuery?: string;
}

interface HelpTopic {
  id: number;
  category?: string;
  question: string;
  answer: string;
}

/** GET /content/help-topics is public and role-agnostic — the exact
 * same real help_topics table the customer FAQ reads from (see
 * CustomerFAQ.tsx). No agent-only backend work needed here. */
const AgentFAQ = ({ searchQuery = '' }: AgentFAQProps) => {
  const { data: topics, isLoading, isError } = useGetHelpTopicsQuery();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const filtered = useMemo(() => {
    const all: HelpTopic[] = topics || [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (t) => t.question.toLowerCase().includes(q) || (t.answer || '').toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const FAQItem = ({ faq }: { faq: HelpTopic }) => {
    const isExpanded = expandedItems.includes(faq.id);
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggleItem(faq.id)}
          className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-gray-800 font-medium text-base pr-4 leading-relaxed">{faq.question}</h3>
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
            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        )}
      </div>
    );
  };

  const mid = Math.ceil(filtered.length / 2);
  const leftColumnFAQs = filtered.slice(0, mid);
  const rightColumnFAQs = filtered.slice(mid);

  return (
    <div id="help-faq" className="bg-gray-50 py-16">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-3">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          {isLoading && <p className="p-8 text-sm text-gray-500">Loading…</p>}
          {isError && <p className="p-8 text-sm text-red-600">Couldn't load help topics right now.</p>}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="p-8 text-sm text-gray-500">
              {searchQuery ? `No results for "${searchQuery}".` : 'No help topics yet.'}
            </p>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:pr-4">
                <div className="space-y-0">
                  {leftColumnFAQs.map((faq) => (
                    <FAQItem key={faq.id} faq={faq} />
                  ))}
                </div>
              </div>
              <div className="p-8 lg:pl-4 border-t lg:border-t-0 lg:border-l border-gray-100">
                <div className="space-y-0">
                  {rightColumnFAQs.map((faq) => (
                    <FAQItem key={faq.id} faq={faq} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentFAQ;
