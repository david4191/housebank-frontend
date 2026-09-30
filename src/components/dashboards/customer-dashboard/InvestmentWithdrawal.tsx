


import { Download } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import houseExterior from '../../../assets/property/2.png';
import kitchenInterior from '../../../assets/property/3.png';
import livingRoom from '../../../assets/property/1.png';

const CustomerInvestmentWithdrawalDetails = () => {
  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Investment Details</h1>
          <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            Matured
          </span>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Main Image - Left */}
          <div className="rounded-xl overflow-hidden">
            <img 
              src={houseExterior} 
              alt="Property exterior" 
              className="w-full h-80 object-cover"
            />
          </div>
          
          {/* Right Column - Two smaller images stacked */}
          <div className="grid grid-rows-2 gap-4">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={kitchenInterior} 
                alt="Kitchen interior" 
                className="w-full h-38 object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img 
                src={livingRoom} 
                alt="Living room" 
                className="w-full h-38 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium">
            Withdraw
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium">
            Cancel
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Investor Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investor Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Full Name</span>
                  <span className="font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HouseBank Account ID:</span>
                  <span className="font-medium text-gray-900">HB2116750</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Contact Email:</span>
                  <span className="font-medium text-gray-900">Oakwood@gmail.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Phone Number:</span>
                  <span className="font-medium text-gray-900">+2349900226</span>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Investment Amount:</span>
                  <span className="font-medium text-gray-900">N12, 000, 000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Investment Amount:</span>
                  <span className="font-medium text-gray-900">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Next Payout Date:</span>
                  <span className="font-medium text-gray-900">8/15/17</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Payment Method</span>
                  <span className="font-medium text-gray-900">Bank Transfer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Property Documentation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Documentation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Contract:</span>
                  <button className="flex items-center space-x-1 text-gray-600 border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span>Download Property Document</span>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Certificate:</span>
                  <button className="flex items-center space-x-1 text-gray-600 border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span>Certificate of Ownership</span>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tax & Compliance Status:</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Investment Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Type:</span>
                  <span className="font-medium text-gray-900">Real Estate Fund</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Property:</span>
                  <span className="font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Property Location:</span>
                  <span className="font-medium text-gray-900">Lekki phase 1 Lagos Nigeria</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Start Date:</span>
                  <span className="font-medium text-gray-900">9/18/16</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment Duration:</span>
                  <span className="font-medium text-gray-900">8/15/17</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Matured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Assistance */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Need Assistance?</h4>
              <p className="text-sm text-gray-700">
                If you have any questions about your investment, please contact HouseBank Support at{" "}
                <a href="mailto:support@housebank.com" className="text-blue-600 hover:underline">
                  support@housebank.com
                </a>{" "}
                or call{" "}
                <a href="tel:+2347080002200" className="text-blue-600 hover:underline">
                  +23470800022200
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvestmentWithdrawalDetails;