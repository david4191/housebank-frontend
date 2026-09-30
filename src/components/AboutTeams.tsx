import { Twitter, Facebook, Linkedin } from 'lucide-react';

import team1 from '../assets/about/team-1.png';
import team2 from '../assets/about/team-2.png';
import team3 from '../assets/about/team-3.png';
import team4 from '../assets/about/team-4.png';
import { useGetPageContentQuery } from '../redux/housebank.ts';

const FALLBACK_IMAGES = [team1, team2, team3, team4];

function imageUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

const DEFAULT_HEADER = {
  title: 'Our Team',
  description:
    "At House Bank Real Estate, we make renting, buying, and investing in property seamless and rewarding. Whether you're looking for your next home, rental space, or a lucrative investment opportunity, our team is here to guide you every step of the way.",
};

const DEFAULT_MEMBERS = [
  { id: 1, title: 'Oluwafemi Adegbanga', subtitle: 'Founder & CEO', description: 'With a vision to revolutionize the real estate industry, Oluwafemi founded HouseBank Real Estate to offer personalized and innovative property solutions, leading the team with integrity, innovation, and a client-first approach.', extra: { twitter: '#', facebook: '#', linkedin: '#' } },
  { id: 2, title: 'Oluwafemi Adegbanga', subtitle: 'Chief Operating Officer', description: 'As Chief Operating Officer, Oluwafemi oversees day-to-day operations at HouseBank Real Estate, making sure every client interaction reflects our commitment to integrity, innovation, and a client-first approach.', extra: { twitter: '#', facebook: '#', linkedin: '#' } },
  { id: 3, title: 'Oluwafemi Adegbanga', subtitle: 'Senior Sales Manager', description: 'As Senior Sales Manager, Oluwafemi leads the sales team at HouseBank Real Estate, helping clients navigate the market with expert guidance built on integrity, innovation, and a client-first approach.', extra: { twitter: '#', facebook: '#', linkedin: '#' } },
  { id: 4, title: 'Oluwafemi Adegbanga', subtitle: 'Leasing Consultant', description: 'As a Leasing Consultant at HouseBank Real Estate, Oluwafemi helps tenants and property owners find the right fit, guided by integrity, innovation, and a client-first approach.', extra: { twitter: '#', facebook: '#', linkedin: '#' } },
];

/**
 * About page team section. Used to be 100% hardcoded placeholder bios
 * (Joan, Sep 2026 -- "whole main website in one push"; this specific
 * section previously stayed hardcoded on purpose since there was no
 * team_members table, but that instruction supersedes that call). Now
 * reads from page_content_items (section "about-team"), falling back to
 * the exact original copy when a row hasn't loaded yet or is missing.
 */
const TeamSection = () => {
  const { data } = useGetPageContentQuery('about');
  const items = data || [];

  const header = items.find((i: any) => i.section === 'about-team' && i.extra?.kind === 'header');
  const headerTitle = header?.title ?? DEFAULT_HEADER.title;
  const headerDescription = header?.description ?? DEFAULT_HEADER.description;

  const membersRaw = items.filter((i: any) => i.section === 'about-team' && i.extra?.kind !== 'header');
  const members = membersRaw.length > 0 ? membersRaw : DEFAULT_MEMBERS;

  const TeamCard = ({ member, index }: { member: any; index: number }) => {
    const image = imageUrl(member.image_path) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const social = member.extra || {};
    return (
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
        {/* Team Member Image */}
        <div className="relative">
          <div className="w-full h-60 overflow-hidden">
            <img
              src={image}
              alt={member.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name Overlay */}
          <div className="absolute bottom-4 left-4">
            <div className="relative right-5 top-11 bg-opacity-75 text-white px-3 py-1 text-sm font-medium" style={{ background: '#312630' }}>
              {member.title}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4  mt-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900">
            {member.subtitle}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {member.description}
          </p>

          {/* Social Media Links */}
          <div className="flex items-center space-x-3 pt-2">
            <a
              href={social.twitter || '#'}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label={`${member.title} Twitter`}
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={social.facebook || '#'}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              aria-label={`${member.title} Facebook`}
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={social.linkedin || '#'}
              className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
              aria-label={`${member.title} LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{headerTitle}</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
            {headerDescription}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {members.map((member: any, index: number) => (
            <TeamCard key={member.id ?? index} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
