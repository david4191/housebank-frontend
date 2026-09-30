import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Globe, Instagram, Linkedin } from 'lucide-react';
import arrowTop from '../assets/arrow-top.png';
import logo1 from '../assets/logo1.png';
import { useSubscribeNewsletterMutation } from '../redux/housebank.ts';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [subscribeNewsletter, { isLoading: subscribing }] = useSubscribeNewsletterMutation();

  // Joan, Sep 2026: "the forms in the landing page are not working" --
  // this used to only call console.log(), no backend endpoint existed.
  // Now wired to POST /leads/newsletter (anonymous, rate-limited).
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const result = await subscribeNewsletter({ email, company_website: honeypot });
    if ('error' in result) {
      const err: any = result.error;
      const msg = err?.errors?.email?.[0] || err?.message || "Couldn't subscribe right now. Please try again.";
      setFeedback({ type: 'error', text: msg });
      return;
    }

    setFeedback({ type: 'success', text: "You're subscribed — thanks!" });
    setEmail('');
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Left Section - Logo and Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            {/* Logo */}
            <img src={logo1} alt="HouseBank Logo" className="w-13 h-11" />

            {/* Newsletter Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Looking to Buy, Rent and Invest in Real Estate?
              </h3>
              
              <form onSubmit={handleEmailSubmit} className="relative w-full">
                {/* Honeypot -- hidden from real visitors via CSS, bots that fill every field trip it */}
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 pr-16 bg-white text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="absolute right-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <img 
                      src={arrowTop} 
                      alt="Submit" 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
              </form>
              {feedback && (
                <p className={`text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.text}
                </p>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {/* Explore Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/explore?type=rent" className="text-gray-400 hover:text-white transition-colors">Rent</Link></li>
              <li><Link to="/explore?type=sale" className="text-gray-400 hover:text-white transition-colors">Buy</Link></li>
              <li><Link to="/investment" className="text-gray-400 hover:text-white transition-colors">Investment</Link></li>
              <li><Link to="/Investment-listing" className="text-gray-400 hover:text-white transition-colors">List your property</Link></li>
              <li><Link to="/agents" className="text-gray-400 hover:text-white transition-colors">Find a Realtor</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/property-management" className="text-gray-400 hover:text-white transition-colors">Property Management</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about-us" className="text-gray-400 hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help-center" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/listed-properties-cover" className="text-gray-400 hover:text-white transition-colors">HouseBank Cover</Link></li>
              <li><Link to="/anti-discrimination" className="text-gray-400 hover:text-white transition-colors">Anti-discrimination</Link></li>
              <li><Link to="/report-scam" className="text-gray-400 hover:text-white transition-colors">Report Scam</Link></li>
              <li><Link to="/report-concern" className="text-gray-400 hover:text-white transition-colors">Report Neighbourhood concern</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              {new Date().getFullYear()} Housebank. All right reserved
            </div>

            {/* Legal Links */}
            <div className="flex space-x-8">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
