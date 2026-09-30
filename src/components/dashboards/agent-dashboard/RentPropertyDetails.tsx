import CustomerHeader from './CustomerHeader';

// You'll need to add these images to your assets folder
import mainImage from '../../../assets/c5.png';
import secondImage from '../../../assets/c2.png';
import thirdImage from '../../../assets/c3.png';


const AgentRentDetailsPage = () => {
  const handleReportTenant = () => {
    console.log('Report tenant clicked');
  };

  const handleScheduleInspection = () => {
    console.log('Schedule inspection clicked');
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Rent Details</h1>

          {/* Property Images Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Main Large Image */}
            <div className="col-span-1">
              <img
                src={mainImage}
                alt="Property exterior"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Right Column - Two stacked images */}
            <div className="grid grid-rows-1 gap-4">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <button
              onClick={handleReportTenant}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Report Tenant
            </button>
            <button
              onClick={handleScheduleInspection}
              className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Schedule Inspection
            </button>
          </div>

          {/* Property Information and Rent Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Property Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Property Information</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Name:</span>
                  <span className="font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Address:</span>
                  <span className="font-medium text-gray-900">5TH Avenue Gwarinpa Abuja</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Type:</span>
                  <span className="font-medium text-gray-900">2-Bedroom Apartment</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Rental Duration</span>
                  <span className="font-medium text-gray-900">12 Months</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Lease Start Date:</span>
                  <span className="font-medium text-gray-900">01-01-2025</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Lease End Date:</span>
                  <span className="font-medium text-gray-900">01-01-2026</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  <span className="inline-block px-4 py-1 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Rent Progress */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Rent Progress</h2>

              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Progress Circle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="10"
                    />
                    {/* Progress circle - approximately 76 days out of 365 (about 21%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="198.4"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">76 Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRentDetailsPage;