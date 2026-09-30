import { AlertTriangle, Mail } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

/** No disputes/reports backend exists yet (no table for a staff member
 * to file a conduct complaint against a customer/tenant), so the old
 * form here — checkboxes and text fields with no submit handler at
 * all — could never actually go anywhere. Replaced with an honest
 * state plus a real, working fallback: emailing Support directly. */
const ReportTenantPage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Report Tenant's Conduct</h1>

          <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
            <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Not available yet</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Filing a formal conduct report against a tenant isn't wired up yet — there's nowhere on the backend
              for it to go. For an urgent issue in the meantime, email Support directly and it'll be handled by a
              real person.
            </p>
            <a
              href={`mailto:Support@housebank.com?subject=${encodeURIComponent('Tenant conduct report')}`}
              className="inline-flex items-center space-x-2 bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTenantPage;
