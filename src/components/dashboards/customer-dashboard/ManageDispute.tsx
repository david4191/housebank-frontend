import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  failedTransactionDetails: File | null;
  message: string;
}

const ManageDispute = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    failedTransactionDetails: null,
    message: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        failedTransactionDetails: file
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dispute submitted:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setFormData({
      email: '',
      fullName: '',
      phoneNumber: '',
      failedTransactionDetails: null,
      message: ''
    });
    console.log('Dispute cancelled');
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Dispute</h2>
          
          {/* Subtitle Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Have you encountered a failed transaction? Let us know!
            </h3>
            <p className="text-gray-600">
              We're committed to creating a safe and trustworthy environment for everyone.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="max-w-4xl">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="@gmail.com"
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g John"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+234"
                  required
                />
              </div>

              {/* Details of the failed transaction */}
              <div>
                <label htmlFor="failedTransactionDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Details of the failed transaction
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.failedTransactionDetails?.name || ''}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    placeholder="Upload the receipt of the failed transaction"
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>
              </div>
            </div>

            {/* Your Message */}
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={8}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Do you have additional messages ?"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Send
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageDispute;