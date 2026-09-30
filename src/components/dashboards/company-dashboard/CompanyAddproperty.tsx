// src/components/dashboards/company-dashboard/CompanyAddproperty.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, ChevronLeft, CheckCircle, XCircle, Users } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetPropertyTypesQuery,
  useCreatePropertyMutation,
  useUploadPropertyImagesMutation,
  useGetMyCompanyAgentsQuery,
  useReassignPropertyAgentMutation,
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

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function initialsFor(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Step = 'form' | 'assign' | 'success' | 'error';

/**
 * The old version of this page was a slick 3-step wizard that submitted
 * nothing real: Step 1 collected fields that don't exist anywhere in
 * this schema ("Facilities" x4, "Current Status", "Parking space") and
 * never called an API; Step 2's "Assign to Realtor" picked from a
 * hardcoded 5-entry AGENTS array (all named "Abubakar Isa"); Step 3's
 * success card showed a fabricated listing ("Rendez House Bay", a 4.6
 * star rating, three stock photos) no matter what was actually typed.
 *
 * This is the real flow: Step 1 is the same property-creation form
 * agents use (see agent-dashboard/AddProperty.tsx — same fields, same
 * useCreatePropertyMutation/useUploadPropertyImagesMutation calls),
 * Step 2 offers this company's actual roster (useGetMyCompanyAgentsQuery)
 * to hand the new listing to via the reassign-agent endpoint, or lets
 * it stay with the company account when the roster is empty or no one
 * is picked, and Step 3 confirms with the property that was actually
 * created — no fabricated preview.
 */
const CompanyAddPropertyCreate = () => {
  const navigate = useNavigate();
  const { data: propertyTypes, isLoading: typesLoading } = useGetPropertyTypesQuery();
  const [createProperty, { isLoading: creating }] = useCreatePropertyMutation();
  const [uploadImages, { isLoading: uploadingImages }] = useUploadPropertyImagesMutation();
  const { data: roster, isLoading: rosterLoading } = useGetMyCompanyAgentsQuery();
  const [reassignAgent, { isLoading: assigning }] = useReassignPropertyAgentMutation();

  const [step, setStep] = useState<Step>('form');
  const [createdId, setCreatedId] = useState<number | string | null>(null);

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
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

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

  const fieldError = (field: string) => errors[field]?.[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result: any = await createProperty({
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

    if (result?.error) {
      const err = result.error;
      if (err?.errors) setErrors(err.errors);
      else setSubmitError(err?.message || 'Could not create this listing. Please try again.');
      return;
    }

    const newId = result.data?.id;
    const filesToUpload = [mainImage, ...additionalImages]
      .map((slot) => slot.file)
      .filter((f): f is File => !!f);

    if (newId && filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('images', f));
      await uploadImages({ id: newId, formData });
      // Image upload failing doesn't strand the flow — the listing
      // itself exists either way, so continue to the assign step.
    }

    setCreatedId(newId);
    setStep('assign');
  };

  const handleAssign = async () => {
    setAssignError(null);
    if (createdId == null) {
      setStep('success');
      return;
    }
    if (selectedAgentId == null) {
      // Left with the company account — already the default from
      // creation, so there's nothing to send.
      setStep('success');
      return;
    }
    const result: any = await reassignAgent({ id: createdId, agent_user_id: selectedAgentId });
    if (result?.error) {
      setAssignError(result.error?.message || 'Could not assign this property to that realtor.');
      return;
    }
    setStep('success');
  };

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      {step === 'form' && (
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => navigate('/company/property')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">List Property</h1>
            </div>

            <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {submitError && (
                <div className="mb-6 flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

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

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Details</h2>
                <p className="text-sm text-gray-500 mb-6">
                  New listings go live only after admin review — this submits for approval, it doesn't publish instantly.
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
                  {creating || uploadingImages ? 'Submitting…' : 'Next: Assign a Realtor'}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {step === 'assign' && (
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assign Property to a Realtor</h2>
              <p className="text-sm text-gray-400 mt-1">
                Optional — hand this listing to someone on your roster, or leave it with your company account.
              </p>
            </div>

            {assignError && (
              <div className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{assignError}</p>
              </div>
            )}

            {rosterLoading ? (
              <p className="text-sm text-gray-500">Loading your roster…</p>
            ) : (roster || []).length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  No realtors on your roster yet — this listing will stay under your company account.
                  You can reassign it anytime from Manage Realtor.
                </p>
              </div>
            ) : (
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setSelectedAgentId(null)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-36 transition-all ${
                    selectedAgentId === null ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">
                    Company
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">Keep with company</span>
                </button>
                {(roster || []).map((agent: any) => {
                  const avatar = imageUrl(agent.avatar_path);
                  return (
                    <button
                      key={agent.user_id}
                      onClick={() => setSelectedAgentId(agent.user_id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-36 transition-all ${
                        selectedAgentId === agent.user_id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {avatar ? (
                        <img src={avatar} alt={agent.full_name} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold">
                          {initialsFor(agent.full_name)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-700 text-center truncate w-full">{agent.full_name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="px-16 py-3 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {assigning ? 'Saving…' : 'Confirm'}
              </button>
              <button
                onClick={() => navigate('/company/property')}
                className="px-16 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </main>
      )}

      {step === 'success' && (
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <CheckCircle className="w-9 h-9 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Submitted</h3>
            <p className="text-sm text-gray-400 mb-1">
              &ldquo;{title || 'Your property'}&rdquo; has been sent for admin review.
            </p>
            <p className="text-xs text-gray-400 mb-5">
              It won't appear publicly until it's approved — you'll see it under Property Management with a Pending status.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/company/property')}
                className="px-8 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View My Properties
              </button>
              <button
                onClick={() => navigate('/company/overview')}
                className="px-8 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Overview
              </button>
            </div>
          </div>
        </main>
      )}

      {step === 'error' && (
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <XCircle className="w-9 h-9 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Something went wrong</h3>
            <p className="text-sm text-gray-400 mb-5">{submitError || 'Please try again or contact support if the issue persists.'}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('form')}
                className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default CompanyAddPropertyCreate;
