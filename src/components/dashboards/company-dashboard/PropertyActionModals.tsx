// src/components/dashboards/company-dashboard/PropertyActionModals.tsx
import { useState } from 'react';
import { Star, MapPin, BedDouble, Bath, Car, CheckCircle, Share2, X } from 'lucide-react';

// ── Shared property preview card (compact, inside modal) ─────────────────────
const ModalPropertyCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4">
    <div className="flex gap-2 h-44">
      <div className="flex-[1.6] rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80" alt="hero" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-1.5 flex-[0.9]">
        {[
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&q=60',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=60',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=60',
        ].map((src, i) => (
          <div key={i} className="flex-1 rounded-lg overflow-hidden">
            <img src={src} alt={`g${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Rendez House Bay</h3>
        <span className="flex items-center gap-1 text-xs font-semibold text-gray-600"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />4.6</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-400 text-xs"><MapPin className="w-3 h-3" />Lagos, Nigeria</div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />3</span>
          <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />3</span>
          <span className="flex items-center gap-0.5"><Car className="w-3 h-3" />3</span>
        </div>
      </div>
      <p className="text-base font-bold text-green-600">₦250,000</p>
      <div className="flex gap-6 pt-1">
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">Property Realtor</p>
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Realtor" className="w-8 h-8 rounded-full object-cover" />
          <p className="text-xs text-gray-500 mt-1">Ibrahim Haruna</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">Facilities</p>
          <div className="flex flex-wrap gap-1.5">
            {['Big swimmig pool', 'Big size garden', '24/7  electricity', 'Near Trail Station', '4 car Parking', 'Personal Theater'].map((f, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full border border-gray-200 text-xs text-gray-500">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Success card (shared) ─────────────────────────────────────────────────────
const SuccessCard = ({ message, showShare = false, onClose }: {
  message: string;
  showShare?: boolean;
  onClose: () => void;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center">
    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
      <CheckCircle className="w-8 h-8 text-white fill-white" strokeWidth={2} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">Successful</h3>
    <p className="text-sm text-gray-400 mb-5">{message}</p>
    <div className="flex items-center gap-3">
      <button
        onClick={onClose}
        className="px-8 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Back to Home
      </button>
      {showShare && (
        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4" />
          Share Link
        </button>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// APPROVE MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface ApproveModalProps {
  onClose: () => void;
}

export const ApproveModal = ({ onClose }: ApproveModalProps) => {
  const [approved, setApproved] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="relative bg-transparent w-full max-w-5xl flex gap-6 items-start">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Left: property card */}
        <div className="flex-1">
          <ModalPropertyCard />
        </div>

        {/* Right: action / success */}
        <div className="w-80 flex-shrink-0">
          {!approved ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 text-center">Are you sure you want to approve this property?</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setApproved(true)}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <SuccessCard
              message="Your property has been successfully Approved"
              showShare={false}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REJECT MODAL
// ─────────────────────────────────────────────────────────────────────────────
const REJECT_REASONS = [
  'Incomplete/Inaccurate Information',
  'Suspicious or Fraudulent Content',
  'Expired or Sold Properties',
  'Low-Quality or Inappropriate Images',
  'Violation of Platform Policies',
  'Unverified Realtor or Company',
  'Duplicate Listings',
  'Wrong Category or Listing Type',
  'Illegal or Unauthorized Property',
  'Others',
];

interface RejectModalProps {
  onClose: () => void;
}

export const RejectModal = ({ onClose }: RejectModalProps) => {
  const [rejected, setRejected] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const toggle = (reason: string) =>
    setSelected(prev => prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]);

  // Split into 3 columns
  const col1 = REJECT_REASONS.filter((_, i) => i % 3 === 0);
  const col2 = REJECT_REASONS.filter((_, i) => i % 3 === 1);
  const col3 = REJECT_REASONS.filter((_, i) => i % 3 === 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="relative bg-transparent w-full max-w-5xl flex gap-6 items-start">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Left: property + reject form */}
        <div className="flex-1 space-y-4">
          <ModalPropertyCard />

          {/* Reject form */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Reject Property</h3>
              <p className="text-xs text-gray-400 mt-0.5">Kindly note that this property has been reject for :</p>
            </div>

            {/* 3-column checkbox grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              {[col1, col2, col3].map((col, ci) => (
                <div key={ci} className="space-y-3">
                  {col.map(reason => (
                    <label key={reason} className="flex items-start gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selected.includes(reason)}
                        onChange={() => toggle(reason)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 leading-tight group-hover:text-gray-800">{reason}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
              <textarea
                placeholder="Value"
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setRejected(true)}
                className="px-10 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Send
              </button>
              <button
                onClick={onClose}
                className="px-10 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right: success after reject */}
        {rejected && (
          <div className="w-80 flex-shrink-0">
            <SuccessCard
              message="Your property has been successfully Approved"
              showShare={true}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
};
