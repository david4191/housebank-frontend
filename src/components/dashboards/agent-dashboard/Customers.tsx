import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Users } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import { useGetMyContactsQuery } from '../../../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function initialsFor(name: string | undefined | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Real customers derived from GET /contacts/mine (Contact.forLister on
 * the backend) — anyone who's viewed, bought, or rented one of this
 * agent's listings. The old version of this page showed 9 invented
 * names with a fake "Total No of Customers: 36" and a made-up payment
 * status column (Paid/Over Due/InProgress) that nothing in the data
 * model tracks — dropped rather than faked. "Message" opens a real
 * conversation via /agent/messages, the same way My Realtor does on
 * the customer side. */
const ActiveCustomersPage = () => {
  const navigate = useNavigate();
  const { data: contacts, isLoading } = useGetMyContactsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const rows = contacts || [];
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.properties?.some((p: string) => p.toLowerCase().includes(q))
    );
  }, [rows, searchTerm]);

  const handleMessage = (contact: any) => {
    navigate('/agent/messages', { state: { startWith: contact } });
  };

  return (
    <div className="flex-1 bg-gray-50">
      <CustomerHeader />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Active Customers</h1>
              <p className="text-gray-600 text-sm">
                Total customers <span className="font-semibold">{rows.length}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            {isLoading ? (
              <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {rows.length === 0
                    ? "No customers yet — they'll show up here once someone views, buys, or rents one of your listings."
                    : 'No customers match your search.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((customer: any) => {
                      const img = imageUrl(customer.avatar_path);
                      return (
                        <tr key={customer.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
                                {img ? <img src={img} alt={customer.name} className="w-full h-full object-cover" /> : initialsFor(customer.name)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{customer.email || '—'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700 max-w-xs block truncate" title={(customer.properties || []).join(', ')}>
                              {(customer.properties || []).join(', ') || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{formatDate(customer.last_interaction_at)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleMessage(customer)}
                              className="flex items-center space-x-1.5 text-sm text-green-700 hover:text-green-800 font-medium"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCustomersPage;
