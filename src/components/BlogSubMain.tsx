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

// Alternates large/medium card sizes across whatever real posts come back,
// so the layout still reads like a curated grid without depending on a
// fixed post count (the old version indexed straight into a hardcoded
// 7-item array, e.g. blogPosts[6], which real data can't guarantee).
const sizePattern: Array<'large' | 'medium'> = ['large', 'large', 'medium', 'medium', 'medium', 'large', 'large'];

/**
 * Real, DB-backed "Popular Blog" grid (Joan, Sep 2026 -- "the read more in
 * the blogs are not opening the blog details"). This used to be seven
 * hardcoded posts with local stock images; only the very first card linked
 * anywhere, and it linked to the old paramless /blog-details route. Every
 * other card's "click" handler only console.logged. Now pulls real
 * published posts from GET /content/blog and links each one to its real
 * /blog-details/:slug page.
 */
const PopularBlogGridPage = () => {
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 7 });
  const posts = result?.items || [];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post: any, index: number) => {
              const size = sizePattern[index % sizePattern.length];
              const img = imageUrl(post.cover_image_path);
              const isLarge = size === 'large';

              return (
                <div key={post.id} className={isLarge ? 'lg:col-span-2' : ''}>
                  <Link to={`/blog-details/${post.slug}`} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
                      <div className={`${isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden bg-gray-200 flex items-center justify-center`}>
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
                      <div className="p-6">
                        <p className="text-sm text-gray-500 mb-3">
                          {formatDate(post.published_at)}
                        </p>
                        <h3 className={`${isLarge ? 'text-xl' : 'text-lg'} font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-tight`}>
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularBlogGridPage;
