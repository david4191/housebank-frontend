import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useSubmitScamReportMutation } from '../redux/housebank.ts';

/**
 * Real "Report a Scam" form (Joan, Sep 2026 -- "this /report-scam is not
 * submitting to the overall admin"). Used to be a plain <div> with no
 * <form> tag and a submit handler that only console.logged. Now wired
 * to a real POST reports/scam (see hb-backend/src/modules/reports),
 * which every admin can see via GET /reports. Honeypot field, honest
 * date/file-upload treatment (same reasoning as ReportConcern.tsx -- no
 * anonymous-upload endpoint exists anywhere in this codebase).
 */
const ReportScamContent = () => {
  const [formData, setFormData] = useState({
    // Your Information
    fullName: '',
    email: '',
    phoneNumber: '',

    // Scammer Information
    scammerName: '',
    scammerEmail: '',
    scammerPhone: '',

    // Scam Details
    whatHappened: '',
    whenHappened: '',
    lostMoney: '',
    amount: '',
  });
  const [companyWebsite, setCompanyWebsite] = useState(''); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [submitScam, { isLoading: submitting }] = useSubmitScamReportMutation();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.whatHappened.trim().length < 10) {
      setError('Please describe what happened in at least 10 characters.');
      return;
    }

    const result: any = await submitScam({
      description: formData.whatHappened.trim(),
      reporter_full_name: formData.fullName.trim() || undefined,
      reporter_email: formData.email.trim() || undefined,
      reporter_phone: formData.phoneNumber.trim() || undefined,
      incident_date: formData.whenHappened || undefined,
      scammer_name: formData.scammerName.trim() || undefined,
      scammer_email: formData.scammerEmail.trim() || undefined,
      scammer_phone: formData.scammerPhone.trim() || undefined,
      money_lost: formData.lostMoney === 'yes' ? 'yes' : formData.lostMoney === 'no' ? 'no' : undefined,
      amount_lost: formData.lostMoney === 'yes' && formData.amount ? formData.amount : undefined,
      company_website: companyWebsite || undefined,
    });

    if (result.error) {
      const err = result.error;
      const firstError = err?.errors ? (Object.values(err.errors)[0] as string[])?.[0] : null;
      setError(firstError || err?.message || 'Unable to submit your report. Please try again.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center bg-white rounded-2xl shadow-sm p-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Report submitted</h1>
          <p className="text-gray-600">Thank you — your report has been sent to our team for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-sm mb-2">Report a Scam</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Have you encountered a scam? Let us know!
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to creating a safe and trustworthy environment for everyone. If you've come
            across suspicious activities, fraudulent schemes, or deceptive practices, report them here.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl shadow-sm p-8">
          {/* Honeypot -- hidden from real visitors */}
          <input
            type="text"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Information (Optional)</h2>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g John"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Details of the Scam Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Details of the Scam</h2>

                <div className="space-y-6">
                  {/* What Happened */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">What Happened?</label>
                    <textarea
                      placeholder="Describe the incident in detail..."
                      rows={4}
                      value={formData.whatHappened}
                      onChange={(e) => handleInputChange('whatHappened', e.target.value)}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* When Did It Happen & Upload Files */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">When Did It Happen?</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.whenHappened}
                          onChange={(e) => handleInputChange('whenHappened', e.target.value)}
                          max={new Date().toISOString().slice(0, 10)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Upload Files</label>
                      <div
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                        title="File attachments aren't available for anonymous reports yet"
                      >
                        Not available yet
                      </div>
                    </div>
                  </div>

                  {/* Did You Lose Money */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">Did You Lose Money? (Select one)</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="lostMoney"
                          value="yes"
                          checked={formData.lostMoney === 'yes'}
                          onChange={(e) => handleInputChange('lostMoney', e.target.value)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700">yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="lostMoney"
                          value="no"
                          checked={formData.lostMoney === 'no'}
                          onChange={(e) => handleInputChange('lostMoney', e.target.value)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {/* If Yes, How Much */}
                  {formData.lostMoney === 'yes' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">If Yes, How Much?</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Scammer Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Scammer Information (if available)</h2>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g John"
                    value={formData.scammerName}
                    onChange={(e) => handleInputChange('scammerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="@gmail.com"
                    value={formData.scammerEmail}
                    onChange={(e) => handleInputChange('scammerEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234"
                    value={formData.scammerPhone}
                    onChange={(e) => handleInputChange('scammerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportScamContent;
