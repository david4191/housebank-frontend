import { useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface ReportForm {
  reasons: string[];
  dateOfIncident: string;
  details: string;
  supportingEvidence: File | null;
  fullName: string;
  email: string;
  phoneNumber: string;
}

const ReportRealtorPage = () => {
  const [formData, setFormData] = useState<ReportForm>({
    reasons: [],
    dateOfIncident: '',
    details: '',
    supportingEvidence: null,
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const reasonOptions = [
    'Fraudulent activity',
    'Unprofessional behavior', 
    'Misleading property information activity',
    'Poor communication or lack of response',
    'Harassment or inappropriate conduct',
    'Other (please specify)'
  ];

  const handleReasonChange = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.includes(reason)
        ? prev.reasons.filter(r => r !== reason)
        : [...prev.reasons, reason]
    }));
  };

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      supportingEvidence: file
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
      reasons: [],
      dateOfIncident: '',
      details: '',
      supportingEvidence: null,
      fullName: '',
      email: '',
      phoneNumber: ''
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Realtor's Conduct</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you have encountered any issues with this realtor's conduct, please report your concerns. We take 
              complaints seriously and will review your report to ensure fair and professional conduct within our platform.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {/* Reason for Reporting */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Reporting (Select one or more)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reasonOptions.map((reason, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reasons.includes(reason)}
                      onChange={() => handleReasonChange(reason)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Date of Incident */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date of Incident:</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select date"
                    value={formData.dateOfIncident}
                    onChange={(e) => handleInputChange('dateOfIncident', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Supporting Evidence */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Evidence (Optional)</h3>
                <div className="relative">
                  <input
                    type="file"
                    id="evidence-upload"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent"
                  >
                    <span className="text-gray-500">
                      {formData.supportingEvidence ? formData.supportingEvidence.name : 'Screenshots, emails, chat logs,'}
                    </span>
                    <Upload className="w-5 h-5 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Details of the Incident */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details of the Incident</h3>
                <textarea
                  placeholder="Description"
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Your Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information (Confidential)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g John"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 pt-6">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Send
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
      </div>
    </div>
  );
};

export default ReportRealtorPage;