import CustomerHeader from './CustomerHeader';
import propertyExterior from '../../../assets/property/house-porch.png';
import kitchen from '../../../assets/property/dining-area.png';
import livingRoom from '../../../assets/property/living-room.png';

const RentChartDetailsPage = () => {
  // Calculate progress percentage
  const totalDays = 377;
  const progressPercentage = (totalDays / 365) * 100;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Rent Details</h1>

          {/* Property Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Main Image */}
            <div className="bg-blue-400 rounded-lg overflow-hidden aspect-video">
              <img 
                src={propertyExterior}
                alt="Property exterior" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Side Images Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-300 rounded-lg overflow-hidden h-48">
                <img 
                  src={kitchen}
                  alt="Kitchen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-gray-300 rounded-lg overflow-hidden h-48">
                <img 
                  src={livingRoom}
                  alt="Living Room" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 font-medium">
              Report Tenant
            </button>
            <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 font-medium">
              List Property
            </button>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Property Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Property Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Name:</span>
                  <span className="text-gray-900 font-medium">Oakwood Luxury Apartment</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-700 font-medium">Address:</span>
                  <span className="text-gray-900 font-medium text-right">5TH Avenue Gwarinpa Abuja</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Type:</span>
                  <span className="text-gray-900 font-medium">2-Bedroom Apartment</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Rental Duration:</span>
                  <span className="text-gray-900 font-medium">12 Months</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Lease Start Date:</span>
                  <span className="text-gray-900 font-medium">01-01-2025</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Lease End Date:</span>
                  <span className="text-gray-900 font-medium">01-01-2026</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Status:</span>
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Expired
                  </span>
                </div>
              </div>
            </div>

            {/* Rent Progress */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Rent Progress</h2>
              
              <div className="flex items-center justify-center pt-8">
                <div className="relative w-64 h-64">
                  {/* Progress Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="#f3f4f6"
                      strokeWidth="24"
                      fill="none"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="#ea580c"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 110}`}
                      strokeDashoffset={`${2 * Math.PI * 110 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{totalDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Client Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Client Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Tenant's Name:</span>
                  <span className="text-gray-900 font-medium">Alhaji Umar Ibrahim</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Contact Email:</span>
                  <span className="text-blue-600 font-medium">alhajiumar@gmail.com</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Phone Number:</span>
                  <span className="text-gray-900 font-medium">+2349077444678</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Occupation:</span>
                  <span className="text-gray-900 font-medium">Business Man</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Emergency Contact:</span>
                  <span className="text-gray-900 font-medium">+2349077444678</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Monthly Rent:</span>
                  <span className="text-gray-900 font-medium">₦150,000</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Security Deposit:</span>
                  <span className="text-gray-900 font-medium">₦300,000</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Payment Method:</span>
                  <span className="text-gray-900 font-medium">Bank Transfer</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Last Payment Date:</span>
                  <span className="text-gray-900 font-medium">15-12-2024</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Next Payment Due:</span>
                  <span className="text-gray-900 font-medium">15-01-2025</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Payment Status:</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentChartDetailsPage;