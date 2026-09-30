import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import propertyImage from '../../../assets/property/1.png';

const CustomerOtherTransactionPage = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'buy' | 'rent' | 'invest'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Transaction</h1>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                Make Payment
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 gap-22 mb-6">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'recent'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Transaction
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'buy'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'rent'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setActiveTab('invest')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'invest'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invest
            </button>
          </div>

          {/* Transaction Card */}
          <div className="bg-gray rounded-lg p-6 shadow-sm max-w-lg">
            {/* Property Image */}
            <div className="mb-4">
              <div className="bg-gray-300 rounded-lg overflow-hidden aspect-video w-full">
                <img 
                  src={propertyImage} 
                  alt="Luxury Apartment" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Property name:</span>
                <span className="text-gray-900 font-medium text-sm">Luxury Apartment</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Price:</span>
                <span className="text-gray-900 font-medium text-sm">₦1,000.00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Agency Name:</span>
                <span className="text-gray-900 font-medium text-sm">Efab</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Contact:</span>
                <span className="text-gray-900 font-medium text-sm">07035532345</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Payment Duration:</span>
                <span className="text-gray-900 font-medium text-sm">3 Month</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Payment:</span>
                <span className="text-gray-900 font-medium text-sm">₦1,000,000</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Balance:</span>
                <span className="bg-orange-200 rounded-full p-2 text-orange-600 font-medium text-sm">₦1,500,000</span>
              </div>
            </div>

            {/* View All Transactions Button */}
            <div className="mt-6 text-center">
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View all Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOtherTransactionPage;