import { useState } from 'react';
import CustomerHeader from './CustomerHeader';

interface InvestmentSummary {
  name: string;
  address: string;
  type: string;
  investmentDuration: string;
  investmentStartDate: string;
  investmentMaturityDate: string;
  status: 'Under Review' | 'Active' | 'Completed';
}

interface PaymentInfo {
  amountToPay: string;
  referenceNumber: string;
}

interface FormData {
  paymentMethods: {
    card: boolean;
    bank: boolean;
  };
  nameOnCard: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  referenceNumber: string;
  investmentPlan: string;
  shares: string;
  amountOfShares: number;
  saveCardDetails: boolean;
}

const CustomerInvestmentsPayment = () => {
  const [formData, setFormData] = useState<FormData>({
    paymentMethods: {
      card: true,
      bank: false
    },
    nameOnCard: 'Mustapha Sodiq',
    cardNumber: '254662331665',
    expiration: '',
    cvv: '',
    referenceNumber: 'HB00011112',
    investmentPlan: '6-months',
    shares: '10,000 naira/Share',
    amountOfShares: 5,
    saveCardDetails: false
  });

  const investmentSummary: InvestmentSummary = {
    name: "Oakwood Luxury Apartment",
    address: "5TH Avenue Gwarinpa Abuja",
    type: "2-Bedroom Apartment",
    investmentDuration: "6 Months",
    investmentStartDate: "01-01-2025",
    investmentMaturityDate: "01-01-2026",
    status: "Under Review"
  };

  const paymentInfo: PaymentInfo = {
    amountToPay: "N50,000",
    referenceNumber: "HB0001112"
  };

  const totalAmount = "N50,000";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('paymentMethod.')) {
      const method = name.split('.')[1] as 'card' | 'bank';
      setFormData(prev => ({
        ...prev,
        paymentMethods: {
          ...prev.paymentMethods,
          [method]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePaymentMethodChange = (method: 'card' | 'bank', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: checked
      }
    }));
  };

  const handleInvestNow = () => {
    console.log('Investment submitted:', formData);
    // Handle investment submission
  };

  const handleCancel = () => {
    console.log('Investment cancelled');
    // Handle cancellation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Form */}
          <div className="space-y-6">
            {/* Choose Payment Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <div className="flex items-center space-x-58 mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="paymentMethod.card"
                    checked={formData.paymentMethods.card}
                    onChange={(e) => handlePaymentMethodChange('card', e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Use Card</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="paymentMethod.bank"
                    checked={formData.paymentMethods.bank}
                    onChange={(e) => handlePaymentMethodChange('bank', e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Bank Transfer</span>
                </label>
              </div>

              {/* Show card details if card payment is selected */}
              {formData.paymentMethods.card && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Card Details</h4>
                  
                  {/* Investment Plan and Shares - shown at top when card is selected */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Investment Plan:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {formData.investmentPlan}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Shares:</span>
                      <span className="text-sm text-gray-900">{formData.shares}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Amount of shares:</span>
                      <span className="text-sm text-gray-900">{formData.amountOfShares} shares</span>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Mustapha Sodiq"
                      />
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="254662331665"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration
                        </label>
                        <input
                          type="text"
                          id="expiration"
                          name="expiration"
                          value={formData.expiration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="1234"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        id="referenceNumber"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="HB00011112"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Show bank transfer details if bank transfer is selected */}
              {formData.paymentMethods.bank && (
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Bank Transfer Details</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Investment Plan:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {formData.investmentPlan}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Shares:</span>
                    <span className="text-sm text-gray-900">{formData.shares}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Amount of shares:</span>
                    <span className="text-sm text-gray-900">{formData.amountOfShares} shares</span>
                  </div>

                  {/* Bank Transfer Information */}
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Bank Name:</span>
                      <span className="text-sm text-gray-900">Example Bank</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Account Number:</span>
                      <span className="text-sm text-gray-900">1234567890</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Account Name:</span>
                      <span className="text-sm text-gray-900">Investment Platform Ltd</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Reference:</span>
                      <span className="text-sm text-gray-900">{formData.referenceNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Show message if both payment methods are selected */}
              {(formData.paymentMethods.card && formData.paymentMethods.bank) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Both payment methods selected. Please complete the payment using one method only.
                  </p>
                </div>
              )}

              {/* Total Amount */}
              <div className="mt-8 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-4">{totalAmount}</div>
                
                {/* Save Card Details Checkbox - Only show if card payment is selected */}
                {formData.paymentMethods.card && (
                  <label className="flex items-center justify-center space-x-2 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      name="saveCardDetails"
                      checked={formData.saveCardDetails}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Save card Details?</span>
                  </label>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4">
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
              </div>
            </div>
          </div>

          {/* Right Column - Investment Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <span className="text-sm text-gray-900 text-right">{investmentSummary.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Address:</span>
                  <span className="text-sm text-gray-900 text-right">{investmentSummary.address}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.type}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Duration:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentDuration}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Start Date:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentStartDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Investment Maturity Date:</span>
                  <span className="text-sm text-gray-900">{investmentSummary.investmentMaturityDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(investmentSummary.status)}`}>
                    {investmentSummary.status}
                  </span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Amount to Pay:</span>
                    <span className="text-sm text-gray-900 font-semibold">{paymentInfo.amountToPay}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Reference number:</span>
                    <span className="text-sm text-gray-900">{paymentInfo.referenceNumber}</span>
                  </div>

                  {/* Show selected payment methods */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Selected Methods:</span>
                    <span className="text-sm text-gray-900">
                      {[
                        formData.paymentMethods.card && 'Card',
                        formData.paymentMethods.bank && 'Bank Transfer'
                      ].filter(Boolean).join(', ') || 'None'}
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

export default CustomerInvestmentsPayment;