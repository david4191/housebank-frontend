import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import defaultAvatar from '../../../assets/1.png';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  occupation: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'Ibarahim',
    lastName: 'Umar',
    middleName: 'Isa',
    occupation: 'Business man',
    email: 'umar@gmail.com',
    phone: '+2349034223344',
    address: '3rd Avenue Gwarinpa',
    city: 'Abuja'
  });

  const [profileImage, setProfileImage] = useState<string>(defaultAvatar);
  const [documentUploaded] = useState<boolean>(true);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile data:', formData);
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log('Canceling changes');
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Setting</h1>

          {/* Profile Image Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700">
                  <Camera className="w-3 h-3 text-white" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Esther Emmanuel</h2>
              </div>
            </div>
            
            <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded shadow-md cursor-pointer">
  Kyc verified
</span>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Verification Section */}
<div className="mt-8">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Verification
  </label>
  <div className="relative">
    <input
      type="text"
      value={documentUploaded ? "Document Uploaded ✓" : "No document uploaded"}
      readOnly
      className={`w-full px-3 py-2 border rounded-lg pr-12 ${
        documentUploaded 
          ? "bg-green-50 border-green-400 text-green-700" 
          : "bg-gray-50 border-gray-300 text-gray-600"
      }`}
    />
    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
      <Upload className={`w-4 h-4 ${documentUploaded ? "text-green-600" : "text-gray-600"}`} />
    </button>
  </div>
</div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;