import { FileCheck2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

/** "Document & Compliance" has no backend behind it yet — no document
 * upload/verification workflow, no compliance-status tracking. The
 * previous version of this page was actually a 4th copy of the same
 * fake "properties with amount/status" transactions table already
 * covered for real by Revenue and My Listings — unrelated to
 * documents, and just as fake. Replaced with an honest placeholder
 * describing what this page will do once that feature exists, rather
 * than another mislabeled fake table. */
const DocumentCompliancePage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Document &amp; Compliance</h1>

          <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
            <FileCheck2 className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Not available yet</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Document verification — uploading compliance paperwork and tracking its review status — isn't built
              yet. This page will show real submissions and their status once that feature ships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCompliancePage;
