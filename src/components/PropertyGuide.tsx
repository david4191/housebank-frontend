import laptopImage from '../assets/laptop-mockup.png';
import laptopImageOne from '../assets/laptop-mockup-1.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_HEADINGS = [
  { id: 1, title: 'Discover the easiest way to get a new property in Nigeria' },
  { id: 2, title: 'Our streamlined property acquisition process' },
];

const DEFAULT_FAQ = [
  { id: 1, title: 'What documents do I need to rent a property?', description: "Typically, you'll need ID proof, income proof, and references. Requirements may vary by landlord. We Typically, you'll need ID proof, income proof, and references. Requirements may vary by landlord. Typically, you'll need ID proof, income proof, and references. Requirements may vary by landlord. Typically, you'll need ID proof, income proof, and references. Requirements may vary by landlord." },
  { id: 2, title: 'How do I know if a property is right for me?', description: 'Consider location, budget, amenities, and your long-term needs. Our realtors can help you evaluate properties based on your specific requirements.' },
  { id: 3, title: "What's the typical rental process timeline?", description: 'From search to move-in usually takes 2-4 weeks, depending on availability and paperwork processing times.' },
  { id: 4, title: 'Are utilities included in the rent?', description: "This varies by property. Some include basic utilities while others don't. Always check the lease agreement carefully." },
  { id: 5, title: 'How does HouseBank ensure property quality?', description: 'We personally vet all listings and maintain strict quality standards. Our team conducts regular property inspections.' },
];

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 flex items-center justify-center mt-0.5">
          <span className="text-white text-sm font-medium">{index + 1}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 font-medium text-base leading-relaxed">
            {question}
          </h3>
          <div className="mt-2">
            <p className="text-gray-600 text-sm leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Homepage "get a property" guide. Used to be 100% hardcoded copy (Joan,
 * Sep 2026 -- "whole main website in one push"). The two headings + the
 * shared FAQ list both read from page_content_items (sections
 * "home-property-guide" and "home-property-guide-faq"), falling back to
 * the original copy.
 */
const PropertyGuide = () => {
  const { data } = useGetPageContentQuery('home');
  const items = data || [];

  const headingsRaw = items.filter((i: any) => i.section === 'home-property-guide');
  const headings = headingsRaw.length > 0 ? headingsRaw : DEFAULT_HEADINGS;
  const firstHeading = headings[0] ?? DEFAULT_HEADINGS[0];
  const secondHeading = headings[1] ?? DEFAULT_HEADINGS[1];

  const faqRaw = items.filter((i: any) => i.section === 'home-property-guide-faq');
  const faqData = faqRaw.length > 0 ? faqRaw : DEFAULT_FAQ;

  const firstImage = imageUrl(firstHeading?.image_path) || laptopImage;
  const secondImage = imageUrl(secondHeading?.image_path) || laptopImageOne;

  return (
    <div className="bg-white">
      {/* First Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {firstHeading?.title}
              </h1>
            </div>

            {/* FAQ Items - All expanded by default */}
            <div className="space-y-4">
              {faqData.map((faq: any, index: number) => (
                <FaqItem
                  key={faq.id ?? index}
                  question={faq.title}
                  answer={faq.description}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Laptop Image */}
          <div className="relative h-full">
            <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden">
              <img
                src={firstImage}
                alt="Laptop Mockup"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Mirror Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Laptop Image */}
          <div className="relative lg:order-1 h-full">
            <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden flex items-center justify-center p-4">
              <img
                src={secondImage}
                alt="Laptop Mockup"
                className="h-auto w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {secondHeading?.title}
              </h2>
            </div>

            {/* FAQ Items - All expanded by default */}
            <div className="space-y-4">
              {faqData.map((faq: any, index: number) => (
                <FaqItem
                  key={`second-${faq.id ?? index}`}
                  question={faq.title}
                  answer={faq.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyGuide;
