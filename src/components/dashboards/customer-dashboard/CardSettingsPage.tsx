import { useState } from 'react';
import { Edit, Plus, Eye, EyeOff, Check } from 'lucide-react';
import CustomerHeader from './CustomerHeader';

interface CardData {
  id: string;
  name: string;
  number: string;
  expiryDate: string;
  cvv: string;
}

type ViewState = 'list' | 'edit' | 'add' | 'delete' | 'deleted';

const CardSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'delete' | 'edit'>('edit');
  const [viewState, setViewState] = useState<ViewState>('list');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [cardData, setCardData] = useState<CardData>({
    id: '1',
    name: 'Gbolahan Ibarahim',
    number: '2355643564554',
    expiryDate: '02/26',
    cvv: '333'
  });

  const [newCardData, setNewCardData] = useState<CardData>({
    id: '',
    name: '',
    number: '',
    expiryDate: '',
    cvv: ''
  });

  const handleTabChange = (tab: 'add' | 'delete' | 'edit') => {
    setActiveTab(tab);
    if (tab === 'add') {
      setViewState('add');
    } else if (tab === 'delete') {
      setViewState('delete');
    } else {
      setViewState('list');
    }
  };

  const handleSaveCard = () => {
    if (viewState === 'add') {
      // Add new card logic
      console.log('Adding new card:', newCardData);
      setViewState('list');
    } else {
      // Save existing card logic
      console.log('Saving card:', cardData);
    }
  };

  const handleDeleteCard = () => {
    // Delete card logic
    console.log('Deleting card with reason:', deleteReason);
    setViewState('deleted');
  };

  const handleConfirmCard = () => {
    // Confirm new card logic
    console.log('Confirming new card:', newCardData);
    setViewState('list');
  };

  const renderTabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => handleTabChange('add')}
        className={`px-4 py-2 text-sm font-medium border-b-2 ${
          activeTab === 'add'
            ? 'border-green-500 text-green-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Add card Details
      </button>
      <button
        onClick={() => handleTabChange('delete')}
        className={`px-4 py-2 text-sm font-medium border-b-2 ${
          activeTab === 'delete'
            ? 'border-green-500 text-green-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Delete Card
      </button>
      <button
        onClick={() => handleTabChange('edit')}
        className={`px-4 py-2 text-sm font-medium border-b-2 ${
          activeTab === 'edit'
            ? 'border-green-500 text-green-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Edit Card
      </button>
    </div>
  );

  const renderEditCardView = () => (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Name on Card */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name on Card
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => setCardData({...cardData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
          />
          <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Card Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardData.number}
            onChange={(e) => setCardData({...cardData, number: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
          />
          <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={cardData.expiryDate}
            onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
            placeholder="02/26"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardData.cvv}
            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
            placeholder="333"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSaveCard}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );

  const renderAddCardView = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <button
        onClick={() => setViewState('add')}
        className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 mb-4"
      >
        <Plus className="w-6 h-6" />
      </button>
      <p className="text-sm text-gray-600 mb-6">
        Note that your information is safe with us
      </p>
      {viewState === 'add' && (
        <button
          onClick={() => setViewState('add')}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
        >
          View Card Details
        </button>
      )}
    </div>
  );

  const renderDeleteCardView = () => (
    <div className="space-y-6">
      {/* Card Display */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Master Card</h3>
            <p className="text-sm text-gray-600">
              Note that your information is safe with us
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-red-400 rounded-full opacity-70"></div>
            <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-70"></div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">***3664</div>
      </div>

      {/* Delete Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setViewState('delete')}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Delete Card
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Cancel
        </button>
      </div>
    </div>
  );

  const renderDeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="mb-4">
          <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded">
            Pop up for card Settings
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this card</h3>
        <p className="text-sm text-gray-600 mb-2">
          Your card number is 2345 ******** ** 015
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your card will prevent:
        </p>

        <ol className="text-sm text-gray-600 mb-6 space-y-1">
          <li>1. Card payment</li>
          <li>2. House Payment</li>
          <li>3. Investment payment</li>
          <li>4. Auto subscription</li>
        </ol>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for deleting this card
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Explain the reason for deleting this card"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter password to confirm
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleDeleteCard}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete Card
          </button>
          <button
            onClick={() => setViewState('delete')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeletedView = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Your card has been deleted
        </h3>

        <button
          onClick={() => {
            setViewState('list');
            setActiveTab('add');
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  const renderAddCardForm = () => (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Enter Card Details</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name on Card
          </label>
          <input
            type="text"
            value={newCardData.name}
            onChange={(e) => setNewCardData({...newCardData, name: e.target.value})}
            placeholder="Name on card"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={newCardData.number}
            onChange={(e) => setNewCardData({...newCardData, number: e.target.value})}
            placeholder="**** **** **** ****"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={newCardData.expiryDate}
            onChange={(e) => setNewCardData({...newCardData, expiryDate: e.target.value})}
            placeholder="MM/YY"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={newCardData.cvv}
            onChange={(e) => setNewCardData({...newCardData, cvv: e.target.value})}
            placeholder="***"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600" />
          <span className="ml-2 text-sm text-gray-700">Save card Details?</span>
        </label>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleConfirmCard}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Confirm
        </button>
        <button
          onClick={() => setViewState('list')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Card Settings</h1>

          {/* Tab Navigation */}
          {renderTabNavigation()}

          {/* Content Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {viewState === 'list' && activeTab === 'edit' && renderEditCardView()}
            {viewState === 'list' && activeTab === 'add' && renderAddCardView()}
            {viewState === 'add' && renderAddCardForm()}
            {viewState === 'list' && activeTab === 'delete' && renderDeleteCardView()}
          </div>

          {/* Modals */}
          {viewState === 'delete' && renderDeleteConfirmationModal()}
          {viewState === 'deleted' && renderDeletedView()}
        </div>
      </div>
    </div>
  );
};

export default CardSettingsPage;