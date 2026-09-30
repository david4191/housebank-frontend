import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Phone, Building2 } from 'lucide-react';
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

function formatDate(value: string | undefined | null) {
  if (!value) return '-';
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

const AgentManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: contacts, isLoading } = useGetMyContactsQuery();
  const list = contacts || [];

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return list;
    return list.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.company_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [list, searchQuery]);

  const handleMessage = (contact: any) => {
    navigate('/customer/messages', { state: { startWith: contact } });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Realtor</h1>
              <p className="text-sm text-gray-500 mt-1">
                {list.length === 0
                  ? 'Realtors and companies you deal with will appear here'
                  : `${list.length} contact${list.length === 1 ? '' : 's'} from your properties`}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">Loading…</div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              You haven't dealt with a realtor or company yet. Booking a property viewing is what starts that
              relationship — once a realtor or company has a property you've viewed, bought, rented, or invested in,
              they'll show up here and you'll be able to message them directly.
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">No matches for your search.</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Works With</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Interaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((contact: any) => {
                    const avatar = imageUrl(contact.avatar_path);
                    return (
                      <tr key={`${contact.contact_type}-${contact.user_id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
                              {avatar ? (
                                <img src={avatar} alt={contact.name} className="w-full h-full object-cover" />
                              ) : contact.contact_type === 'company' ? (
                                <Building2 className="w-4 h-4" />
                              ) : (
                                initialsFor(contact.name)
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-black">{contact.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{contact.contact_type}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{contact.company_name || '-'}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{contact.email || '-'}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{contact.phone || '-'}</span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700" title={contact.properties?.join(', ')}>
                            {contact.properties?.length || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{formatDate(contact.last_interaction_at)}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleMessage(contact)}
                              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"
                              title="Message"
                            >
                              <MessageCircle className="w-4 h-4 text-white" />
                            </button>
                            {contact.phone && (
                              <a
                                href={`tel:${contact.phone}`}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                                title="Call"
                              >
                                <Phone className="w-4 h-4 text-gray-600" />
                              </a>
                            )}
                          </div>
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
  );
};

export default AgentManagementPage;
