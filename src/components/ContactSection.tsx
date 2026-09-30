import { useState } from 'react';
import houseImage from '../assets/housebank.png';
import { useSendContactMessageMutation } from '../redux/housebank.ts';

/**
 * "Say Hello to HouseBank" -- the landing page's public contact form.
 * Used to call console.log() only (Joan, Sep 2026: "the forms in the
 * landing page are not working") -- no backend endpoint existed at all,
 * so submitting it did nothing a visitor could see, no confirmation and
 * no error either. Now wired to POST /leads/contact (anonymous, rate-
 * limited, validated server-side -- see hb-backend's leads module).
 */
const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [sendContactMessage, { isLoading: sending }] = useSendContactMessageMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = await sendContactMessage({
      full_name: formData.fullName,
      email: formData.email,
      message: formData.message,
    });

    if ('error' in result) {
      const err: any = result.error;
      const errors = err?.errors as Record<string, string[]> | undefined;
      if (errors) {
        const flat: Record<string, string> = {};
        if (errors.full_name) flat.fullName = errors.full_name[0];
        if (errors.email) flat.email = errors.email[0];
        if (errors.message) flat.message = errors.message[0];
        setFieldErrors(flat);
      } else {
        setFieldErrors({ form: err?.message || "Couldn't send your message right now. Please try again." });
      }
      return;
    }

    setStatus('success');
    setFormData({ fullName: '', email: '', message: '' });
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#000000CC' }}>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Content - Contact Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Say Hello to HouseBank and Get excellent Experience
                  </h2>
                </div>

                {status === 'success' ? (
                  <div className="border border-green-500 bg-green-500/10 rounded-lg p-6 text-center space-y-3">
                    <p className="text-white font-medium">Message sent — thank you.</p>
                    <p className="text-gray-300 text-sm">We've received your message and will get back to you soon.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 border border-white p-6 rounded-lg">
                    {/* Honeypot -- hidden from real visitors via CSS, bots that fill every field trip it */}
                    <input
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={(formData as any).company_website || ''}
                      onChange={() => {}}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {fieldErrors.form && (
                      <p className="text-red-400 text-sm">{fieldErrors.form}</p>
                    )}

                    {/* Full Name Input */}
                    <div>
                      <label htmlFor="fullName" className="block text-gray-300 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g John"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                      {fieldErrors.fullName && <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="@gmail.com"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                      {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Description"
                        rows={5}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      />
                      {fieldErrors.message && <p className="text-red-400 text-xs mt-1">{fieldErrors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                    >
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Content - House Image */}
            <div className="relative flex items-center justify-center p-8 lg:p-12">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* House Image */}
                <img 
                      src={houseImage} 
                      alt="Modern luxury house" 
                      className="w-full h-full object-contain"
                    />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
