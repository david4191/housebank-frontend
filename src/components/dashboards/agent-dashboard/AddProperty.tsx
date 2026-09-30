import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle } from 'lucide-react';
import {
  useGetPropertyTypesQuery,
  useCreatePropertyMutation,
  useUploadPropertyImagesMutation,
} from '../../../redux/housebank.ts';

interface ImageSlot {
  file: File | null;
  preview: string | null;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

const AgentAddListPropertyPage = () => {
  const navigate = useNavigate();
  const { data: propertyTypes, isLoading: typesLoading } = useGetPropertyTypesQuery();
  const [createProperty, { isLoading: creating }] = useCreatePropertyMutation();
  const [uploadImages, { isLoading: uploadingImages }] = useUploadPropertyImagesMutation();

  const [title, setTitle] = useState('');
  const [propertyTypeId, setPropertyTypeId] = useState('');
  const [listingType, setListingType] = useState<'sale' | 'rent' | 'investment' | ''>('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sizeSqm, setSizeSqm] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');

  const [mainImage, setMainImage] = useState<ImageSlot>({ file: null, preview: null });
  const [additionalImages, setAdditionalImages] = useState<ImageSlot[]>([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const additionalImageRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const onMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainImage({ file, preview: URL.createObjectURL(file) });
  };

  const onAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdditionalImages((prev) => {
      const updated = [...prev];
      updated[index] = { file, preview: URL.createObjectURL(file) };
      return updated;
    });
  };

  const removeMainImage = () => setMainImage({ file: null, preview: null });
  const removeAdditionalImage = (index: number) =>
    setAdditionalImages((prev) => {
      const updated = [...prev];
      updated[index] = { file: null, preview: null };
      return updated;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = await createProperty({
      property_type_id: propertyTypeId,
      listing_type: listingType,
      title,
      price,
      address,
      city,
      state,
      description: description || undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      size_sqm: sizeSqm || undefined,
    });

    if ('error' in result) {
      const err: any = result.error;
      if (err?.errors) {
        setErrors(err.errors);
      } else {
        setSubmitError(err?.message || 'Could not create this listing. Please try again.');
      }
      return;
    }

    const newId = result.data?.id;
    const filesToUpload = [mainImage, ...additionalImages]
      .map((slot) => slot.file)
      .filter((f): f is File => !!f);

    if (newId && filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('images', f));
      const imgResult = await uploadImages({ id: newId, formData });
      if ('error' in imgResult) {
        // The listing itself was created successfully — image upload
        // failing shouldn't strand the agent on a form that looks like
        // nothing happened. Send them to the real listing either way,
        // and they can add photos from there.
        navigate('/agent/properties', {
          state: { notice: 'Listing created, but the photos failed to upload — you can add them from My Listings.' },
        });
        return;
      }
    }

    navigate('/agent/properties', { state: { notice: 'Listing submitted for approval.' } });
  };

  const fieldError = (field: string) => errors[field]?.[0];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">List Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {submitError && (
            <div className="mb-6 flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 relative">
              <input type="file" accept="image/*" ref={mainImageInputRef} onChange={onMainImageChange} className="hidden" />
              <div
                onClick={() => mainImageInputRef.current?.click()}
                className="w-full h-56 sm:h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors bg-gray-50 overflow-hidden relative"
              >
                {mainImage.preview ? (
                  <>
                    <img src={mainImage.preview} alt="Main property" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeMainImage(); }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload main image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {additionalImages.map((img, index) => (
                <div key={index} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={additionalImageRefs[index]}
                    onChange={(e) => onAdditionalImageChange(e, index)}
                    className="hidden"
                  />
                  <div
                    onClick={() => additionalImageRefs[index].current?.click()}
                    className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors bg-gray-50 overflow-hidden relative"
                  >
                    {img.preview ? (
                      <>
                        <img src={img.preview} alt={`Additional ${index}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeAdditionalImage(index); }}
                          className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:bg-gray-100"
                        >
                          <X className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-500 text-xs">Upload image</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              New listings go live only after review — this submits for approval, it doesn't publish instantly. (If your account is attached to a company, they review it first before it reaches HouseBank admin.)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Oakwood Luxury Apartment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {fieldError('title') && <p className="text-xs text-red-600 mt-1">{fieldError('title')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={propertyTypeId}
                  onChange={(e) => setPropertyTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">{typesLoading ? 'Loading…' : 'Select type'}</option>
                  {(propertyTypes || []).map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {fieldError('property_type_id') && <p className="text-xs text-red-600 mt-1">{fieldError('property_type_id')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select listing type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="investment">Investment</option>
                </select>
                {fieldError('listing_type') && <p className="text-xs text-red-600 mt-1">{fieldError('listing_type')}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                <input
                  type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="6000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {fieldError('price') && <p className="text-xs text-red-600 mt-1">{fieldError('price')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size (sqm)</label>
                <input
                  type="number" min="0" value={sizeSqm} onChange={(e) => setSizeSqm(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="5th Avenue, Gwarinpa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {fieldError('address') && <p className="text-xs text-red-600 mt-1">{fieldError('address')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Abuja"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {fieldError('city') && <p className="text-xs text-red-600 mt-1">{fieldError('city')}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={state} onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldError('state') && <p className="text-xs text-red-600 mt-1">{fieldError('state')}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Description</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={creating || uploadingImages}
              className="w-full sm:w-auto px-6 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 bg-green-700 hover:bg-green-800"
            >
              {creating || uploadingImages ? 'Submitting…' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentAddListPropertyPage;
