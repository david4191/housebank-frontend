import { Star, MessageCircle, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomerHeader from './CustomerHeader';
import realtorAvatar from '../../../assets/realtor-avatar.png';
import property1 from '../../../assets/property-1.png';
import property2 from '../../../assets/property-2.png';
import property3 from '../../../assets/property-3.png';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  rating: number;
  beds: number;
  baths: number;
  area: string;
}

const MyRealtorDetailsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const properties: Property[] = [
    {
      id: '1',
      title: 'Roma Luxury Apartments',
      price: 'N90,000',
      location: 'Lagos, Nigeria',
      image: property1,
      rating: 4.5,
      beds: 2,
      baths: 2,
      area: '1,200 sq ft'
    },
    {
      id: '2',
      title: 'Haleway Apartments',
      price: 'N90,000',
      location: 'Lagos, Nigeria',
      image: property2,
      rating: 4.5,
      beds: 2,
      baths: 2,
      area: '1,200 sq ft'
    },
    {
      id: '3',
      title: 'Rendez Mansion',
      price: 'N90,000',
      location: 'Lagos, Nigeria',
      image: property3,
      rating: 4.5,
      beds: 2,
      baths: 2,
      area: '1,200 sq ft'
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Realtor Details</h1>

          {/* Tab Navigation */}
          <div className="flex mb-6">
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Profile
            </button>
            <button className="px-52 py-2 text-sm font-medium text-grey-600">
              Properties
            </button>
          </div>

          {/* Top Section - Profile and Properties Side by Side */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left - Realtor Profile */}
              <div className="lg:col-span-1">
                {/* Profile Image */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
                    <img
                      src={realtorAvatar}
                      alt="Nicholas James"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Nicholas James</h3>
                </div>

                {/* Properties Count */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">6 Properties</p>
                </div>

                {/* Action Icons */}
                <div className="flex items-center justify-center space-x-4">
                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Right - Properties Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-w-4 aspect-h-3">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                          {property.title}
                        </h4>
                        <p className="text-green-600 font-bold text-base mb-1">
                          {property.price}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-500 space-x-2">
                            <span>{property.beds} bed</span>
                            <span>•</span>
                            <span>{property.baths} bath</span>
                            <span>•</span>
                            <span>{property.area}</span>
                          </div>
                          <div className="flex items-center">
                            {renderStars(property.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Contact Information and Agent Bio */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <span className="text-gray-600 text-sm block mb-1">
                    Phone Number:
                  </span>
                  <p className="font-medium text-gray-900">+2349077444678</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">Email:</span>
                  <p className="font-medium text-blue-600">
                    nicholasjames@gmail.com
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">Address:</span>
                  <p className="font-medium text-gray-900">
                    3rd Avenue Gwarinpa Abuja
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">
                    License Number:
                  </span>
                  <p className="font-medium text-gray-900">13045 2563</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">
                    Year Of Experience:
                  </span>
                  <p className="font-medium text-gray-900">5 years of Experience</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">
                    Specialization:
                  </span>
                  <p className="font-medium text-gray-900">
                    Residential, Commercial, Luxury, etc
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-1">
                    Location:
                  </span>
                  <p className="font-medium text-gray-900">
                    3rd Avenue Gwarinpa Abuja
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Bio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Realtor Bio</h3>
              <p className="text-gray-600 leading-relaxed">
                With 5 years of experience in the real estate industry, Sarah
                Thompson is a dedicated Residential Realtor known for helping
                clients find their dream homes and maximizing investment returns.
                Specializing in Residential/Commercial/Luxury markets, she offers
                exceptional customer service and in-depth local market expertise
                to familiarize customers and exceptional customer service.
              </p>
            </div>

           {/* Action Buttons - Note: Report Agent navigates to the new page */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/report-realtor")}
              className="bg-gray-900 text-white py-2.5 px-6 rounded-lg hover:bg-gray-800 font-medium text-sm"
            >
              Report Realtor
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Transfer Asset
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-out">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center transform transition-all duration-300 scale-95 animate-fadeIn">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Warning</h2>
            <p className="text-gray-500 text-sm mb-6">
              note that your properties will be transfer to the new Realtor
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-900 text-white py-2.5 px-6 rounded-lg hover:bg-gray-800 font-medium text-sm">
                Request for Transfer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRealtorDetailsPage;
