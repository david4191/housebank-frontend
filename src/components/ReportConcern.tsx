import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useGetPublicCompaniesQuery, useSubmitConcernReportMutation } from '../redux/housebank.ts';

/**
 * Real "Report neighbourhood concern" form (Joan, Sep 2026 -- "the form
 * in /report-concern is not working or submitting to the company"). This
 * used to be a plain <div> with no <form> tag at all and a handleSubmit
 * that only console.logged -- nothing a visitor typed ever went
 * anywhere, and there was no way to say which company the concern was
 * about even though Joan wants it routed there. Now wired to a real
 * POST reports/concern (see hb-backend/src/modules/reports), with a
 * company picker backed by the same public companies directory
 * ExploreProperty.tsx already uses, a honeypot field, and honest date/
 * file-upload treatment (anonymous file uploads aren't built -- no
 * precedent anywhere else in this codebase for an unauthenticated
 * upload, and adding one now would be a real security surface, not a
 * cosmetic gap).
 */
const ReportConcernContent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    incidentDate: '',
    description: '',
    companyName: '',
  });
  const [companyWebsite, setCompanyWebsite] = useState(''); // honeypot -- a real visitor never sees or fills this
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: companiesResult } = useGetPublicCompaniesQuery({ per_page: 200 });
  const companies = companiesResult?.items || [];
  const [submitConcern, { isLoading: submitting }] = useSubmitConcernReportMutation();

  const matchedCompany = useMemo(() => {
    const q = formData.companyName.trim().toLowerCase();
    if (!q) return null;
    return companies.find((c: any) => (c.company_name || '').trim().toLowerCase() === q) || null;
  }, [formData.companyName, companies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.description.trim().length < 10) {
      setError('Please describe what happened in at least 10 characters.');
      return;
    }

    const result: any = await submitConcern({
      description: formData.description.trim(),
      company_id: matchedCompany ? matchedCompany.id : undefined,
      reporter_full_name: formData.fullName.trim() || undefined,
      reporter_email: formData.email.trim() || undefined,
      reporter_phone: formData.phoneNumber.trim() || undefined,
      incident_date: formData.incidentDate || undefined,
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
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center bg-white rounded-2xl p-10 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Report submitted</h1>
          <p className="text-gray-600">
            Thank you — your report has been sent
            {matchedCompany ? ` to ${matchedCompany.company_name} and our team` : ' to our team'} for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Report neighborhood concern
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
            We're committed to creating a safe and trustworthy environment for everyone. If you've any issues about your neighborhood, kindly let us know
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="rounded-2xl p-8">
          <div className="space-y-8">

            {/* Honeypot -- hidden from real visitors, a filled value is silently accepted as success server-side */}
            <input
              type="text"
              name="company_website"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Your Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Information (Optional)
              </h2>

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g John"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+234"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                />
              </div>
            </div>

            {/* Which company Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Which company is this about? (Optional)
              </h2>
              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  list="report-concern-companies"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Start typing a company name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                />
                <datalist id="report-concern-companies">
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.company_name} />
                  ))}
                </datalist>
                {formData.companyName && !matchedCompany && (
                  <p className="text-xs text-gray-500">
                    We couldn't match this to a registered company — your report will still be sent to our team.
                  </p>
                )}
              </div>
            </div>

            {/* Details of the incident Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Details of the incident
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* When Did It Happen */}
                <div className="space-y-2">
                  <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700">
                    When Did It Happen?
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="incidentDate"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().slice(0, 10)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Upload Files -- not built: no anonymous-upload endpoint
                    exists anywhere in this codebase, and adding one for an
                    unauthenticated form would be a real new security
                    surface, not a cosmetic feature. Honest about that
                    rather than pretending to accept files. */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Files
                  </label>
                  <div
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                    title="File attachments aren't available for anonymous reports yet"
                  >
                    Not available yet
                  </div>
                  <p className="text-xs text-gray-500">
                    Please describe any evidence (screenshots, chats) in the message below instead.
                  </p>
                </div>
              </div>

              {/* What Happened */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  What Happened?
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={8}
                  required
                  minLength={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportConcernContent;
