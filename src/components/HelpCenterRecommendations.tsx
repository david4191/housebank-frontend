import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Recommended for you
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Identity Verification Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            {/* Action Required Badge */}
            <div className="flex items-center space-x-2 mb-6">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500 uppercase tracking-wide">
                ACTION REQUIRED
              </span>
            </div>

            {/* Card Content */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your identity is not fully verified
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Identity verification helps us to know that you are really you. It is 
                one of the ways to keep Housebank users secured
              </p>
            </div>

            {/* Continue Button — routes to Support the same way the customer
                dashboard's Help page does, since there's no public
                self-serve verification flow to link to instead. */}
            <a
              href="mailto:Support@housebank.com?subject=Identity%20verification"
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group w-fit"
            >
              <span className="text-gray-700 font-medium">Continue verification</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Explore Neighborhoods Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            {/* Card Content */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Explore
              </h3>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Great Neighborhoods
              </h4>
              <p className="text-gray-600 leading-relaxed">
                We connect with directly to the person that knowns the most 
                about property for sale, the listing realtor.
              </p>
            </div>

            {/* Explore Button — the real, public property browse page */}
            <Link
              to="/explore"
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group w-fit"
            >
              <span className="text-gray-700 font-medium">Explore</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RecommendedSection;
