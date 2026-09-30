import { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface DeleteRealtorForm {
  realtorName: string;
  email: string;
  agency: string;
  phoneNumber: string;
  dateJoined: string;
  address: string;
  reasonForDeletion: string;
  confirmDeletion: boolean;
}

type FlowStep = 'form' | 'summary' | 'success';

const DeleteRealtorPage = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('form');
  const [formData, setFormData] = useState<DeleteRealtorForm>({
    realtorName: '',
    email: '',
    agency: '',
    phoneNumber: '',
    dateJoined: '',
    address: '',
    reasonForDeletion: '',
    confirmDeletion: false
  });

  const handleInputChange = (field: keyof DeleteRealtorForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 'form') {
      setCurrentStep('summary');
    }
  };

  const handleDeleteConfirm = () => {
    setCurrentStep('success');
  };

  const handleCancel = () => {
    if (currentStep === 'summary') {
      setCurrentStep('form');
    } else {
      // Reset form or navigate back
      setFormData({
        realtorName: '',
        email: '',
        agency: '',
        phoneNumber: '',
        dateJoined: '',
        address: '',
        reasonForDeletion: '',
        confirmDeletion: false
      });
      setCurrentStep('form');
    }
  };

  // Form Step Component
  const FormStep = () => (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Delete Realtor</h1>
        <div className="flex items-start justify-center mb-8">
          <div className="flex items-center space-x-3 bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-3xl">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Deleting a realtor will remove their profile and revoke access to all associated properties 
              and transactions. Please ensure that any necessary property transfers or reassignment 
              have been completed before proceeding.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Information (Confidential)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Realtor Name</label>
            <input
              type="text"
              placeholder="e.g John"
              value={formData.realtorName}
              onChange={(e) => handleInputChange('realtorName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agency</label>
            <input
              type="text"
              placeholder="abc agency"
              value={formData.agency}
              onChange={(e) => handleInputChange('agency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="+234"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Joined:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select date"
                value={formData.dateJoined}
                onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-1 rounded">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              placeholder="No 232"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Deletion (Optional)</label>
          <textarea
            placeholder="Let us know your reason for deletion"
            value={formData.reasonForDeletion}
            onChange={(e) => handleInputChange('reasonForDeletion', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="mb-8">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.confirmDeletion}
              onChange={(e) => handleInputChange('confirmDeletion', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">I understand that deleting this realtor will permanently remove their profile.</span>
          </label>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleNext}
            disabled={!formData.confirmDeletion}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={handleCancel}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Summary Step Component
  const SummaryStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delete Realtor Summary</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Name</span>
            <span className="font-medium text-gray-900">{formData.realtorName || 'Umary Haruna'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-900">{formData.email || 'ibrahimharuna@gmail.com'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Phone Number</span>
            <span className="font-medium text-gray-900">{formData.phoneNumber || '+2349075616876'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Agency:</span>
            <span className="font-medium text-gray-900">{formData.agency || 'Adron Homes and Properties'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Address</span>
            <span className="font-medium text-gray-900">{formData.address || '5th Avenue Gwarimpa Abuja'}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Reason</span>
            <span className="font-medium text-gray-900 text-right max-w-xs">
              {formData.reasonForDeletion || 'i want all my properties to be managed by 1 realtor'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleDeleteConfirm}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Delete Card
          </button>
          <button
            onClick={handleCancel}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Success Step Component
  const SuccessStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Successful</h1>
          <p className="text-gray-600">Realtor Deletion Request Successful</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {currentStep === 'form' && <FormStep />}
        {currentStep === 'summary' && <SummaryStep />}
        {currentStep === 'success' && <SuccessStep />}
      </div>
    </div>
  );
};

export default DeleteRealtorPage;