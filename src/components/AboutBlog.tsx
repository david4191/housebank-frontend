import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGetBlogPostsQuery } from '../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatPostDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const BlogPage = () => {
  // Real, DB-backed preview of the latest published posts (this used to be
  // three identical hardcoded posts with a property-search bar and fake
  // like/comment counters that had no backing table -- see the parallel
  // /blogs and /blog-details/:slug work for the full blog experience).
  const { data: result, isLoading } = useGetBlogPostsQuery({ per_page: 3 });
  const posts = result?.items || [];

  const BlogCard = ({ post }: { post: any }) => {
    const img = imageUrl(post.cover_image_path);
    const date = formatPostDate(post.published_at);

    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Blog Image */}
        <div className="w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
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
          {date && (
            <div className="text-sm text-gray-500 font-medium">
              {date}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {post.excerpt}
            </p>
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Blog</h1>

          {/* See More Button -- links to the full blog listing */}
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
          <div className="text-center text-gray-500 py-16">Loading blog posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No blog posts yet. Check back soon.</div>
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

export default BlogPage;
