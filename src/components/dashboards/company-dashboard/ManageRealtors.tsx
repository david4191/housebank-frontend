// src/components/dashboards/company-dashboard/CompanyManageRealtor.tsx
import { useState, useRef, useEffect } from 'react';
import {
  Search, SlidersHorizontal, Plus, MoreVertical,
  MessageCircle, Phone, X, CheckCircle, ArrowUpDown, MapPin, BedDouble, Bath, Car, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type TabType = 'All Realtor' | 'Active Realtor' | 'Inactive Realtor' | 'Access Request';
type ModalType = 'none' | 'viewDetails' | 'assignProperty' | 'deleteConfirm' | 'deleteSuccess' | 'accessRequest' | 'transferRealtor';

interface Realtor {
  id: number;
  name: string;
  avatar: string;
  address: string;
  email: string;
  contact: string;
  noOfProperties: number;
  date: string;
  status: 'Active' | 'Inactive';
  experience?: string;
  agency?: string;
  licenseNumber?: string;
  specialization?: string;
  bio?: string;
}

interface AccessRequest {
  id: number;
  name: string;
  avatar: string;
  address: string;
  email: string;
  contact: string;
  experience: string;
  date: string;
  status: 'Pending';
  bio: string;
  yearOfExp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────
const REALTORS: Realtor[] = [
  { id: 1, name: 'Ibrahim Haruna', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 2, date: '21/01/2025', status: 'Active', agency: 'Adron Homes and Properties', licenseNumber: 'AD0011243', specialization: 'Residential, Commercial, Luxury, etc.', experience: '3 years of experience', bio: 'I have been working in real estate informally for 3 years and would love to formalize it through this platform.' },
  { id: 2, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 0, date: '21/01/2025', status: 'Inactive', agency: 'Adron Homes and Properties', licenseNumber: 'AD0011244', specialization: 'Residential', experience: '2 years of experience', bio: 'Experienced in residential sales.' },
  { id: 3, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/52.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 1, date: '21/01/2025', status: 'Active', agency: 'Adron Homes', licenseNumber: 'AD0011245', specialization: 'Commercial', experience: '5 years of experience', bio: 'Specializes in commercial properties.' },
  { id: 4, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/60.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 0, date: '21/01/2025', status: 'Inactive', agency: 'Top Homes', licenseNumber: 'AD0011246', specialization: 'Luxury', experience: '1 year of experience', bio: 'New to the platform.' },
  { id: 5, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 2, date: '21/01/2025', status: 'Active', agency: 'Adron Homes', licenseNumber: 'AD0011247', specialization: 'Residential', experience: '4 years of experience', bio: 'Active realtor managing multiple properties.' },
  { id: 6, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/71.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 2, date: '21/01/2025', status: 'Active', agency: 'Prime Realty', licenseNumber: 'AD0011248', specialization: 'Commercial', experience: '6 years of experience', bio: 'Senior realtor with many deals closed.' },
  { id: 7, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/83.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 3, date: '21/01/2025', status: 'Active', agency: 'Adron Homes', licenseNumber: 'AD0011249', specialization: 'Residential, Luxury', experience: '7 years of experience', bio: 'Top performer in luxury segment.' },
  { id: 8, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', noOfProperties: 4, date: '21/01/2025', status: 'Active', agency: 'Adron Homes', licenseNumber: 'AD0011250', specialization: 'All types', experience: '8 years of experience', bio: 'Expert in all property categories.' },
];

const ACCESS_REQUESTS: AccessRequest[] = [
  { id: 1, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', experience: '3  Years', date: '21/01/2025', status: 'Pending', bio: 'I have been working in real estate informally for 3 years and would love to formalize it through this platform.', yearOfExp: '3 Years' },
  { id: 2, name: 'Abubakar Isa', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', address: 'Gwarinpa Abuja', email: 'isa@gmail.com', contact: '+2349077445566', experience: 'Beginner', date: '21/01/2025', status: 'Pending', bio: 'I am new to real estate and eager to learn.', yearOfExp: '0 Years' },
];

const PROPERTY_CARDS = [
  { name: 'Rendez House Bay', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70' },
  { name: 'Banana Land', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=70' },
  { name: 'Rendez House Bay', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70' },
  { name: 'Rendez House Bay', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=70' },
  { name: 'Rendez House Bay', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=70' },
  { name: 'Rendez House Bay', price: 'N250,000', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&q=70' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small shared components
// ─────────────────────────────────────────────────────────────────────────────
const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={onClose}>
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

const InfoRow = ({ label, value, valueClass = '' }: { label: string; value: React.ReactNode; valueClass?: string }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`text-sm text-right max-w-xs ${valueClass || 'text-gray-700'}`}>{value}</span>
  </div>
);

// property images for view details
const DETAIL_PROP_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=300&q=70',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&q=70',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=70',
];

// ─────────────────────────────────────────────────────────────────────────────
// VIEW DETAILS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ViewDetailsModal = ({ realtor, onClose, onAssign }: { realtor: Realtor; onClose: () => void; onAssign: () => void }) => (
  <Overlay onClose={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-[860px] max-h-[90vh] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Realtor Details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Left: Profile */}
          <div className="w-44 flex-shrink-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">Profile</p>
            <img src={realtor.avatar} alt={realtor.name} className="w-20 h-20 rounded-full object-cover mb-2" />
            <p className="text-sm font-bold text-gray-900">{realtor.name}</p>
            <p className="text-xs text-green-600 mt-0.5 mb-3">Properties : {realtor.noOfProperties}</p>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right: Properties panel */}
          <div className="flex-1 border border-gray-100 rounded-xl p-4 min-h-[200px]">
            <p className="text-sm font-semibold text-gray-700 mb-3">Properties</p>
            {realtor.noOfProperties === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-gray-400">No Property assigned</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: Math.min(realtor.noOfProperties, 4) }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="relative h-28">
                      <img src={DETAIL_PROP_IMAGES[i % DETAIL_PROP_IMAGES.length]} alt="" className="w-full h-full object-cover" />
                      <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 truncate">Rendez House Bay</span>
                        <span className="text-xs font-bold text-gray-700 ml-1 flex-shrink-0">N250,000</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="text-xs">Lagos, Nigeria</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-tight">A beautiful house that resonates the beauty of lagos, affordable and friendly environment</p>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <span className="flex items-center gap-0.5"><BedDouble className="w-2.5 h-2.5" />3</span>
                        <span className="flex items-center gap-0.5"><Bath className="w-2.5 h-2.5" />3</span>
                        <span className="flex items-center gap-0.5"><Car className="w-2.5 h-2.5" />3</span>
                        <span className="flex items-center gap-0.5">🏠 3</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-0">
            <InfoRow label="Phone Number" value={realtor.contact} />
            <InfoRow label="Email" value={realtor.email} />
            <InfoRow label="Agency:" value={realtor.agency || '—'} />
            <InfoRow label="License Number:" value={realtor.licenseNumber || '—'} />
            <InfoRow label="Year of Experience:" value={realtor.experience || '—'} />
            <InfoRow label="Specialization:" value={realtor.specialization || '—'} />
            <InfoRow label="Location:" value={realtor.address} />
            <InfoRow
              label="Status:"
              value={
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                  realtor.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-orange-50 text-orange-500 border border-orange-200'
                }`}>
                  {realtor.status === 'Active' ? 'Active' : 'In Active'}
                </span>
              }
            />
          </div>
        </div>

        {/* Agent Bio */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">Realtor Bio</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{realtor.bio}</p>
        </div>

        {/* Assign Property CTA for active */}
        {realtor.status === 'Active' && (
          <div className="flex justify-end">
            <button onClick={onAssign} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
              Assign Property
            </button>
          </div>
        )}
      </div>
    </div>
  </Overlay>
);

// ─────────────────────────────────────────────────────────────────────────────
// ASSIGN PROPERTY MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AssignPropertyModal = ({ realtor, onClose }: { realtor: Realtor; onClose: () => void }) => {
  const [selectedProp, setSelectedProp] = useState<number | null>(null);
  const [form, setForm] = useState({
    fullName: realtor.name, email: realtor.email,
    phone: realtor.contact, licenseId: realtor.licenseNumber || '', noOfProperty: String(realtor.noOfProperties),
  });
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assign Property to Realtor</h2>
            <p className="text-sm text-gray-400 mt-0.5">Active realtors will be selected</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        {/* Property cards horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PROPERTY_CARDS.map((prop, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedProp(idx)}
              className={`flex-shrink-0 w-40 rounded-xl border-2 overflow-hidden text-left transition-all ${
                selectedProp === idx ? 'border-green-500' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <img src={prop.image} alt={prop.name} className="w-full h-28 object-cover" />
              <div className="p-2 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900 truncate">{prop.name}</p>
                  <p className="text-xs font-bold text-gray-700 ml-1 flex-shrink-0">{prop.price}</p>
                </div>
                <div className="flex items-center gap-0.5 text-gray-400">
                  <MapPin className="w-2.5 h-2.5" />
                  <p className="text-xs">{prop.location}</p>
                </div>
                <p className="text-xs text-gray-400 leading-tight line-clamp-2">A beautiful house that resonates the beauty of lagos, affordable and friendly environment</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs pt-0.5">
                  <span className="flex items-center gap-0.5"><BedDouble className="w-2.5 h-2.5" />3</span>
                  <span className="flex items-center gap-0.5"><Bath className="w-2.5 h-2.5" />3</span>
                  <span className="flex items-center gap-0.5"><Car className="w-2.5 h-2.5" />3</span>
                  <span className="flex items-center gap-0.5"><span className="w-2.5 h-2.5 text-center">🏠</span>3</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-5">
            {[['Full Name', 'fullName'], ['Email', 'email']] .map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input type="text" value={form[key as keyof typeof form]} onChange={e => set(key as keyof typeof form)(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[['Phone Number', 'phone'], ['License  ID', 'licenseId'], ['No of Property', 'noOfProperty']].map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input type="text" value={form[key as keyof typeof form]} onChange={e => set(key as keyof typeof form)(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button onClick={onClose} className="px-12 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors">Assign Property</button>
          <button onClick={onClose} className="px-12 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </Overlay>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ realtor, onClose, onDeleted }: { realtor: Realtor; onClose: () => void; onDeleted: () => void }) => (
  <Overlay onClose={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-[480px] p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900 text-center">Delete Realtor Summary</h2>
      <div className="flex justify-center">
        <img src={realtor.avatar} alt={realtor.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100" />
      </div>
      <div className="space-y-0">
        <InfoRow label="Name" value={realtor.name} />
        <InfoRow label="Email" value={realtor.email} />
        <InfoRow label="Phone Number" value={realtor.contact} />
        <InfoRow label="Agency:" value={realtor.agency || 'Adron Homes and Properties'} />
        <InfoRow label="Address" value={realtor.address} />
        <InfoRow label="Reason" value="i want all my properties to be managed by 1 realtor" />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onDeleted} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">Delete</button>
        <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  </Overlay>
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE SUCCESS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DeleteSuccessModal = ({ realtor, onClose }: { realtor: Realtor; onClose: () => void }) => (
  <Overlay onClose={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-[480px] p-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
        <CheckCircle className="w-9 h-9 text-white fill-white" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Realtor successful</h3>
      <p className="text-sm text-gray-400">Realtor {realtor.name} has been deleted</p>
      <button onClick={onClose} className="mt-6 px-8 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors">Done</button>
    </div>
  </Overlay>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS REQUEST DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AccessRequestModal = ({ request, onClose }: { request: AccessRequest; onClose: () => void }) => {
  const [done, setDone] = useState<'none' | 'approved' | 'rejected'>('none');

  if (done !== 'none') {
    return (
      <Overlay onClose={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-[440px] p-10 flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${done === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
            <CheckCircle className="w-8 h-8 text-white fill-white" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{done === 'approved' ? 'Approved!' : 'Rejected'}</h3>
          <p className="text-sm text-gray-400 mb-5">Request has been {done === 'approved' ? 'approved' : 'rejected'} successfully.</p>
          <button onClick={onClose} className="px-8 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg">Done</button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Request Access Details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="flex justify-center">
          <img src={request.avatar} alt={request.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100" />
        </div>
        <div className="space-y-0">
          <InfoRow label="Name" value={request.name} />
          <InfoRow label="Email" value={request.email} />
          <InfoRow label="Phone Number" value={request.contact} />
          <InfoRow label="Address" value={request.address} />
          <InfoRow label="Year of Experience" value={request.yearOfExp} />
          <InfoRow label="Bio / Motivation" value={request.bio} />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={() => setDone('approved')} className="flex-1 py-3 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors">Approve</button>
          <button onClick={() => setDone('rejected')} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">Reuject</button>
        </div>
      </div>
    </Overlay>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFER REALTOR MODAL
// ─────────────────────────────────────────────────────────────────────────────
const TransferRealtorModal = ({ realtor, onClose }: { realtor: Realtor; onClose: () => void }) => {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Transfer Realtor Properties</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <p className="text-sm text-gray-400">Select the realtor to transfer {realtor.name}'s properties to:</p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {REALTORS.filter(r => r.id !== realtor.id && r.status === 'Active').map((agent, idx) => (
            <button key={idx} onClick={() => setSelectedAgent(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${selectedAgent === idx ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                <p className="text-xs text-gray-400">{agent.noOfProperties} properties</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors">Confirm Transfer</button>
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </Overlay>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CompanyManageRealtors = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('All Realtor');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenu, setActionMenu] = useState<{ idx: number; x: number; y: number } | null>(null);
  const [modal, setModal] = useState<ModalType>('none');
  const [selectedRealtor, setSelectedRealtor] = useState<Realtor | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const totalPages = 3;
  const tabs: TabType[] = ['All Realtor', 'Active Realtor', 'Inactive Realtor', 'Access Request'];

  // Filter realtors by tab
  const filteredRealtors = REALTORS.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'All Realtor') return matchSearch;
    if (activeTab === 'Active Realtor') return matchSearch && r.status === 'Active';
    if (activeTab === 'Inactive Realtor') return matchSearch && r.status === 'Inactive';
    return true;
  });

  const filteredRequests = ACCESS_REQUESTS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActionMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openMenu = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActionMenu({ idx, x: rect.right, y: rect.bottom });
  };

  const tabCounts = {
    'All Realtor': REALTORS.length,
    'Active Realtor': REALTORS.filter(r => r.status === 'Active').length,
    'Inactive Realtor': REALTORS.filter(r => r.status === 'Inactive').length,
    'Access Request': ACCESS_REQUESTS.length,
  };

  const tabLabel = (t: TabType) => {
    if (t === 'All Realtor') return 'All Realtor';
    if (t === 'Active Realtor') return `Active Realtor (${tabCounts['Active Realtor']})`;
    if (t === 'Inactive Realtor') return `Inactive Realtor(${tabCounts['Inactive Realtor']})`;
    return `Access Request (${tabCounts['Access Request']})`;
  };

  const isAccessTab = activeTab === 'Access Request';
  const isEmpty = isAccessTab ? filteredRequests.length === 0 : filteredRealtors.length === 0;

  return (
    <>
      <div className="flex flex-col h-full">
        <CustomerHeader />

        <main className="flex-1 p-6 bg-gray-50 overflow-auto space-y-5">

          {/* ── Page title row ── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Realtors</h1>
              <p className="text-xs text-gray-400 mt-0.5">Total No of Realtors &nbsp;›&nbsp; <span className="font-medium text-gray-600">205</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search here..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
              </div>
              <button className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                Request ({ACCESS_REQUESTS.length})
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4" />Add Realtor
              </button>
            </div>
          </div>

          {/* ── Tabs + Table ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center border-b border-gray-100">
              <div className="flex flex-1">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tabLabel(tab)}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-t" />}
                  </button>
                ))}
              </div>
              {/* Realtor Ranking button — only on All Realtor tab */}
              {activeTab === 'All Realtor' && (
                <div className="px-4">
                  <button
                    onClick={() => navigate('/company/realtor-ranking')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Realtor Ranking
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-medium">
                  {isAccessTab ? (
                    <>
                      <th className="px-6 py-3 text-left">Full Name</th>
                      <th className="px-6 py-3 text-left">Address</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">Experience</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left">Realtor</th>
                      <th className="px-6 py-3 text-left">Address</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">No of Properties</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isEmpty ? (
                  <tr><td colSpan={8} className="px-6 py-32 text-center text-gray-400 text-sm">No Pending Approval</td></tr>
                ) : isAccessTab ? (
                  filteredRequests.map((req, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <span className="font-medium text-gray-800">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{req.address}</td>
                      <td className="px-6 py-4 text-gray-600">{req.email}</td>
                      <td className="px-6 py-4 text-gray-600">{req.contact}</td>
                      <td className="px-6 py-4 text-gray-600">{req.experience}</td>
                      <td className="px-6 py-4 text-gray-500">{req.date}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-orange-500">Pendind</span>
                      </td>
                      <td className="px-6 py-4 relative">
                        <button onClick={e => { setSelectedRequest(req); openMenu(e, idx); }} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredRealtors.map((realtor, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={realtor.avatar} alt={realtor.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <span className="font-medium text-gray-800">{realtor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{realtor.address}</td>
                      <td className="px-6 py-4 text-gray-600">{realtor.email}</td>
                      <td className="px-6 py-4 text-gray-600">{realtor.contact}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium text-center">{realtor.noOfProperties}</td>
                      <td className="px-6 py-4 text-gray-500">{realtor.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${realtor.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>
                          {realtor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 relative">
                        <button onClick={e => { setSelectedRealtor(realtor); openMenu(e, idx); }} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!isEmpty && (
              <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-gray-100">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm">›</button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Floating dropdown menu ── */}
      {actionMenu && (
        <div ref={menuRef} className="fixed z-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-44"
          style={{ top: actionMenu.y + 4, left: actionMenu.x - 176 }}>
          {isAccessTab ? (
            <>
              <button onClick={() => { setActionMenu(null); setModal('accessRequest'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">View Details</button>
              <button onClick={() => { setActionMenu(null); setModal('deleteConfirm'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50">Delete</button>
            </>
          ) : selectedRealtor?.status === 'Active' ? (
            <>
              <button onClick={() => { setActionMenu(null); setModal('viewDetails'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">View Details</button>
              <button onClick={() => { setActionMenu(null); setModal('deleteConfirm'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-50">Delete</button>
              <button onClick={() => { setActionMenu(null); setModal('assignProperty'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-50">Assign Property</button>
            </>
          ) : (
            <>
              <button onClick={() => { setActionMenu(null); setModal('viewDetails'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">View Details</button>
              <button onClick={() => { setActionMenu(null); navigate('/company/transfer-agent'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-50">Transfer Realtor</button>
              <button onClick={() => { setActionMenu(null); setModal('deleteConfirm'); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-50">Delete Realtor</button>
            </>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {modal === 'viewDetails' && selectedRealtor && (
        <ViewDetailsModal realtor={selectedRealtor} onClose={() => setModal('none')} onAssign={() => setModal('assignProperty')} />
      )}
      {modal === 'assignProperty' && selectedRealtor && (
        <AssignPropertyModal realtor={selectedRealtor} onClose={() => setModal('none')} />
      )}
      {modal === 'deleteConfirm' && selectedRealtor && (
        <DeleteConfirmModal realtor={selectedRealtor} onClose={() => setModal('none')} onDeleted={() => setModal('deleteSuccess')} />
      )}
      {modal === 'deleteSuccess' && selectedRealtor && (
        <DeleteSuccessModal realtor={selectedRealtor} onClose={() => setModal('none')} />
      )}
      {modal === 'accessRequest' && selectedRequest && (
        <AccessRequestModal request={selectedRequest} onClose={() => setModal('none')} />
      )}
      {modal === 'transferRealtor' && selectedRealtor && (
        <TransferRealtorModal realtor={selectedRealtor} onClose={() => setModal('none')} />
      )}
    </>
  );
};

export default CompanyManageRealtors;
