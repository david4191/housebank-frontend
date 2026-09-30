
import { useState } from 'react';
import { Upload } from 'lucide-react';

// You'll need to add this background image to your assets folder
import heroBackground from '../assets/investment/main-property.png';
import shock from '../assets/investment/shock.png';

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
  
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              {/* Top Section - Property Type and Listing Type (from d2.jpg) */}
              <div className="space-y-6 mb-8">
                {/* Property Type */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {propertyTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.propertyType === type}
                          onChange={() => handleInputChange('propertyType', type)}
                          className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 whitespace-nowrap">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
  
                {/* Listing Type */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                    Listing Type
                  </label>
                  <div className="flex space-x-6">
                    {listingTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.listingType === type}
                          onChange={() => handleInputChange('listingType', type)}
                          className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 whitespace-nowrap">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Bottom Section - Two Column Layout (from d1.jpg) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
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
                  <div className="flex items-start space-x-4">
                    <label className="text-sm font-medium text-gray-700 min-w-[120px] mt-2">
                      Property Features:
                    </label>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="flex items-center space-x-2 cursor-pointer mb-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Bedrooms</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Bathrooms</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 cursor-pointer mb-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Square Footage</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Amenities</span>
                        </label>
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Preferred Contact Method:
                    </label>
                    <div className="flex space-x-6">
                      <span className="text-sm text-gray-700">Email</span>
                      <span className="text-sm text-gray-700">Phone Number</span>
                    </div>
                  </div>
  
                  {/* Working with Agent */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Are you working with a realtor?
                    </label>
                    <div className="flex space-x-6">
                      <span className="text-sm text-gray-700">Email</span>
                      <span className="text-sm text-gray-700">Phone Number</span>
                    </div>
                  </div>
  
                  {/* Best Time to Contact */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Best Time to Contact You:
                    </label>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-700">Morning</span>
                      <span className="text-sm text-gray-700">Afternoon</span>
                      <span className="text-sm text-gray-700">Evening</span>
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
              </div>
            </form>
          </div>
  
          {/* Newsletter Subscription Section */}
          <section className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-8">
            <div className="flex items-center justify-between p-8 lg:p-12">
              {/* Left - Person Image */}
              <div className="flex-shrink-0">
                <img 
                  src={shock} 
                  alt="Excited person with hands up" 
                  className="w-48 h-48 lg:w-36 lg:h-36 object-cover object-center"
                />
              </div>
  
              {/* Center - Text Content */}
              <div className="flex-1 text-center px-8">
                <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
                  Get new property details direct
                  <br />
                  to your inbox
                </h2>
              </div>
  
              {/* Right - Subscribe Button */}
              <div className="flex-shrink-0">
                <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-gray-600">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };
  
  export default ListPropertyPage;