import { Download, AlertTriangle } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// You'll need to add these images to your assets folder

import secondImage from '../../../assets/c2.png';
import thirdImage from '../../../assets/c3.png';
import fourthImage from '../../../assets/c5.png';

const PropertyEarningsPage = () => {
  const handleDownloadDocument = () => {
    console.log('Downloading property document...');
  };

  const handleDownloadGuidelines = () => {
    console.log('Downloading property guidelines...');
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center space-x-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>
            <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-full font-medium">
              Earned
            </span>
          </div>

          {/* Property Images Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Main Large Image */}
            <div className="col-span-1">
              <img
                src={fourthImage}
                alt="Property exterior"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Right Column - Two stacked images */}
            <div className="grid grid-rows-2 gap-4">
              <div>
                <img
                  src={thirdImage}
                  alt="Kitchen"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <img
                  src={secondImage}
                  alt="Living room"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Content Grid - Rent Details and Property Documentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Rent Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Rent Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Property Name:</span>
                  <span className="font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Location:</span>
                  <span className="font-medium text-gray-900">Epe, Lagos</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Contact Email:</span>
                  <span className="font-medium text-gray-900">Oakwood@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Right Column - Property Documentation */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Documentation</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Property Document:</span>
                  <button
                    onClick={handleDownloadDocument}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Property Document</span>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Earning & Commission:</span>
                  <button
                    onClick={handleDownloadGuidelines}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Property Guidelines</span>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tax & Compliance Status:</span>
                  <span className="px-4 py-1 border-2 border-blue-500 text-blue-600 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Overview</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Investment Amount:</span>
                <span className="text-2xl font-bold text-gray-900">N500,000</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Commission</span>
                <span className="text-2xl font-bold text-gray-900">5%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount Earned:</span>
                <span className="text-2xl font-bold text-gray-900">N25,000</span>
              </div>
            </div>
          </div>

          {/* Need Assistance */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Need Assistance?</h4>
                <p className="text-sm text-gray-700">
                  If you have any questions about your investment, please contact HouseBank Support at{' '}
                  <a href="mailto:support@housebank.com" className="text-blue-600 hover:underline">
                    support@housebank.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+23470800022200" className="text-blue-600 hover:underline">
                    +23470800022200
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEarningsPage;