import { useState } from 'react';
import { MoreHorizontal, ChevronDown, Heart } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// Property data types
interface Property {
  id: number;
  image: string;
  address: string;
  company: string;
  agent: string;
  status: 'Available' | 'Sold' | 'Rent';
  category: string;
  action: 'Buy' | 'Rent' | 'Sold';
}

interface HotSale {
  id: number;
  name: string;
  price: string;
  duration: string;
  image: string;
  favorite?: boolean;
}

const CustomerWishlist = () => {
  // Sample property data
  const properties: Property[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=60&fit=crop',
      address: '2079 Washington Rd, Sewickley Heights PA 15143',
      company: 'Efab',
      agent: 'Wade Warren',
      status: 'Available',
      category: 'Bungalow',
      action: 'Buy'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=60&fit=crop',
      address: '4118 Thornridge Cir. Syracuse, Connecticut 35624',
      company: 'Efab',
      agent: 'Cameron Williamson',
      status: 'Rent',
      category: 'Apartment',
      action: 'Rent'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=100&h=60&fit=crop',
      address: '3517 Washington Ave. Manchester, Kentucky 39495',
      company: 'Efab',
      agent: 'Brooklyn Simmons',
      status: 'Sold',
      category: 'Duplex',
      action: 'Sold'
    }
  ];

  // Hot sales data
  const hotSales: HotSale[] = [
    {
      id: 1,
      name: 'Land Investment',
      price: '₦1,000,000',
      duration: '15 Months',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop',
      favorite: false
    },
    {
      id: 2,
      name: 'Rendez House Bay',
      price: '₦1,000,000',
      duration: '22 Months',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
      favorite: false
    },
    {
      id: 3,
      name: 'Rendez House Bay',
      price: '₦1,000,000',
      duration: '8 Months',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop',
      favorite: false
    },
    {
      id: 4,
      name: 'Land Investment',
      price: '₦1,000,000',
      duration: '24 Months',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop',
      favorite: false
    }
  ];

  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-blue-100 text-blue-800';
      case 'Rent':
        return 'bg-orange-100 text-orange-800';
      case 'Sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Buy':
        return 'text-blue-600 hover:text-blue-700';
      case 'Rent':
        return 'text-orange-600 hover:text-orange-700';
      case 'Sold':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        {/* Properties Table */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Property</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Address</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Realtor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={property.image} 
                          alt="Property" 
                          className="w-12 h-8 object-cover rounded"
                        />
                        <span className="text-sm text-gray-600">Luxury Apartment</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{property.address}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{property.company}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{property.agent}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{property.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <button className={`text-sm font-medium ${getActionColor(property.action)}`}>
                        {property.action}
                      </button>
                      <button className="ml-3 p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hot Sales/Promotions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Hot Sales/Promotions</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              Explore all
              <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotSales.map((property) => (
                <div key={property.id} className="relative group">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={property.image} 
                      alt={property.name} 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <button 
                      onClick={() => toggleFavorite(property.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.includes(property.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>
                    
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-4 text-white w-full">
                        <div className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                          {property.duration}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{property.name}</h4>
                        <p className="text-sm font-bold">{property.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWishlist;