import { useState } from 'react';
import { Download } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface PropertyInfo {
  name: string;
  address: string;
  type: string;
  rentalDuration: string;
  leaseStartDate: string;
  leaseEndDate: string;
  status: 'Expiring Soon' | 'Active' | 'Expired';
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  transactionId: string;
  houseBankAccountId: string;
  preferredRenewalDuration: string;
  message: string;
}

const RequestRenewal = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Umar Ibrahim',
    email: 'Ibrahim@gmail.com',
    phoneNumber: '+2349034556677',
    transactionId: '122345337788889',
    houseBankAccountId: 'HB0102222',
    preferredRenewalDuration: '',
    message: ''
  });

  const propertyInfo: PropertyInfo = {
    name: "Oakwood Luxury Apartment",
    address: "5TH Avenue Gwarinpa Abuja",
    type: "2-Bedroom Apartment",
    rentalDuration: "12 Months",
    leaseStartDate: "01-01-2025",
    leaseEndDate: "01-01-2026",
    status: "Expiring Soon"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Renewal request submitted:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log('Request cancelled');
  };

  const handleDownloadTransaction = () => {
    console.log('Downloading transaction document');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Expiring Soon':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Request Renewal</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Property Information Display */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Address:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.address}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.type}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Rental Duration:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.rentalDuration}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Lease Start Date:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.leaseStartDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Lease End Date:</span>
                  <span className="text-sm text-gray-900">{propertyInfo.leaseEndDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(propertyInfo.status)}`}>
                    {propertyInfo.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Umar Ibrahim"
                />
              </div>

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
                  placeholder="Ibrahim@gmail.com"
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
                  placeholder="+2349034556677"
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="122345337788889"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleDownloadTransaction}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* HouseBank Account ID */}
              <div>
                <label htmlFor="houseBankAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                  HouseBank Account ID
                </label>
                <input
                  type="text"
                  id="houseBankAccountId"
                  name="houseBankAccountId"
                  value={formData.houseBankAccountId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="HB0102222"
                  readOnly
                />
              </div>

              {/* Preferred Renewal Duration */}
              <div>
                <label htmlFor="preferredRenewalDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Renewal Duration
                </label>
                <input
                  type="text"
                  id="preferredRenewalDuration"
                  name="preferredRenewalDuration"
                  value={formData.preferredRenewalDuration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 12 months"
                />
              </div>
            </div>

            {/* Your Message */}
            <div className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Do you have additional messages ?"
              />
            </div>
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
        </form>
      </div>
    </div>
  );
};

export default RequestRenewal;