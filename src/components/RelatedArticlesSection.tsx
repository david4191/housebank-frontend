import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetBlogPostsQuery } from '../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

/**
 * Real, DB-backed "Related articles" grid on /listed-properties-cover
 * (Joan, Sep 2026 -- "fix listed-properties-cover too"). This used to be
 * four hardcoded tiles with local stock images and no links at all -- not
 * even the fourth "Housebank Cover" tile, which pointed at an `isSpecial`
 * flag nothing ever set, so its black/Shield "special card" branch of the
 * JSX was permanently dead code. There is no backend concept of a
 * standalone "Housebank Cover" article/product, so that invented tile is
 * gone -- this now shows the newest real published posts from
 * GET /content/blog, each linking to its real /blog-details/:slug page.
 */
const RelatedArticlesSection = () => {
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 4 });
  const posts = result?.items || [];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Related articles
          </h2>
          <Link to="/blogs" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors group">
            <span className="text-sm font-medium">Browse all topics</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No articles available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post: any) => {
              const img = imageUrl(post.cover_image_path);
              return (
                <Link to={`/blog-details/${post.slug}`} key={post.id} className="group block">
                  {/* Article Card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    {/* Article Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex items-center justify-center">
                      {img ? (
                        <img
                          src={img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>

                    {/* Article Title */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedArticlesSection;
