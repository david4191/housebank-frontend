import { useState } from 'react';
import CustomerHeader from './CustomerHeader';
import property1 from '../../../assets/property-1.png';
import property2 from '../../../assets/property-2.png';
import property3 from '../../../assets/property-3.png';
import property4 from '../../../assets/property-4.png';
import property5 from '../../../assets/property-5.png';
import realtor1 from '../../../assets/1.png';
import realtor2 from '../../../assets/2.png';
import realtor3 from '../../../assets/3.png';
import realtor4 from '../../../assets/4.png';
import realtor5 from '../../../assets/5.png';
import realtor6 from '../../../assets/6.png';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
}

interface Realtor {
  id: string;
  name: string;
  image: string;
  type: 'current' | 'receiving';
}

const RealtorTransferPage = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedReceivingRealtor, setSelectedReceivingRealtor] = useState<string>('');
  const [transferReason, setTransferReason] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const properties: Property[] = [
    {
      id: '1',
      title: 'Haleway apartments',
      price: 'N50,000',
      location: 'Lagos, Nigeria',
      image: property1,
      beds: 2,
      baths: 2
    },
    {
      id: '2',
      title: 'Roma Luxury Apartments',
      price: 'N50,000',
      location: 'Lagos, Nigeria',
      image: property2,
      beds: 2,
      baths: 2
    },
    {
      id: '3',
      title: 'Rendez Mansion',
      price: 'N50,000',
      location: 'Lagos, Nigeria',
      image: property3,
      beds: 2,
      baths: 2
    },
    {
      id: '4',
      title: 'Roma Luxury Apartments',
      price: 'N50,000',
      location: 'Lagos, Nigeria',
      image: property4,
      beds: 2,
      baths: 2
    },
    {
      id: '5',
      title: 'Oakwood Luxury Apartments',
      price: 'N50,000',
      location: 'Lagos, Nigeria',
      image: property5,
      beds: 2,
      baths: 2
    }
  ];

  const currentRealtors: Realtor[] = [
    {
      id: '1',
      name: 'Timothy Joe',
      image: realtor1,
      type: 'current'
    }
  ];

  const receivingRealtors: Realtor[] = [
    {
      id: '2',
      name: 'Abraham Lee',
      image: realtor2,
      type: 'receiving'
    },
    {
      id: '3',
      name: 'Samuel Felix',
      image: realtor3,
      type: 'receiving'
    },
    {
      id: '4',
      name: 'Sara Jonathan',
      image: realtor4,
      type: 'receiving'
    },
    {
      id: '5',
      name: 'Micheal Emmanuel',
      image: realtor5,
      type: 'receiving'
    },
    {
      id: '6',
      name: 'Smith Local',
      image: realtor6,
      type: 'receiving'
    }
  ];

  const handleTransfer = () => {
    const transferData = {
      property: selectedProperty,
      receivingRealtor: selectedReceivingRealtor,
      reason: transferReason,
      fullName,
      email,
      phoneNumber
    };
    console.log('Transfer data:', transferData);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request for Realtor Transfer</h1>
            <p className="text-gray-600">
              Each benefit program from this page is another within the Housebank platform. Email is a secure<br />
              Transaction of property management online at this policy.
            </p>
          </div>

          {/* Select Assets to Transfer */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Assets to Transfer</h2>
            <p className="text-gray-600 mb-4">Choose Properties, house and multiple properties to transfer</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property.id)}
                  className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                    selectedProperty === property.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-w-4 aspect-h-3 mb-3">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-green-600 font-semibold text-sm mb-1">{property.price}</p>
                  <p className="text-gray-500 text-xs mb-2">{property.location}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{property.beds} bed</span>
                    <span className="mx-1">•</span>
                    <span>{property.baths} bath</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Realtor Selection */}
<div className="bg-white p-4 rounded-md mb-8">
  <div className="flex flex-col md:flex-row gap-6 items-start">
    {/* Current Realtor */}
    <div className="w-full md:w-48 flex-shrink-0 mb-4 md:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Realtor</h3>
      {currentRealtors.map((realtor) => (
        <div key={realtor.id} className="items-center ">
          <div className="w-12 h-12 rounded-full overflow-hidden mt-4 mb-3">
            <img
              src={realtor.image}
              alt={realtor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{realtor.name}</p>
            <p className="text-xs text-red-500">5 Properties</p>
          </div>
        </div>
      ))}
    </div>

    {/* Receiving Realtors */}
    <div className="w-full flex-1">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Receiving Realtor</h3>
      <div className="flex items-center overflow-x-auto space-x-4 sm:space-x-6 md:space-x-18 py-2">
        {receivingRealtors.map((realtor) => {
          const isSelected = selectedReceivingRealtor === realtor.id;
          return (
            <button
              key={realtor.id}
              onClick={() => setSelectedReceivingRealtor(realtor.id)}
              className={`flex flex-col items-center text-center min-w-[80px] transition-transform ${
                isSelected ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full overflow-hidden mb-1 ${
                  isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}
              >
                <img
                  src={realtor.image}
                  alt={realtor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-gray-900">{realtor.name}</p>
              <p className="text-[11px] text-red-500">5 Properties</p>
            </button>
          );
        })}
      </div>
    </div>
  </div>
</div>


          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reason for Transfer */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Transfer (Optional)</h3>
              <textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Explain your reason for transferring"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Your Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information (Confidential)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleTransfer}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Request Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtorTransferPage;
