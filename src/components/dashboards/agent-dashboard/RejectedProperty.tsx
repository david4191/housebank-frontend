import { useState } from 'react';

// You'll need to add these images to your assets folder

import secondImage from '../../../assets/c2.png';
import thirdImage from '../../../assets/c3.png';
import fourthImage from '../../../assets/c5.png';


const AgentRejectedPropertyDetailsPage = () => {
  const [propertyData] = useState({
    name: 'Oakwood Luxury Apartment',
    address: '5TH Avenue Gwarinpa Abuja',
    type: '2-Bedroom Apartment',
    rentalDuration: '12 Months',
    totalRent: 'N6, 000 000.00',
    status: 'Rejected'
  });

  const handleEditProperty = () => {
    console.log('Edit property clicked');
  };

  const handleDeleteProperty = () => {
    console.log('Delete property clicked');
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Rent Details</h1>

        {/* Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <img 
              src={fourthImage}
              alt="Property exterior" 
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          {/* Additional Images */}
          <div className="space-y-4">
            <img 
              src={thirdImage}
              alt="Kitchen" 
              className="w-full h-38 object-cover rounded-lg"
            />
            <img 
              src={secondImage} 
              alt="Living room" 
              className="w-full h-38 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleEditProperty}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Edit Property
          </button>
          <button
            onClick={handleDeleteProperty}
            className="px-8 py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Delete property
          </button>
        </div>

        {/* Property Information */}
        <div className="bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Information</h2>
          
          <div className="space-y-6">
            {/* Name */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-900 font-medium">{propertyData.name}</span>
            </div>

            {/* Address */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-900 font-medium">{propertyData.address}</span>
            </div>

            {/* Type */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Type:</span>
              <span className="text-gray-900 font-medium">{propertyData.type}</span>
            </div>

            {/* Rental Duration */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Rental Duration</span>
              <span className="text-gray-900 font-medium">{propertyData.rentalDuration}</span>
            </div>

            {/* Total Rent Package */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Total Rent package:</span>
              <span className="text-gray-900 font-medium text-lg">{propertyData.totalRent}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center pb-4">
              <span className="text-gray-600">Status:</span>
              <span className="inline-block px-6 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg">
                {propertyData.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRejectedPropertyDetailsPage;