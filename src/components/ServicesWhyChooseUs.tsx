import { useGetPageContentQuery } from '../redux/housebank.ts';

const DEFAULT_HEADER = { eyebrow: 'Services we Provide', title: 'Why Choose Us?' };

const DEFAULT_CARDS = [
  { id: 1, title: 'Expertise You Can Trust', description: 'Years of experience in real estate and investment.', extra: { style: 'white' } },
  { id: 2, title: 'Client-Centric Approach', description: 'Tailored services to meet your unique needs.', extra: { style: 'purple' } },
  { id: 3, title: 'Transparency and Integrity', description: 'Clear communication and ethical practices.', extra: { style: 'white' } },
  { id: 4, title: 'Client-Centric Approach', description: 'Tailored services to meet your unique needs.', extra: { style: 'purple' } },
];

/**
 * Services page "Why Choose Us?" cards. Used to be 100% hardcoded copy
 * (Joan, Sep 2026 -- "whole main website in one push"). Reads from
 * page_content_items (section "services-why-choose-us"), falling back
 * to the original copy.
 */
const ServicesWhyChooseUsPage = () => {
  const { data } = useGetPageContentQuery('services');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'services-why-choose-us' && i.extra?.kind === 'header');
  const headerEyebrow = header?.extra?.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const headerTitle = header?.title ?? DEFAULT_HEADER.title;

  const cardsRaw = items.filter((i: any) => i.section === 'services-why-choose-us' && i.extra?.kind !== 'header');
  const cards = cardsRaw.length > 0 ? cardsRaw : DEFAULT_CARDS;

  return (
    <div className="bg-white">
      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-gray-600 text-base mb-4">{headerEyebrow}</h3>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{headerTitle}</h1>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card: any, index: number) => {
            const isPurple = card.extra?.style === 'purple';
            return (
              <div
                key={card.id ?? index}
                className={`${isPurple ? 'bg-purple-100 border-purple-200' : 'bg-white border-gray-200'} border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServicesWhyChooseUsPage;
