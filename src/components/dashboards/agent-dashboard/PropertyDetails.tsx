import { useState } from 'react';
import { MapPin, Home, Bed, Bath, Star } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

// You'll need to add these images to your assets folder
import mainImage from '../../../assets/c1.png';
import secondImage from '../../../assets/c2.png';
import thirdImage from '../../../assets/c3.png';
import fourthImage from '../../../assets/c4.png';

import firstUser from '../../../assets/1.png';
import secondUser from '../../../assets/2.png';
import thirdUser from '../../../assets/3.png';
import fourthUser from '../../../assets/4.png';
import fifthUser from '../../../assets/5.png';
import sixthUser from '../../../assets/6.png';

interface Message {
  id: string;
  avatar: string;
  title: string;
  message: string;
  time: string;
}

interface Review {
  id: string;
  avatar: string;
  rating: number;
  comment: string;
}

const AgentAvailablePropertyDetails = () => {
  const [activeMessageTab, setActiveMessageTab] = useState<'Cleints' | 'Update'>('Cleints');

  // Sample messages data
  const messages: Message[] = [
    {
      id: '1',
      avatar: firstUser,
      title: 'Real Estate Deals',
      message: 'i was get back to you',
      time: '15:20'
    },
    {
      id: '2',
      avatar: secondUser,
      title: 'Real Estate Deals',
      message: 'i was get back to you',
      time: '15:20'
    },
    {
      id: '3',
      avatar: thirdUser,
      title: 'Real Estate Deals',
      message: 'i was get back to you',
      time: '15:20'
    },
    {
      id: '4',
      avatar: fourthUser,
      title: 'Real Estate Deals',
      message: 'i was get back to you',
      time: '15:20'
    }
  ];

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: '1',
      avatar: fifthUser,
      rating: 4.0,
      comment: 'i effortless got exactly what i wanted. Kudos to you'
    },
    {
      id: '2',
      avatar: sixthUser,
      rating: 4.0,
      comment: 'i effortless got exactly what i wanted. Kudos to you'
    },
    {
      id: '3',
      avatar: thirdUser,
      rating: 4.0,
      comment: 'i effortless got exactly what i wanted. Kudos to you'
    }
  ];

  const facilities = [
    'Big swimming pool',
    'Near Trail Station',
    'Big size garden',
    '4 car Parking',
    '24/7 electricity',
    'Personal Theater'
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>

            {/* Property Images Grid */}
            <div className="grid grid-cols-2 gap-4 w-[100%]">
              {/* Main Large Image */}
              <div className="col-span-1 row-span-3 ">
                <img
                  src={fourthImage}
                  alt="Property exterior"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Three Smaller Images */}
              <div className="col-span-1">
                <img
                  src={thirdImage}
                  alt="Bedroom"
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="col-span-1">
                <img
                  src={secondImage}
                  alt="Living room"
                  className=" object-cover rounded-xl"
                />
              </div>
              <div className="col-span-1">
                <img
                  src={mainImage}
                  alt="Kitchen"
                  className=" object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Property Info Section */}
            <div className="space-y-4">
              {/* Available Badge */}
              <div>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-300">
                  Available
                </span>
              </div>

              {/* Property Name and Location */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Rendez House Bay</h2>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-gray-900">N2,250,000</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900">4.6</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5" />
                  <span>3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5" />
                  <span>3</span>
                </div>
              </div>
            </div>

            {/* Some Facilities */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Some Facilities</h3>
              <div className="flex flex-wrap gap-3">
                {facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Property Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Description</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Messages, Lease Progress, Reviews */}
          <div className="space-y-6">
            {/* Messages Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Messages</h3>

              {/* Message Tabs */}
              <div className="flex items-center border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveMessageTab('Cleints')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeMessageTab === 'Cleints'
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-500 border-transparent'
                  }`}
                >
                  Cleints
                </button>
                <button
                  onClick={() => setActiveMessageTab('Update')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeMessageTab === 'Update'
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-500 border-transparent'
                  }`}
                >
                  Update
                </button>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <img src={message.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{message.title}</h4>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lease Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Lease Progress</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Progress Circle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="83.73"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">22 Days of 30 Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full overflow-hidden flex-shrink-0">
                        <img src={review.avatar} alt="Reviewer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1 mb-2">
                          {[1, 2, 3, 4].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                          <span className="text-sm font-medium text-gray-900 ml-2">{review.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAvailablePropertyDetails;