import { AlertTriangle } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

import mainImage from '../../../assets/c5.png';
import secondImage from '../../../assets/c2.png';
import thirdImage from '../../../assets/c3.png';

interface DocumentItem {
  label: string;
  hasView: boolean;
}

const SoldPropertyDocumentsPage = () => {
  const handleViewDocument = (documentName: string) => {
    console.log(`Viewing document: ${documentName}`);
  };

  const propertyTitleDocuments: DocumentItem[] = [
    { label: 'Certificate of Occupancy', hasView: true },
    { label: "Governor's Consent:", hasView: true },
    { label: 'Registered Survey Plan:', hasView: true },
    { label: 'Allocation Letter:', hasView: true }
  ];

  const buildingApprovalDocuments: DocumentItem[] = [
    { label: 'Approved Building Plan:', hasView: true },
    { label: 'Property Valuation Report:', hasView: true },
    { label: 'Land Search Report:', hasView: true }
  ];

  const transactionDocuments: DocumentItem[] = [
    { label: 'Property Price & Details:', hasView: true },
    { label: 'Sales Agreement:', hasView: true },
    { label: 'Payment Receipt:', hasView: true },
    { label: 'Deed of Agreement:', hasView: true }
  ];

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
            <span className="bg-gray-500 text-white text-sm px-4 py-1 rounded-full font-medium">
              Sold
            </span>
          </div>

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
            <div className="grid grid-rows-2 gap-4">
              <div>
                <img
                  src={secondImage}
                  alt="Kitchen"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <img
                  src={thirdImage}
                  alt="Living room"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Content Grid - Property Details and Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Property Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Property Name:</span>
                  <span className="font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Owner's Name:</span>
                  <span className="font-medium text-gray-900">Johnson Isaa</span>
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

            {/* Right Column - Property Title Documents */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Title Documents</h2>

              <div className="space-y-4">
                {propertyTitleDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{doc.label}</span>
                    {doc.hasView && (
                      <button
                        onClick={() => handleViewDocument(doc.label)}
                        className="px-6 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Building & Property Approval Documents and Offer & Transaction Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Building & Property Approval Documents */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Building & Property Approval Documents</h2>

              <div className="space-y-4">
                {buildingApprovalDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{doc.label}</span>
                    {doc.hasView && (
                      <button
                        onClick={() => handleViewDocument(doc.label)}
                        className="px-6 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Offer & Transaction Documents */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Offer & Transaction Documents</h2>

              <div className="space-y-4">
                {transactionDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{doc.label}</span>
                    {doc.hasView && (
                      <button
                        onClick={() => handleViewDocument(doc.label)}
                        className="px-6 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Please Note Warning */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Please Note!</h4>
                <p className="text-sm text-gray-700">
                  These documents cannot be saved or download by a realtor, realtors that ignore this can have his/her account temporary/ permanently removed{' '}
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

export default SoldPropertyDocumentsPage;