import { Star } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

/** Customer reviews aren't a real feature yet — there's no backend
 * module for a customer to rate an agent or a completed deal (no
 * reviews table, no rating endpoint). The old version of this page
 * showed nine fake reviews with garbled placeholder text ("rafekem
 * gilawofa when I wamed Xadure pm") as if they were real customer
 * feedback. Replaced with an honest "not live yet" state rather than
 * inventing ratings that never happened. */
const AgentReviewPage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h1>

          <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
            <Star className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Reviews aren't live yet</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              HouseBank doesn't yet support customers leaving a rating or review after a purchase or lease. Once
              that's built, real feedback from your customers will show up here — nothing invented in the
              meantime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentReviewPage;
