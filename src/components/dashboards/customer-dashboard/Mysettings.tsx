import { useEffect, useState } from 'react';
import { CreditCard, Trash2, Star } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import TwoFactorSection from '../shared/TwoFactorSection.tsx';
import ChangePasswordSection from '../shared/ChangePasswordSection.tsx';
import AvatarUpload from '../shared/AvatarUpload.tsx';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from '../../../redux/housebank.ts';

interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

const CARD_BRANDS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'verve', label: 'Verve' },
  { value: 'american_express', label: 'American Express' },
  { value: 'discover', label: 'Discover' },
  { value: 'other', label: 'Other' },
];

function brandLabel(value: string) {
  return CARD_BRANDS.find((b) => b.value === value)?.label || value;
}

/**
 * A well-detailed customer profile: name, contact address, and date of
 * birth, plus the avatar upload widget shared with the agent settings
 * page. Loads from and saves to GET/PUT /profile/me — nothing here is
 * hardcoded or invented.
 */
const ProfileSection = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateMyProfileMutation();
  const [form, setForm] = useState({ full_name: '', address: '', city: '', state: '', date_of_birth: '' });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.profile) {
      setForm({
        full_name: profile.profile.full_name || '',
        address: profile.profile.address || '',
        city: profile.profile.city || '',
        state: profile.profile.state || '',
        date_of_birth: profile.profile.date_of_birth ? String(profile.profile.date_of_birth).slice(0, 10) : '',
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setError('');
    setSaved(false);
    const result: any = await updateProfile(form);
    if (result.error) {
      const err = result.error;
      const firstError = err?.errors ? (Object.values(err.errors)[0] as string[])?.[0] : null;
      setError(firstError || err?.message || 'Could not save your profile.');
      return;
    }
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile</h3>
        <p className="text-sm text-gray-500">
          Your personal details, visible to the platform and to the realtors you work with.
        </p>
      </div>

      <AvatarUpload />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving || isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
};

/**
 * "Card details" — deliberately reference-only. Only brand, last 4
 * digits, expiry and cardholder name are ever collected or stored; the
 * form has no full-card-number field and no CVV field at all, and
 * nothing here is wired to a live payment gateway yet. See the backend
 * comment on customer_payment_methods (database/schema.sql) for the
 * full reasoning — in short, storing a real PAN/CVV on shared hosting
 * with no PCI-DSS program behind it would be a security failure, not a
 * feature.
 */
const PaymentMethodsSection = () => {
  const { data: cards, isLoading } = useGetMyPaymentMethodsQuery();
  const [addCard, { isLoading: adding }] = useAddPaymentMethodMutation();
  const [deleteCard] = useDeletePaymentMethodMutation();
  const [setDefaultCard] = useSetDefaultPaymentMethodMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ card_brand: 'visa', last4: '', expiry_month: '', expiry_year: '', cardholder_name: '' });
  const [error, setError] = useState('');

  const resetForm = () => {
    setForm({ card_brand: 'visa', last4: '', expiry_month: '', expiry_year: '', cardholder_name: '' });
    setError('');
  };

  const handleAdd = async () => {
    setError('');
    if (!/^\d{4}$/.test(form.last4)) {
      setError('Enter the last 4 digits of the card.');
      return;
    }
    if (!form.expiry_month || !form.expiry_year) {
      setError('Enter the card expiry.');
      return;
    }
    if (!form.cardholder_name.trim()) {
      setError('Enter the name on the card.');
      return;
    }
    const result: any = await addCard({
      card_brand: form.card_brand,
      last4: form.last4,
      expiry_month: Number(form.expiry_month),
      expiry_year: Number(form.expiry_year),
      cardholder_name: form.cardholder_name.trim(),
    });
    if (result.error) {
      const err = result.error;
      const firstError = err?.errors ? (Object.values(err.errors)[0] as string[])?.[0] : null;
      setError(firstError || err?.message || 'Could not save this card.');
      return;
    }
    resetForm();
    setShowForm(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 15 }, (_, i) => currentYear + i);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Methods</h3>
          <p className="text-sm text-gray-500 max-w-lg">
            Save a card here for reference on your account. This stores only the card brand, last 4
            digits, expiry and cardholder name — never the full card number or security code — and
            no card here is charged automatically.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 flex-shrink-0"
          >
            Add a card
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card brand</label>
              <select
                value={form.card_brand}
                onChange={(e) => setForm((p) => ({ ...p, card_brand: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {CARD_BRANDS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 digits</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.last4}
                onChange={(e) => setForm((p) => ({ ...p, last4: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                placeholder="1234"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry month</label>
              <select
                value={form.expiry_month}
                onChange={(e) => setForm((p) => ({ ...p, expiry_month: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry year</label>
              <select
                value={form.expiry_year}
                onChange={(e) => setForm((p) => ({ ...p, expiry_year: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
              <input
                type="text"
                value={form.cardholder_name}
                onChange={(e) => setForm((p) => ({ ...p, cardholder_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {adding ? 'Saving…' : 'Save card'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : cards && cards.length > 0 ? (
        <div className="space-y-3">
          {cards.map((card: any) => (
            <div key={card.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {brandLabel(card.card_brand)} •••• {card.last4}
                    {card.is_default ? (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.cardholder_name} · Expires {String(card.expiry_month).padStart(2, '0')}/{card.expiry_year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!card.is_default && (
                  <button onClick={() => setDefaultCard(card.id)} title="Make default" className="p-2 text-gray-400 hover:text-slate-700">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteCard(card.id)} title="Remove card" className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && <p className="text-sm text-gray-500">No cards saved yet.</p>
      )}
    </div>
  );
};

const MySettingsPage = () => {
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'property-update',
      label: 'Property Update',
      enabled: false
    },
    {
      id: 'event-update',
      label: 'Event Update',
      enabled: true
    },
    {
      id: 'discount-sales',
      label: 'Discount Sales',
      enabled: false
    }
  ]);

  const [advancedSettings, setAdvancedSettings] = useState<NotificationSetting[]>([
    {
      id: 'desktop-notification',
      label: 'Desktop Notification',
      description: 'Receive Notification about product update, importance announcement etc.',
      enabled: true
    },
    {
      id: 'email-notification',
      label: 'Email Notification',
      description: 'Receive email messages',
      enabled: true
    },
    {
      id: 'unread-badge',
      label: 'Enable Unread notification Badge',
      description: 'Receive Notification about product update, importance announcement etc.',
      enabled: true
    },
    {
      id: 'push-notification',
      label: 'Push Notification',
      enabled: true
    },
    {
      id: 'mobile-push-notification',
      label: 'Mobile Push Notification',
      enabled: true
    }
  ]);

  // Toggle function for notification settings
  const toggleNotificationSetting = (id: string, isAdvanced: boolean = false) => {
    if (isAdvanced) {
      setAdvancedSettings(prev =>
        prev.map(setting =>
          setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
        )
      );
    } else {
      setNotificationSettings(prev =>
        prev.map(setting =>
          setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
        )
      );
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-slate-700' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Profile */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        </div>

        <div className="space-y-6 mb-10">
          <ProfileSection />
        </div>

        {/* Security */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        </div>

        <div className="space-y-6 mb-10">
          <ChangePasswordSection />
          <TwoFactorSection />
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        </div>

        <div className="space-y-6 mb-10">
          <PaymentMethodsSection />
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Notify me when section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notify me when:</h3>

            <div className="space-y-6">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{setting.label}</h4>
                    {setting.description && (
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                    )}
                  </div>
                  <ToggleSwitch
                    enabled={setting.enabled}
                    onToggle={() => toggleNotificationSetting(setting.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Advanced notification settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-6">
              {advancedSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">{setting.label}</h4>
                    {setting.description && (
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                  <div className="ml-6">
                    <ToggleSwitch
                      enabled={setting.enabled}
                      onToggle={() => toggleNotificationSetting(setting.id, true)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySettingsPage;
