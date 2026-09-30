import { Download } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// Sample images - you'll replace these with actual property images
const propertyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop'
];

const CustomerPropertyDetailsPage = () => {
  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
        </div>

        {/* Property Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <img 
              src={propertyImages[0]} 
              alt="Property main view" 
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          
          {/* Side Images */}
          <div className="space-y-4">
            {propertyImages.slice(1).map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Property view ${index + 2}`} 
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Property Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Property Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">Oakwood Luxury Apartment</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-900">123 Palm Avenue, Lekki, Lagos</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Type:</span>
                <span className="text-gray-900">3-Bedroom Apartment</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Size:</span>
                <span className="text-gray-900">2500 sq ft</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Owned
                </span>
              </div>
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Realtor Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Realtor's Name:</span>
                <span className="text-gray-900">Wade Warren</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Agency Name:</span>
                <span className="text-gray-900">Efab</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Contact:</span>
                <span className="text-gray-900">07035532345</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">License Number:</span>
                <span className="text-gray-900">REA-20250001</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Ownership Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Total Amount Paid:</span>
                <span className="text-gray-900 font-semibold">₦58,000,000</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Payment Date:</span>
                <span className="text-gray-900">25th-January-2025</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Payment Method:</span>
                <span className="text-gray-900">Bank Transfer</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Payment Plan:</span>
                <span className="text-gray-900">One-time</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Payment Status:</span>
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Ownership & Documentation */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ownership & Documentation</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Owner Name:</span>
                <span className="text-gray-900">Alhaji Umar Ibarahim</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">HouseBank Account ID:</span>
                <span className="text-gray-900">HB2116750</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Purchase Reference Number:</span>
                <span className="text-gray-900">REF23411</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Date of Ownership Transfer:</span>
                <span className="text-gray-900">02-February-2025</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Certificate of Ownership:</span>
                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Available for download
                </button>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Property Deed Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPropertyDetailsPage;