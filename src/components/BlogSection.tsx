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
 * Real, DB-backed blog teaser shown on the homepage and /help-center
 * (Joan, Sep 2026 -- "the read more in the blogs are not opening the blog
 * details"). This used to be three hardcoded "Top 5 Emerging Real Estate
 * Markets" cards (all the same title) with a local `likes` counter that
 * reset on every page load and a comment count that was always 0 --
 * neither backed by anything real -- and a "Read More" button with no
 * onClick at all. Now pulls the newest published posts from
 * GET /content/blog and links each one to its real /blog-details/:slug
 * page; the fake like/comment counters are gone since there's no real
 * data source for either.
 */
const BlogSection = () => {
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 3 });
  const posts = result?.items || [];

  const BlogCard = ({ post }: { post: any }) => {
    const img = imageUrl(post.cover_image_path);

    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Blog Image */}
        <div className="w-full h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
          {img ? (
            <img
              src={img}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">No image</span>
          )}
        </div>

        {/* Blog Content */}
        <div className="p-6 space-y-4">
          {/* Date */}
          <div className="text-sm text-gray-500 font-medium">
            {formatDate(post.published_at)}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed">{post.excerpt}</p>
          )}

          {/* Read More */}
          <div className="pt-4">
            <Link
              to={`/blog-details/${post.slug}`}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors group w-fit"
            >
              <span className="text-sm font-medium">Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Our Blog</h2>
          <Link
            to="/blogs"
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span className="text-sm font-medium">See More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No blog posts have been published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
