import { useState } from 'react';
import CustomerHeader from './CustomerHeader';

const CustomerBuyPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState('100,000');

  const handleMakePayment = () => {
    console.log('Processing payment...');
  };

  const handleCancel = () => {
    console.log('Payment cancelled');
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <CustomerHeader />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Left Column - Payment Duration */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment Duration</h2>
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                  3 months
                </span>
              </div>
              
              {/* Choose Payment Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Payment Method</h3>
                
                <div className="flex items-center justify-between">
                  {/* Use Card Option - Left side */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.checked ? 'card' : '')}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="card" className="ml-2 text-sm font-medium text-gray-900">
                      Use Card
                    </label>
                  </div>

                  {/* Bank Transfer Option - Right side */}
                  <div className="flex items-center">
                    
                    <input
                      type="checkbox"
                      id="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.checked ? 'bank' : 'card')}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="bank" className="ml-3 text-sm text-gray-700">
                      Bank Transfer
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Details Form */}
              <div className="space-y-4">{/* Always show the form fields */}
                  {/* Name on Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Enter name on card"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Enter card number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                    />
                  </div>

                  {/* Expiration and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Reference number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-gray-50"
                    />
                  </div>
                </div>

              {/* Security Notice */}
              <div className="flex justify-center mt-6">
                 <input
                      type="checkbox"
                     className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                <p className="ml-3 text-sm text-gray-600">
                  Save card details?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleMakePayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
                >
                  Make Payment
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Investment Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Investment Summary</h2>
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                  Monthly
                </span>
              </div>

              {/* Investment Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">Oakwood Luxury Apartment</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Address:</span>
                  <span className="text-sm text-gray-900">878 Avenue Georgina Road</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">3-Bedroom Apartment</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Duration:</span>
                  <span className="text-sm text-gray-900">6 Months</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Start Date:</span>
                  <span className="text-sm text-gray-900">01-05-2025</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Maturity Date:</span>
                  <span className="text-sm text-gray-900">01-05-2026</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                    Ongoing
                  </span>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Payment Information</h3>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount to Pay:</span>
                  <span className="text-sm font-medium text-gray-900">N65,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reference number:</span>
                  <span className="text-sm text-gray-900">HSP001112</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBuyPayment;