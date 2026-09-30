// src/components/dashboards/company-dashboard/CompanyPropertyRequest.tsx
import { useNavigate } from 'react-router-dom';
import { Inbox, ArrowRight } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

/**
 * The old page was a fully fabricated request queue: seven hardcoded
 * "#HB111"-style rows all attributed to the same "Abubakar Isa", fake
 * "Request Reason" strings ("Rent Overdue", "Repayment Due") with no
 * real meaning, and Approve/Reject actions (via PropertyActionModals)
 * that updated nothing — the whole page was disconnected from the
 * database from top to bottom.
 *
 * There is no "property request" concept anywhere in HouseBank's
 * schema or backend — nothing generates a request when a customer
 * views, favorites, or wants to buy/rent a property, and this route
 * isn't linked from anywhere else in the real product (no sidebar
 * entry points here). Rather than keep a page that looks
 * functional but silently does nothing, this is an honest
 * placeholder: it says plainly that the feature isn't built yet and
 * points to the two things a company can actually do today —
 * approve/manage its own listings and roster.
 */
const CompanyPropertyRequests = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Property Requests isn't available yet</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            HouseBank doesn't have a request queue for properties today — there's nothing here to approve or
            reject. If this is something your team needs, let us know and we'll scope it properly rather than
            fake it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/company/property')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go to My Properties
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/company/realtors')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Manage Realtors
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyPropertyRequests;
