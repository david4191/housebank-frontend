import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface SecurityFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettingsPage = () => {
  const [formData, setFormData] = useState<SecurityFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleInputChange = (field: keyof SecurityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving security settings:', formData, { twoFactorEnabled });
  };

  const handleCancel = () => {
    // Handle cancel logic here
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Security Setting</h1>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    value={formData.oldPassword}
                    onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Set up 2 Factor Authentication
                </span>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleSave}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;