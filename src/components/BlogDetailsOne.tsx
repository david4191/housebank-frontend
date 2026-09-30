import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useGetBlogPostQuery } from '../redux/housebank.ts';

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
 * Real blog post detail page (Joan, Sep 2026 -- "the read more in the
 * blogs are not opening the blog details"). This used to render one
 * hardcoded "Top 5 Emerging Real Estate Markets in 2025" article -- same
 * text no matter which post you clicked, because nothing here ever read
 * the URL. /blog-details is now /blog-details/:slug, so this reads the
 * real slug and fetches the real post from GET /content/blog/:slug,
 * including its admin-authored content_html body. A missing/unpublished
 * slug gets an honest "not found" message instead of the old fake content.
 */
const BlogArticlePageDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copySuccess, setCopySuccess] = useState(false);
  const { data: post, isLoading, isError } = useGetBlogPostQuery(slug ?? '', { skip: !slug });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || 'HouseBank');

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!slug || isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">
          {slug ? 'Loading article…' : 'No blog post was specified.'}
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <p className="text-gray-600 mb-6">
            This article doesn't exist, or isn't published.
          </p>
          <Link to="/blogs" className="text-purple-600 hover:text-purple-700 font-medium">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = imageUrl(post.cover_image_path);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Hero Image */}
        {heroImage && (
          <div className="mb-8">
            <div className="aspect-[16/7] rounded-2xl overflow-hidden bg-gray-200">
              <img
                src={heroImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Meta and Social Sharing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="mb-4 sm:mb-0">
            {post.published_at && (
              <p className="text-sm text-gray-600">
                Published on: <span className="font-medium text-gray-900">{formatDate(post.published_at)}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Copy Link"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => handleSocialShare('twitter')}
              className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleSocialShare('facebook')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleSocialShare('linkedin')}
              className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Content -- admin-authored HTML from the CMS, same trust
            level as the rest of this platform's content_html fields. */}
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content_html || '' }}
        />
      </div>
    </div>
  );
};

export default BlogArticlePageDetails;
