import { useState, useRef } from 'react';
import { CheckCircle, X, Plus } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import upload from '../../../assets/Upload.png';

interface PropertyForm {
  propertyName: string;
  propertyType: string;
  price: string;
  facilities: string;
  location: string;
  city: string;
  currentStatus: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpace: string;
  propertyDescription: string;
  images: File[];
}

type ModalState = 'none' | 'success-validation' | 'success-deleted' | 'error';

const DocumentComplaince = () => {
  const [currentModal, setCurrentModal] = useState<ModalState>('none');
  const [formData, setFormData] = useState<PropertyForm>({
    propertyName: '',
    propertyType: '',
    price: '',
    facilities: '',
    location: '',
    city: '',
    currentStatus: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpace: '',
    propertyDescription: '',
    images: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PropertyForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const handleSubmit = () => {
    // Simulate form submission
    // In a real app, this would make an API call
    setCurrentModal('success-validation');
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      propertyName: '',
      propertyType: '',
      price: '',
      facilities: '',
      location: '',
      city: '',
      currentStatus: '',
      bedrooms: '',
      bathrooms: '',
      parkingSpace: '',
      propertyDescription: '',
      images: []
    });
  };

  const handleBackToHome = () => {
    setCurrentModal('none');
    // In a real app, this would navigate to home/dashboard
  };

  const handleTryAgain = () => {
    setCurrentModal('none');
  };

  const handleGetHelp = () => {
    // Open help/support
    console.log('Opening help...');
  };

  // Success Modal - Validation
  const SuccessValidationModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-12 text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Successful</h2>
        <p className="text-gray-600 mb-8">Your property has been successfully sent for validation</p>
        <button
          onClick={handleBackToHome}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  // Success Modal - Deleted
  const SuccessDeletedModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-12 text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Successful</h2>
        <p className="text-gray-600 mb-8">Your property has been successfully been deleted</p>
        <button
          onClick={handleBackToHome}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  // Error Modal
  const ErrorModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-12 text-center max-w-md mx-4">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <X className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-8">Failed. Please try again or contact support if the issue persists.</p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleTryAgain}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGetHelp}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Get Help
          </button>
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">List Property</h1>
            <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={upload} alt="Upload" className="mx-auto mb-4 w-12 h-12" />
                <p className="text-gray-600 mb-2">Drop your Image here or click on Browse</p>
                <p className="text-sm text-gray-500">JPG, PNG or PDF file size not more than 10mb</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Property Details Form */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Details</h3>
              <p className="text-sm text-gray-600 mb-6">Your messages will be delivered to the receiver</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.propertyName}
                    onChange={(e) => handleInputChange('propertyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.facilities}
                    onChange={(e) => handleInputChange('facilities', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.currentStatus}
                    onChange={(e) => handleInputChange('currentStatus', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parking space</label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.parkingSpace}
                    onChange={(e) => handleInputChange('parkingSpace', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Description</label>
                <textarea
                  placeholder="Value"
                  value={formData.propertyDescription}
                  onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Demo buttons for testing modals */}
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentModal('success-validation')}
                className="text-xs bg-gray-100 px-3 py-1 rounded text-gray-600"
              >
                Test Success
              </button>
              <button
                onClick={() => setCurrentModal('success-deleted')}
                className="text-xs bg-gray-100 px-3 py-1 rounded text-gray-600"
              >
                Test Deleted
              </button>
              <button
                onClick={() => setCurrentModal('error')}
                className="text-xs bg-gray-100 px-3 py-1 rounded text-gray-600"
              >
                Test Error
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentModal === 'success-validation' && <SuccessValidationModal />}
      {currentModal === 'success-deleted' && <SuccessDeletedModal />}
      {currentModal === 'error' && <ErrorModal />}
    </div>
  );
};

export default DocumentComplaince;