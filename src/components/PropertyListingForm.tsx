import { useState } from 'react';
import { Upload } from 'lucide-react';

// You'll need to add this background image to your assets folder
import heroBackground from '../assets/property-listing-bg.jpg';

const ListPropertyPage = () => {
  const [activeTab, setActiveTab] = useState('List Property');
  const [formData, setFormData] = useState({
    propertyType: 'Residential',
    listingType: 'For Sale',
    propertyTitle: '',
    propertyAddress: '',
    salePrice: '',
    monthlyRent: '',
    bedrooms: '',
    squareFootage: '',
    bathrooms: '',
    amenities: '',
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    preferredContactMethod: 'Email',
    workingWithAgent: 'Email',
    bestTimeToContact: 'Morning',
    propertyDescription: ''
  });

  const tabs = ['All Property', 'Buy', 'Rent', 'Land', 'Invest', 'List Property'];
  const propertyTypes = ['Residential', 'Commercial', 'Land/Plot', 'Investment Property'];
  const listingTypes = ['For Sale', 'For Rent'];
  const contactMethods = ['Email', 'Phone Number'];
  const contactTimes = ['Morning', 'Afternoon', 'Evening'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackground})`
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white text-sm mb-2">List your Property</p>
          <h1 className="text-white text-3xl lg:text-4xl font-bold mb-4 max-w-3xl">
            Do you have a property for listing? Let us Help you!
          </h1>
          <p className="text-white text-sm lg:text-base max-w-2xl leading-relaxed">
            Easily showcase your property with House Bank Real Estate by filling out the form below. Once 
            submitted, our team will contact you to finalize the listing process.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-2 transition-colors ${
                activeTab === tab
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Property Information Form */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
            Property Information
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Property Type */}
              <div className="flex items-center space-x-6">
                <label className="text-sm font-medium text-gray-700 w-32">
                  Property Type
                </label>
                <div className="flex space-x-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('propertyType', type)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formData.propertyType === type
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div className="flex items-center space-x-6">
                <label className="text-sm font-medium text-gray-700 w-32">
                  Listing Type
                </label>
                <div className="flex space-x-3">
                  {listingTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('listingType', type)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formData.listingType === type
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Spacious 3-Bedroom Apartment in Downtown"
                  value={formData.propertyTitle}
                  onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Property Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address:
                </label>
                <input
                  type="text"
                  placeholder="Include street, city, state, and postal code"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Price Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (in local currency)
                  </label>
                  <input
                    type="text"
                    placeholder="Indicate sale price or monthly rent"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (in local currency)
                  </label>
                  <input
                    type="text"
                    placeholder="Indicate sale price or monthly rent"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Property Features */}
              <div className="flex items-start space-x-6">
                <label className="text-sm font-medium text-gray-700 w-32 mt-2">
                  Property Features:
                </label>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Bedrooms</label>
                    <input
                      type="text"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Square Footage</label>
                    <input
                      type="text"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Bathrooms</label>
                    <input
                      type="text"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Amenities</label>
                    <input
                      type="text"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange('amenities', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Photos
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <p className="text-sm text-gray-500">Choose a picture for a cover</p>
                    </div>
                    <button type="button" className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100">
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <p className="text-sm text-gray-500">Maximum of 5 other pictures</p>
                    </div>
                    <button type="button" className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100">
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    (Attach high-quality images/videos showcasing your property)
                  </p>
                </div>
              </div>

              {/* Property Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Description:
                </label>
                <textarea
                  rows={8}
                  placeholder="Description"
                  value={formData.propertyDescription}
                  onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Contact Information
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name:
                </label>
                <input
                  type="text"
                  placeholder="Abubakar Isa Ema"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address:
                </label>
                <input
                  type="email"
                  placeholder="@gmail.com"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  placeholder="+234"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Contact Method:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contactMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleInputChange('preferredContactMethod', method)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formData.preferredContactMethod === method
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Working with Agent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you working with a realtor?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contactMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleInputChange('workingWithAgent', method)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formData.workingWithAgent === method
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Best Time to Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Best Time to Contact You:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {contactTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleInputChange('bestTimeToContact', time)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formData.bestTimeToContact === time
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="text-xs text-gray-500 leading-relaxed">
                <p>
                  By listing your property with House Bank Real Estate, you agree to our terms and conditions. 
                  Once submitted, our team will review your details and contact you for the next steps.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Submit your property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyPage;