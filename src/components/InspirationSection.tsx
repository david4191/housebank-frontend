import modernApartments from '../assets/explore/modern-apartments.png';
import commercialBuilding from '../assets/explore/commercial-building.png';
import aerialNeighborhood from '../assets/explore/aerial-neighborhood.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const FALLBACK_IMAGES = [modernApartments, commercialBuilding, aerialNeighborhood];

const DEFAULT_HEADER = 'Get inspiration for your next properties';

const DEFAULT_CARDS = [
  { id: 1, title: '5 of the best properties in Nigeria', description: 'From Abuja to every part of Nigeria, see the best recommended properties in Nigeria and the values, how it can help your portfolio positively.', extra: { size: 'large' } },
  { id: 2, title: 'The 10 best real estates in Nigeria', description: 'A beautiful house that resonates the beauty of lagos, affordable and friendly environment', extra: { size: 'small' } },
  { id: 3, title: 'The 5 best Neighbourhood in Nigeria', description: 'A beautiful house that resonates the beauty of lagos, affordable and friendly environment', extra: { size: 'small' } },
];

/**
 * "Get inspiration" cards -- shared by the Explore, Investment, and
 * Investment Details pages. Used to be 100% hardcoded copy (Joan, Sep
 * 2026 -- "whole main website in one push"). Reads from
 * page_content_items (page "explore", section "explore-inspiration"),
 * falling back to the original copy. Editing this in Site Content >
 * Page Content updates it everywhere it's shown, same as before.
 */
const InspirationSection = () => {
  const { data } = useGetPageContentQuery('explore');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'explore-inspiration' && i.extra?.kind === 'header');
  const title = header?.title ?? DEFAULT_HEADER;

  const cardsRaw = items.filter((i: any) => i.section === 'explore-inspiration' && i.extra?.kind !== 'header');
  const cards = cardsRaw.length > 0 ? cardsRaw : DEFAULT_CARDS;

  const largeCard = cards.find((c: any) => (c.extra?.size ?? 'small') === 'large') ?? cards[0];
  const smallCards = cards.filter((c: any) => c !== largeCard);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Main Layout - Large card on left, two smaller cards on right */}
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-100 ">
          {/* Large Card - Left Side */}
          {largeCard && (
            <div className=" flex-1 lg:flex-[2] relative rounded-3xl overflow-hidden shadow-lg">
              <div className="absolute inset-0">
                <img
                  src={imageUrl(largeCard.image_path) || FALLBACK_IMAGES[0]}
                  alt={largeCard.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <div className="w-[113%] bg-black/50 p-4 relative right-8 top-8">
                  <h3 className="text-2xl font-bold text-white leading-tight mb-4">
                    {largeCard.title}
                  </h3>
                  <p className="text-white text-opacity-90 text-base leading-relaxed w-full">
                    {largeCard.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Two smaller cards side by side */}
          <div className="flex-2 flex flex-col lg:flex-row gap-6">
            {smallCards.map((card: any, index: number) => (
              <div className="flex-1 relative rounded-3xl overflow-hidden shadow-lg" key={card.id ?? index}>
                <div className="h-90 lg:h-full relative">
                  <img
                    src={imageUrl(card.image_path) || FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-95">
                    <h3 className="text-md font-bold text-gray-900 leading-tight mb-1">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationSection;
