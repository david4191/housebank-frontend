import { useGetPageContentQuery } from '../redux/housebank.ts';

const DEFAULT_HEADER = { eyebrow: 'Why Choose us', title: 'What Makes Us Standout from others' };

const DEFAULT_POINTS = [
  { id: 1, title: 'Expert Management Team:', description: 'Years of experience managing residential and commercial properties.' },
  { id: 2, title: 'Tailored Solutions:', description: 'Customized services to suit your property type and goals.' },
  { id: 3, title: 'Technology-Driven:', description: 'Streamlined processes using modern tools for better efficiency.' },
  { id: 4, title: 'Proactive Approach:', description: 'Addressing potential issues before they become problems.' },
  { id: 5, title: 'Client-Centric Service:', description: 'Clear communication and dedicated support at every step.' },
];

/**
 * Property Management landing page "Why Choose Us" section. Used to be
 * 100% hardcoded copy (Joan, Sep 2026 -- "whole main website in one
 * push"). Reads from page_content_items (section "pm-why-choose-us"),
 * falling back to the original copy.
 */
const PropertyManagementWhyChooseUsPage = () => {
  const { data } = useGetPageContentQuery('property-management');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'pm-why-choose-us' && i.extra?.kind === 'header');
  const eyebrow = header?.extra?.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const title = header?.title ?? DEFAULT_HEADER.title;

  const pointsRaw = items.filter((i: any) => i.section === 'pm-why-choose-us' && i.extra?.kind !== 'header');
  const points = pointsRaw.length > 0 ? pointsRaw : DEFAULT_POINTS;

  return (
    <div className="bg-white">
      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Heading */}
          <div className="space-y-6 relative bottom-20">
            {/* Purple accent line */}
            <div className="w-1 h-37 bg-purple-400 relative top-32"></div>

            <div className="space-y-2 m-3 relative bottom-12">
              <p className="text-gray-600 text-lg">{eyebrow}</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Right Column - Benefits List */}
          <div className="space-y-6">
            <ul className="space-y-4">
              {points.map((point: any, index: number) => (
                <li className="flex items-start space-x-3" key={point.id ?? index}>
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <span className="font-semibold text-gray-800">{point.title}</span> {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementWhyChooseUsPage;
