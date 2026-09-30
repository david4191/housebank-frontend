import { ChevronRight } from 'lucide-react';
import { useGetPageContentQuery } from '../redux/housebank.ts';
import { renderIcon } from '../utils/iconLookup.tsx';

const DEFAULT_HEADER = 'Types of Properties We Manage';

const DEFAULT_TYPES = [
  { id: 1, title: 'Single-Family Homes', icon: 'Home' },
  { id: 2, title: 'Apartments and Condos', icon: 'Home' },
  { id: 3, title: 'Commercial Spaces', icon: 'Home' },
  { id: 4, title: 'Multi-Unit Complexes', icon: 'Home' },
];

/**
 * Property Management landing page "Types of Properties We Manage"
 * grid. Used to be 100% hardcoded copy (Joan, Sep 2026 -- "whole main
 * website in one push"; the four cards also all rendered the exact same
 * SVG icon regardless of type, a pre-existing quirk this now normalizes
 * to a single admin-editable "Home" icon per card rather than
 * reproducing dead per-card icon markup). Reads from page_content_items
 * (section "pm-property-types"), falling back to the original copy.
 */
const PropertyManagementTypesPage = () => {
  const { data } = useGetPageContentQuery('property-management');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'pm-property-types' && i.extra?.kind === 'header');
  const title = header?.title ?? DEFAULT_HEADER;

  const typesRaw = items.filter((i: any) => i.section === 'pm-property-types' && i.extra?.kind !== 'header');
  const types = typesRaw.length > 0 ? typesRaw : DEFAULT_TYPES;

  return (
    <div className="bg-white ">
      {/* Property Types Section */}
      <section className="max-w-7xl mx-4 px-4 sm:px-6 lg:px-8 py-15">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Property Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type: any, index: number) => (
            <div
              key={type.id ?? index}
              className="bg-purple-100 hover:bg-purple-200 transition-colors duration-200 rounded-2xl p-6 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                {/* Icon and Title Container */}
                <div className="flex items-center space-x-4 flex-1">
                  {/* Icon Container */}
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-gray-800">
                    {renderIcon(type.icon || 'Home', 'w-8 h-8 text-gray-800')}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {type.title}
                  </h3>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementTypesPage;
