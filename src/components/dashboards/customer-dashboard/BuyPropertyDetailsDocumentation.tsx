import { Download } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// Property images - you'll need to replace these with your actual image imports
import propertyMain from '../../../assets/property/2.png';
import propertyImg1 from '../../../assets/property-1.png';
import propertyImg2 from '../../../assets/property-2.png';
import propertyImg3 from '../../../assets/property-3.png';
import propertyImg4 from '../../../assets/property-4.png';

interface PropertyInfo {
  name: string;
  address: string;
  type: string;
  size: string;
  status: 'Owned' | 'Rented' | 'For Sale';
}

interface DocumentItem {
  title: string;
  downloadText: string;
  fileName: string;
}

const PropertyDocumentationDetailsPage = () => {
  const propertyInfo: PropertyInfo = {
    name: "Oakwood Luxury Apartment",
    address: "123 Palm Avenue, Lekki, Lagos",
    type: "3-Bedroom Apartment",
    size: "2500 sq ft",
    status: "Owned"
  };

  const documents: DocumentItem[] = [
    {
      title: "Property Documents",
      downloadText: "Download Property Document",
      fileName: "property-document.pdf"
    },
    {
      title: "Certificate of Ownership",
      downloadText: "Certificate of Ownership",
      fileName: "certificate-of-ownership.pdf"
    },
    {
      title: "Transaction Receipt",
      downloadText: "Download Transaction Receipt",
      fileName: "transaction-receipt.pdf"
    }
  ];

  const propertyImages = [
    propertyImg1,
    propertyImg2,
    propertyImg3,
    propertyImg4
  ];

  const handleDownload = (fileName: string) => {
    // Handle document download
    console.log(`Downloading ${fileName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Owned':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rented':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'For Sale':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Property Details</h2>
        </div>

        {/* Property Images Section */}
        <div className="mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-80">
            {/* Main large image */}
            <div className="lg:col-span-2">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img 
                  src={propertyMain} 
                  alt="Property Main View" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Smaller images grid */}
            <div className="grid grid-cols-2 gap-2 h-full">
              {propertyImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Property view ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Documentation */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Property Documentation</h3>
            
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.fileName)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{doc.downloadText}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Property Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Property Information</h3>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name:</p>
                    <p className="font-semibold text-gray-900">{propertyInfo.name}</p>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Address:</p>
                    <p className="font-semibold text-gray-900">{propertyInfo.address}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type:</p>
                    <p className="font-semibold text-gray-900">{propertyInfo.type}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Size:</p>
                    <p className="font-semibold text-gray-900">{propertyInfo.size}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status:</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(propertyInfo.status)}`}>
                      {propertyInfo.status}
                    </span>
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

export default PropertyDocumentationDetailsPage;