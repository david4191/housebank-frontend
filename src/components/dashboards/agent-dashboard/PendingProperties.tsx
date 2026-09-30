import { Link } from 'react-router-dom';
import { Plus, Eye, Home, Clock } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyPropertiesQuery } from '../../../redux/housebank.ts';

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const listingTypeLabel: Record<string, string> = {
  sale: 'Buy',
  rent: 'Rent',
  investment: 'Invest',
};

/** One row of either status table below. Both sections share the exact
 * same columns -- only the source query and the empty-state copy differ
 * -- so the table markup lives here once instead of twice. */
function PendingTable({ rows, emptyText }: { rows: any[]; emptyText: string }) {
  if (rows.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <Clock className="w-6 h-6 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((property: any) => {
            const img = imageUrl(property.cover_image);
            return (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {img ? (
                        <img src={img} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <Home className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs truncate">{property.address}, {property.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{formatNaira(property.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{formatDate(property.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{listingTypeLabel[property.listing_type] || property.listing_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/agent/property-details/${property.id}`}
                    className="inline-flex items-center space-x-1 text-sm text-green-700 hover:text-green-800 font-medium"
                    title="View property details"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** This screen's counterpart, and its sibling ApprovedProperties.tsx,
 * aren't linked from anywhere in the app right now — the sidebar's
 * "Manage Property" only points at /agent/properties, which already
 * has an "All / Pending / Approved / …" tab switcher covering the same
 * ground. Kept real and working (rather than left on fake data) in
 * case either gets linked to directly later, but the tabbed view is
 * the one an agent will actually reach day to day.
 *
 * Joan, Sep 2026 -- correction: "its the company that vets and
 * approves properties. The admin only vets and approves companies."
 * There is no admin review stage after a company's own -- a listing
 * a company-attached agent submits sits at `pending_company_review`
 * until that company approves or rejects it, then it's either live
 * (`approved`) or `rejected`. This used to also show a second
 * "Awaiting admin review" section (status `pending`) -- removed, since
 * nothing is ever routed there any more.
 */
const AgentPendingProperties = () => {
  const { data: companyReviewProperties, isLoading: companyReviewLoading } =
    useGetMyPropertiesQuery({ status: 'pending_company_review' });

  const companyReviewRows = companyReviewProperties || [];
  const totalCount = companyReviewRows.length;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
            <span className="text-sm text-gray-500">({totalCount})</span>
          </div>
          <Link
            to="/agent/add-property"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Property</span>
          </Link>
        </div>

        {/* Awaiting company review — the company this listing was
            submitted under hasn't approved it yet. Once they do, it's
            live immediately -- there's no second, admin-side queue. */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <h2 className="text-base font-semibold text-gray-900">Awaiting company review</h2>
            <span className="text-sm text-gray-500">({companyReviewRows.length})</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200">
            {companyReviewLoading ? (
              <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
            ) : (
              <PendingTable
                rows={companyReviewRows}
                emptyText="Nothing waiting on your company's review right now."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPendingProperties;
