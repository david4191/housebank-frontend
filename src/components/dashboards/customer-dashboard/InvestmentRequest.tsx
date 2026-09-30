import { Download, AlertTriangle } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// Investment images - you'll need to replace these with your actual image imports
import propertyMain from '../../../assets/investment/property-1.png';
import propertyImg1 from '../../../assets/investment/interior5.png';
import propertyImg2 from '../../../assets/investment/interior3.png';

interface InvestorDetails {
  fullName: string;
  houseBankAccountId: string;
  contactEmail: string;
  phoneNumber: string;
}

interface PropertyDocumentation {
  investmentContract: string;
  investmentCertificate: string;
  taxComplianceStatus: 'Completed' | 'Pending' | 'Not Started';
}

interface FinancialOverview {
  totalInvestmentAmount: string;
  totalInvestmentPercentage: string;
  totalEarningsToDate: string;
  nextPayoutDate: string;
  paymentMethod: string;
}

interface InvestmentSummary {
  investmentType: string;
  investmentProperty: string;
  propertyLocation: string;
  investmentStartDate: string;
  investmentDuration: string;
  status: 'Invest now' | 'Active' | 'Completed';
}

const InvestmentRequestDetailsPage = () => {
  const investorDetails: InvestorDetails = {
    fullName: "Oakwood Luxury Apartment",
    houseBankAccountId: "HB2116750",
    contactEmail: "Oakwood@gmail.com",
    phoneNumber: "+2349900226"
  };

  const propertyDocumentation: PropertyDocumentation = {
    investmentContract: "Download Property Document",
    investmentCertificate: "Certificate of Ownership",
    taxComplianceStatus: "Completed"
  };

  const financialOverview: FinancialOverview = {
    totalInvestmentAmount: "N12, 000,000",
    totalInvestmentPercentage: "30%",
    totalEarningsToDate: "N15, 000,000",
    nextPayoutDate: "8/15/17",
    paymentMethod: "Bank Transfer"
  };

  const investmentSummary: InvestmentSummary = {
    investmentType: "Real Estate Fund",
    investmentProperty: "Oakwood Luxury Apartment",
    propertyLocation: "Lekki phase 1 Lagos Nigeria",
    investmentStartDate: "9/18/16",
    investmentDuration: "8/15/17",
    status: "Invest now"
  };

  const propertyImages = [
    propertyImg1,
    propertyImg2
  ];

  const handleDownload = (documentType: string) => {
    console.log(`Downloading ${documentType}`);
  };

  const handleInvestNow = () => {
    console.log('Invest now clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Invest now':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaxStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Investment Details</h2>
        </div>

        {/* Property Images Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Main large image */}
            <div className="lg:col-span-2">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img 
                  src={propertyMain} 
                  alt="Investment Property Main View" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Smaller images grid */}
            <div className="grid grid-cols-1 gap-2 h-full">
              {propertyImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Investment property view ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handleInvestNow}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Invest now
          </button>
          <button
            onClick={handleCancel}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Investor Details */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Investor Details</h3>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Full Name</span>
                  <span className="text-sm text-gray-900">{investorDetails.fullName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">HouseBank Account ID:</span>
                  <span className="text-sm text-gray-900">{investorDetails.houseBankAccountId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Contact Email:</span>
                  <span className="text-sm text-gray-900">{investorDetails.contactEmail}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Phone Number:</span>
                  <span className="text-sm text-gray-900">{investorDetails.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Documentation */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Property Documentation</h3>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Investment Contract:</span>
                  <button
                    onClick={() => handleDownload('Investment Contract')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{propertyDocumentation.investmentContract}</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Investment Certificate:</span>
                  <button
                    onClick={() => handleDownload('Investment Certificate')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{propertyDocumentation.investmentCertificate}</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tax & Compliance Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTaxStatusColor(propertyDocumentation.taxComplianceStatus)}`}>
                    {propertyDocumentation.taxComplianceStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview and Investment Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Financial Overview */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Overview</h3>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Investment Amount:</span>
                  <span className="text-sm text-gray-900 font-semibold">{financialOverview.totalInvestmentAmount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Investment Amount:</span>
                  <span className="text-sm text-gray-900 font-semibold">{financialOverview.totalInvestmentPercentage}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Earnings to Date:</span>
                  <span className="text-sm text-gray-900 font-semibold">{financialOverview.totalEarningsToDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Next Payout Date:</span>
                  <span className="text-sm text-gray-900">{financialOverview.nextPayoutDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Payment Method</span>
                  <span className="text-sm text-gray-900">{financialOverview.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Summary</h3>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Type:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentType}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Property:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentProperty}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Property Location:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.propertyLocation}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Start Date:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentStartDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Duration:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentDuration}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(investmentSummary.status)}`}>
                    {investmentSummary.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Assistance Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Assistance?</h4>
              <p className="text-sm text-gray-700">
                If you have any questions about your investment, please contact HouseBank Support at{' '}
                <a href="mailto:support@housebank.com" className="text-blue-600 hover:text-blue-800 underline">
                  support@housebank.com
                </a>
                {' '}or call{' '}
                <a href="tel:+234708000022200" className="text-blue-600 hover:text-blue-800 underline">
                  +234708000022200
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

export default InvestmentRequestDetailsPage;