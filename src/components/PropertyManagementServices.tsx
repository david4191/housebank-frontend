import { useGetPageContentQuery } from '../redux/housebank.ts';

const DEFAULT_HEADER = { eyebrow: 'Property management we Provide', title: 'What We DO' };

const DEFAULT_SERVICES = [
  { id: 1, title: 'Tenant Management', extra: { bullets: ['Tenant Screening: We conduct thorough background checks to find reliable tenants.', 'Lease Agreements: Drafting, negotiation, and renewal of lease contracts.', 'Tenant Support: Providing 24/7 assistance for tenant queries and concerns.'] } },
  { id: 2, title: 'Rent Collection and Financial Management', extra: { bullets: ['Automated rent collection with on-time disbursements.', 'Regular financial reporting, including income, expenses, and tax documents.', 'Handling late payments and implementing penalties where necessary.'] } },
  { id: 3, title: 'Maintenance and Repairs', extra: { bullets: ['Scheduling routine property inspections.', 'Coordinating maintenance and emergency repairs with trusted contractors.', "Preventative measures to preserve the property's value and reduce costs."] } },
  { id: 4, title: 'Marketing and Vacancy Minimization', extra: { bullets: ['Professional property listings with high-quality images and compelling descriptions.', 'Advertising across major platforms and social media to attract tenants quickly.', 'Streamlined tenant placement process to minimize vacancy periods.'] } },
  { id: 5, title: 'Legal and Regulatory Compliance', extra: { bullets: ['Ensuring adherence to local laws, safety regulations, and zoning codes.', 'Assistance with eviction procedures when necessary.', 'Guidance on property insurance and liability requirements.'] } },
];

/**
 * Property Management landing page "What We DO" section. Used to be
 * 100% hardcoded copy (Joan, Sep 2026 -- "whole main website in one
 * push"). Reads from page_content_items (section "pm-services"),
 * falling back to the original copy.
 */
const PropertyServicesPage = () => {
  const { data } = useGetPageContentQuery('property-management');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'pm-services' && i.extra?.kind === 'header');
  const eyebrow = header?.extra?.eyebrow ?? DEFAULT_HEADER.eyebrow;
  const title = header?.title ?? DEFAULT_HEADER.title;

  const servicesRaw = items.filter((i: any) => i.section === 'pm-services' && i.extra?.kind !== 'header');
  const services = servicesRaw.length > 0 ? servicesRaw : DEFAULT_SERVICES;

  return (
    <div className="bg-white ">
      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-600 text-lg mb-4">{eyebrow}</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, index: number) => {
            const bullets: string[] = Array.isArray(service.extra?.bullets) ? service.extra.bullets : [];
            return (
              <div key={service.id ?? index} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                  {bullets.map((bullet, bulletIndex) => {
                    // Preserve the original "Bold Label: rest of sentence"
                    // styling for bullets written that way (e.g. "Tenant
                    // Screening: We conduct...") without needing a
                    // separate DB field just for the bold portion.
                    const match = /^([^:]{1,40}:)\s*(.*)$/.exec(bullet);
                    if (match) {
                      return (
                        <p key={bulletIndex}>
                          <span className="font-semibold text-gray-800">{match[1]}</span> {match[2]}
                        </p>
                      );
                    }
                    return <p key={bulletIndex}>{bullet}</p>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PropertyServicesPage;
