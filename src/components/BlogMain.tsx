import { ArrowRight } from 'lucide-react';
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
 * Real, DB-backed blog list (Joan, Sep 2026 -- "the read more in the blogs
 * are not opening the blog details"). This used to render four hardcoded
 * "Top 5 Emerging Real Estate Markets" cards with fake view/like counts and
 * a "Read Full Article" button that only console.logged -- none of it was
 * connected to a real post, so there was nothing for "Read More" to open.
 * Now pulls the newest published posts from GET /content/blog and links
 * each one to its real /blog-details/:slug page.
 */
const BlogArticlesPage = () => {
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 4 });
  const posts = result?.items || [];
  const [featuredPost, ...otherPosts] = posts;

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          Loading articles…
        </div>
      </div>
    );
  }

  if (!featuredPost) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          No blog posts have been published yet.
        </div>
      </div>
    );
  }

  const featuredImg = imageUrl(featuredPost.cover_image_path);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-sm mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-4">
                {formatDate(featuredPost.published_at)}
              </p>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                {featuredPost.title}
              </h1>

              {featuredPost.excerpt && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              )}

              <Link
                to={`/blog-details/${featuredPost.slug}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 w-fit"
              >
                <span>Read Full Article</span>
              </Link>
            </div>

            {/* Right Image */}
            <div className="aspect-square lg:aspect-auto bg-gray-200 flex items-center justify-center">
              {featuredImg ? (
                <img
                  src={featuredImg}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">No image</span>
              )}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post: any) => {
              const img = imageUrl(post.cover_image_path);
              return (
                <article key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Article Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(post.published_at)}
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Article Footer */}
                    <Link
                      to={`/blog-details/${post.slug}`}
                      className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors group w-fit"
                    >
                      <span className="text-sm font-medium">Read Full Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogArticlesPage;
