import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Paperclip, Send, Building2 } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import useAuth from '../../../hooks/useAuth.tsx';
import {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMyContactsQuery,
  useStartConversationMutation,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} from '../../../redux/housebank.ts';

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

function timeAgo(value: string | undefined | null) {
  if (!value) return '';
  const then = new Date(value.replace(' ', 'T')).getTime();
  if (Number.isNaN(then)) return '';
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return new Date(then).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}

function formatFullTimestamp(value: string | undefined | null) {
  if (!value) return '';
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-NG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const MessagesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const myUserId = auth.user?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedId, setSelectedId] = useState<number | 'pending' | null>(null);
  const [pendingContact, setPendingContact] = useState<any | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: conversationsLoading } = useGetConversationsQuery();
  const { data: contacts } = useGetMyContactsQuery();
  const { data: activeConversation, isLoading: conversationLoading } = useGetConversationQuery(
    typeof selectedId === 'number' ? selectedId : 0,
    { skip: typeof selectedId !== 'number' }
  );

  const [startConversation, { isLoading: starting }] = useStartConversationMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  // Arrived from "My Realtor" with a contact to message — reuse the
  // existing thread with them if there is one, otherwise open a fresh
  // composer for that contact.
  useEffect(() => {
    const startWith = (location.state as { startWith?: any } | null)?.startWith;
    if (!startWith || !conversations) return;
    const existing = conversations.find((c: any) => c.other_participant?.user_id === startWith.user_id);
    if (existing) {
      setSelectedId(existing.conversation_id);
    } else {
      setPendingContact(startWith);
      setSelectedId('pending');
    }
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, location.state]);

  useEffect(() => {
    if (typeof selectedId === 'number') {
      markRead(selectedId);
    }
  }, [selectedId, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages?.length]);

  const filteredConversations = useMemo(() => {
    const list = conversations || [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((c: any) => c.other_participant?.name?.toLowerCase().includes(q));
  }, [conversations, searchTerm]);

  // Contacts you can start a fresh thread with — i.e. not already an
  // open conversation.
  const messageableContacts = useMemo(() => {
    const openWith = new Set((conversations || []).map((c: any) => c.other_participant?.user_id));
    return (contacts || []).filter((c: any) => !openWith.has(c.user_id));
  }, [conversations, contacts]);

  const handlePickContact = (contact: any) => {
    setPendingContact(contact);
    setSelectedId('pending');
    setIsPickerOpen(false);
  };

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text) return;
    setSendError(null);
    try {
      if (selectedId === 'pending' && pendingContact) {
        const res = await startConversation({ target_user_id: pendingContact.user_id, message: text }).unwrap();
        setSelectedId(res.id);
        setPendingContact(null);
      } else if (typeof selectedId === 'number') {
        await sendMessage({ conversationId: selectedId, body: text }).unwrap();
      }
      setMessageText('');
    } catch (err: any) {
      setSendError(err?.message || 'Could not send your message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeHeader =
    selectedId === 'pending'
      ? pendingContact
      : activeConversation?.other_participant || null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <div className="relative">
                <button
                  onClick={() => setIsPickerOpen((v) => !v)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Start a new conversation"
                >
                  <Plus className="w-5 h-5" />
                </button>
                {isPickerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
                    {messageableContacts.length === 0 ? (
                      <p className="p-4 text-xs text-gray-500">
                        No new contacts to message. Realtors and companies show up here once you've booked a viewing
                        or dealt with them.
                      </p>
                    ) : (
                      messageableContacts.map((c: any) => (
                        <button
                          key={`${c.contact_type}-${c.user_id}`}
                          onClick={() => handlePickContact(c)}
                          className="w-full flex items-center px-4 py-2 hover:bg-gray-50 text-left"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
                            {imageUrl(c.avatar_path) ? (
                              <img src={imageUrl(c.avatar_path)!} alt={c.name} className="w-full h-full object-cover" />
                            ) : c.contact_type === 'company' ? (
                              <Building2 className="w-4 h-4" />
                            ) : (
                              initialsFor(c.name)
                            )}
                          </div>
                          <span className="text-sm text-gray-900 truncate">{c.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Something"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {conversationsLoading ? (
              <p className="p-4 text-sm text-gray-500">Loading…</p>
            ) : filteredConversations.length === 0 && selectedId !== 'pending' ? (
              <p className="p-4 text-sm text-gray-500">
                No conversations yet. Message a realtor from{' '}
                <button className="text-green-700 underline" onClick={() => navigate('/customer/my-realtor')}>
                  My Realtor
                </button>{' '}
                to start one.
              </p>
            ) : (
              <>
                {selectedId === 'pending' && pendingContact && (
                  <div className="flex items-center p-4 bg-green-50 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
                      {imageUrl(pendingContact.avatar_path) ? (
                        <img src={imageUrl(pendingContact.avatar_path)!} alt={pendingContact.name} className="w-full h-full object-cover" />
                      ) : (
                        initialsFor(pendingContact.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{pendingContact.name}</h3>
                      <p className="text-sm text-green-700">New conversation</p>
                    </div>
                  </div>
                )}
                {filteredConversations.map((c: any) => (
                  <div
                    key={c.conversation_id}
                    onClick={() => setSelectedId(c.conversation_id)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                      selectedId === c.conversation_id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
                      {imageUrl(c.other_participant?.avatar_path) ? (
                        <img
                          src={imageUrl(c.other_participant.avatar_path)!}
                          alt={c.other_participant?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : c.other_participant?.role === 'company' ? (
                        <Building2 className="w-4 h-4" />
                      ) : (
                        initialsFor(c.other_participant?.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{c.other_participant?.name}</h3>
                        <span className="text-xs text-gray-500">{timeAgo(c.last_message?.created_at || c.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {c.last_message ? c.last_message.body : 'No messages yet'}
                        </p>
                        {c.unread_count > 0 && (
                          <span className="ml-2 flex-shrink-0 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeHeader ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation, or message a realtor from My Realtor to start one.
            </div>
          ) : (
            <>
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
                    {imageUrl(activeHeader.avatar_path) ? (
                      <img src={imageUrl(activeHeader.avatar_path)!} alt={activeHeader.name} className="w-full h-full object-cover" />
                    ) : (
                      initialsFor(activeHeader.name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activeHeader.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {activeHeader.contact_type || activeHeader.role || ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedId === 'pending' ? (
                  <p className="text-center text-sm text-gray-500">
                    Say hello to start your conversation with {pendingContact?.name}.
                  </p>
                ) : conversationLoading ? (
                  <p className="text-center text-sm text-gray-500">Loading…</p>
                ) : (
                  activeConversation?.messages?.map((message: any) => {
                    const isOwn = message.sender_id === myUserId;
                    return (
                      <div key={message.id}>
                        <div className="text-center mb-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {formatFullTimestamp(message.created_at)}
                          </span>
                        </div>
                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white border-t border-gray-200 p-4">
                {sendError && <p className="text-xs text-red-600 mb-2">{sendError}</p>}
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Message"
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span title="File attachments aren't supported yet"><Paperclip className="w-4 h-4 text-gray-300" /></span>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={starting || sending || !messageText.trim()}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {starting || sending ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
