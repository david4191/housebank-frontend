import { Star } from 'lucide-react';
import team1 from '../assets/about/team-1.png';
import team2 from '../assets/about/team-2.png';
import team4 from '../assets/about/team-4.png';
import { useGetTestimonialsQuery } from '../redux/housebank.ts';

function avatarUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

// Used when a testimonial has no avatar_path -- cycled so a page of
// reviews doesn't show the same fallback face for every row.
const fallbackAvatars = [team2, team1, team4];

interface Testimonial {
  id: number;
  name: string;
  role?: string | null;
  avatar_path?: string | null;
  rating?: number | null;
  quote: string;
  is_featured?: number;
  created_at?: string;
}

/**
 * Real client reviews (Joan, Sep 2026 -- "the website contents are meant
 * to come from the admin, but stored in the DB"). This used to be 3
 * fully hardcoded fake reviews (Sarah O., Adebayo K., James T.) with a
 * hardcoded 5-star rating on every card. Now it fetches featured
 * testimonials from GET /content/testimonials?featured=1 and renders
 * the real name/role/quote/rating/avatar for each row.
 */
const ClientReviewsPage = () => {
  const { data: testimonials, isLoading, isError } = useGetTestimonialsQuery({ featured: 1 });
  const rows = (testimonials || []) as Testimonial[];

  return (
    <div className="bg-white">
      {/* Client Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Client Reviews</h1>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            At House Bank Real Estate, our clients are at the heart of everything we do. Here's what some of our 
            happy clients have to say about their experiences with us:
          </p>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500">Loading reviews…</p>
        )}

        {!isLoading && isError && (
          <p className="text-center text-gray-500">Couldn't load reviews right now.</p>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <p className="text-center text-gray-500">No reviews yet.</p>
        )}

        {!isLoading && !isError && rows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rows.map((review, index) => {
              const avatar = avatarUrl(review.avatar_path) || fallbackAvatars[index % fallbackAvatars.length];
              const rating = Math.max(0, Math.min(5, review.rating ?? 5));

              return (
                <div
                  key={review.id}
                  className={`rounded-2xl p-8 relative ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white border-2 border-gray-300'
                  }`}
                >
                  {/* Profile Image */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="pt-8">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      "{review.quote}"
                    </p>

                    {/* Rating and Name */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.name}
                          {review.role ? `, ${review.role}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientReviewsPage;
