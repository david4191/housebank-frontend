import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetBlogPostsQuery } from '../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Real, DB-backed "Popular Blog" widget shown on /blog-details/:slug and
 * /listed-properties-cover (Joan, Sep 2026 -- "the read more in the blogs
 * are not opening the blog details" / "fix listed-properties-cover too").
 * This used to be two hardcoded posts with local stock images and no link
 * at all -- clicking a card did nothing. Now pulls the newest published
 * posts from GET /content/blog and links each one to its real
 * /blog-details/:slug page.
 */
const PopularBlogSection = () => {
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 2 });
  const posts = result?.items || [];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Popular Blog
          </h2>
          <Link to="/blogs" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors group">
            <span className="text-sm font-medium">See More</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No blog posts have been published yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post: any) => {
              const img = imageUrl(post.cover_image_path);
              return (
                <Link to={`/blog-details/${post.slug}`} key={post.id} className="group block">
                  {/* Blog Post Card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Blog Post Image */}
                    <div className="aspect-[16/9] relative overflow-hidden bg-gray-200 flex items-center justify-center">
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

                    {/* Blog Post Content */}
                    <div className="p-6">
                      {/* Date */}
                      <p className="text-sm text-gray-500 mb-3">
                        {formatDate(post.published_at)}
                      </p>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">
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

export default PopularBlogSection;
