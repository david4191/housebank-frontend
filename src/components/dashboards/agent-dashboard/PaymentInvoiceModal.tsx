import { Copy, X as CloseIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export interface AgentTransaction {
  kind: 'purchase' | 'rental';
  id: number | string;
  property_title: string;
  address: string;
  city: string;
  counterpartyName: string;
  amount: number;
  rent_period_months?: number | null;
  status: string;
  created_at: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
}

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: AgentTransaction | null;
  onConfirm?: (transaction: AgentTransaction) => void;
  isConfirming?: boolean;
  onApprove?: (transaction: AgentTransaction, note: string) => void;
  onDecline?: (transaction: AgentTransaction, note: string) => void;
  isApproving?: boolean;
  isDeclining?: boolean;
}

function formatNaira(value: number | string | undefined | null) {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `N${(Number.isFinite(n) ? n : 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_LABEL: Record<string, string> = {
  requested: 'Requested',
  declined: 'Declined',
  pending_payment: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  active: 'Active',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<string, string> = {
  requested: 'bg-purple-100 text-purple-800',
  declined: 'bg-red-100 text-red-800',
  pending_payment: 'bg-orange-100 text-orange-800',
  processing: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  active: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

/** Real transaction detail panel — replaces the old fake invoice modal
 * (which showed a made-up email, card number, VAT/commission split and
 * a non-functional download/share/report flow, none of which is data
 * this platform actually stores). Shows only fields that come from the
 * property_purchases / property_rentals rows themselves, plus a real
 * "confirm" action wired to the existing confirm endpoints when a
 * transaction is still pending. */
const PaymentInvoiceModal = ({
  isOpen,
  onClose,
  transaction,
  onConfirm,
  isConfirming,
  onApprove,
  onDecline,
  isApproving,
  isDeclining,
}: TransactionDetailModalProps) => {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');
  if (!isOpen || !transaction) return null;

  const reference = `${transaction.kind === 'purchase' ? 'PUR' : 'RENT'}-${transaction.id}`;
  const canConfirm = onConfirm && (transaction.status === 'pending_payment' || transaction.status === 'processing');
  const canDecide = (onApprove || onDecline) && transaction.status === 'requested';

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-xs font-medium ${STATUS_STYLE[transaction.status] || 'bg-gray-100 text-gray-800'}`}>
                {STATUS_LABEL[transaction.status] || transaction.status}
              </span>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <CloseIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Property</span>
              <span className="font-medium text-gray-900 text-sm text-right max-w-[60%]">{transaction.property_title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Address</span>
              <span className="font-medium text-gray-900 text-sm text-right max-w-[60%]">{transaction.address}, {transaction.city}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">{transaction.kind === 'purchase' ? 'Buyer' : 'Tenant'}</span>
              <span className="font-medium text-gray-900 text-sm">{transaction.counterpartyName || 'Unknown'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Category</span>
              <span className="font-medium text-gray-900 text-sm">
                {transaction.kind === 'purchase' ? 'Buy (outright)' : `Rent — ${transaction.rent_period_months ?? '—'} month(s)`}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Amount</span>
              <span className="font-semibold text-gray-900 text-lg">{formatNaira(transaction.amount)}</span>
            </div>
            {formatDateTime(transaction.created_at) && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Created</span>
                <span className="text-gray-900 text-sm">{formatDateTime(transaction.created_at)}</span>
              </div>
            )}
            {formatDateTime(transaction.completed_at) && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Completed</span>
                <span className="text-gray-900 text-sm">{formatDateTime(transaction.completed_at)}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reference: {reference}</span>
              <button
                onClick={handleCopyReference}
                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                title="Copy reference"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {canDecide ? (
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note to the customer (e.g. reason for declining)"
                maxLength={500}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onDecline && onDecline(transaction, note)}
                  disabled={isDeclining || isApproving}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  {isDeclining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span className="text-sm font-medium">Decline</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove && onApprove(transaction, note)}
                  disabled={isApproving || isDeclining}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm font-medium">Approve</span>
                </button>
              </div>
            </div>
          ) : canConfirm ? (
            <button
              type="button"
              onClick={() => onConfirm && onConfirm(transaction)}
              disabled={isConfirming}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span className="text-sm font-medium">Mark as Confirmed</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInvoiceModal;
