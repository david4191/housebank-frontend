import { useState } from 'react';
import { Download, Share2, Copy, ArrowLeft } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import report from '../../../assets/report.png';

interface TransactionDetail {
  id: string;
  email: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  senderName: string;
  method: string;
  cardType: string;
  payeeFirstAmount: string;
  commission: string;
  vat: string;
  totalAmountPaid: string;
  transactionNumber: string;
}

const TransactionDetailsPendingPage = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Sample transaction detail data matching the image
  const transactionDetail: TransactionDetail = {
    id: '1',
    email: 'kikikarizma@email.com',
    status: 'Pending',
    date: 'Sep 5, 2024 16:30:16',
    senderName: 'Isa Ibrahim Machew',
    method: '******4307',
    cardType: 'Mastercard',
    payeeFirstAmount: '$30,000',
    commission: '$400',
    vat: '$1,500',
    totalAmountPaid: '$32,100',
    transactionNumber: '#456789356_01'
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-800 text-white-100';
      case 'Pending':
        return 'bg-orange-500 text-white-100';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyTransactionNumber = () => {
    navigator.clipboard.writeText(transactionDetail.transactionNumber);
    // You could add a toast notification here
  };

  const handleDownloadReceipt = () => {
    // Implement download functionality
    console.log('Downloading receipt...');
  };

  const handleShareReceipt = () => {
    // Implement share functionality
    console.log('Sharing receipt...');
  };

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const handleGoBack = () => {
    // This would typically use React Router to navigate back
    window.history.back();
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button and Page Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {/* Header Section with Email and Status */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">K</span>
                </div>
                <span className="font-medium text-gray-900">{transactionDetail.email}</span>
              </div>
              <span className={`px-3 py-1 rounded-20 text-xs font-medium text-white ${getStatusStyles(transactionDetail.status)}`}>
                {transactionDetail.status}
              </span>
            </div>

            {/* Date */}
            <div className="mb-8">
              <span className="text-sm text-gray-600">Date: {transactionDetail.date}</span>
            </div>

            {/* Payment Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Sender's Name</span>
                  <span className="font-medium text-gray-900">{transactionDetail.senderName}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900">{transactionDetail.method}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Card Type</span>
                  <span className="font-medium text-gray-900">{transactionDetail.cardType}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Payee First Amount</span>
                  <span className="font-medium text-gray-900">{transactionDetail.payeeFirstAmount}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Commission(2%)</span>
                  <span className="font-medium text-gray-900">{transactionDetail.commission}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">VAT(5%)</span>
                  <span className="font-medium text-gray-900">{transactionDetail.vat}</span>
                </div>

                <div className="flex justify-between py-3 border-t border-gray-200 pt-3">
                  <span className="text-gray-600 font-medium">Total Amount Paid</span>
                  <span className="font-semibold text-gray-900 text-lg">{transactionDetail.totalAmountPaid}</span>
                </div>
              </div>
            </div>

            {/* Transaction Number with Copy */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transaction number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{transactionDetail.transactionNumber}</span>
                  <button
                    onClick={handleCopyTransactionNumber}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                    title="Copy transaction number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Report Issue Button */}
            <div className="mb-6">
              <button
                onClick={handleReportIssue}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
              
                <img src={report} alt="Report" className="w-5 h-5" />
                <span>Report an Issue</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
              <button
                onClick={handleShareReceipt}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report an Issue</h3>
            <p className="text-gray-600 mb-6">
              If you're experiencing any problems with this transaction, please contact our support team.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  // Navigate to support or open support form
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetailsPendingPage;