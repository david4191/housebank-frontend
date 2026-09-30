// src/components/dashboards/admin-dashboard/AdminBlog.tsx
import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminBlogPostsQuery,
  useGetAdminBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from '../../../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Matches the "lowercase/digits/hyphens only" constraint the backend
// validates the slug against -- used here only to surface a friendly
// inline hint before the round trip; the server response's own
// `errors.slug` still wins if this misses an edge case.
const SLUG_HINT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PER_PAGE = 10;

type StatusFilter = 'all' | 'draft' | 'published';

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isPublished = status === 'published';
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        isPublished
          ? 'border-green-300 text-green-600 bg-green-50'
          : 'border-orange-300 text-orange-500 bg-orange-50'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
};

const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

/**
 * Admin CMS for the blog (Joan, Sep 2026 -- "the blogs are meant to
 * come from the admin, so move the static blocks to the admin"). The
 * public blog (list/detail/homepage teaser) already reads from
 * blog_posts -- the only way a row ever got in there before this was a
 * raw SQL insert. This is the missing admin surface: list every post
 * regardless of status via GET /content/blog/admin, and create, edit
 * and delete posts through the matching CMS endpoints.
 */
const AdminBlog = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data, isLoading, isFetching, error } = useGetAdminBlogPostsQuery({
    page,
    per_page: PER_PAGE,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const [deleteBlogPost] = useDeleteBlogPostMutation();

  const [formTarget, setFormTarget] = useState<'new' | number | string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const rows = data?.items || [];
  const total = data?.total ?? 0;
  const hasNextPage = page * PER_PAGE < total;

  const handleFilterChange = (key: StatusFilter) => {
    setStatusFilter(key);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">Blog Posts</h1>
                <span className="text-sm text-gray-500">({total})</span>
                {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Create, edit and publish the posts shown on the public blog.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormTarget('new')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          <div className="px-4 sm:px-6 pt-4 flex items-center gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleFilterChange(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === tab.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
          ) : error ? (
            <p className="px-6 py-10 text-sm text-red-600">Couldn&rsquo;t load blog posts. Please try again.</p>
          ) : rows.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No posts yet. Click &ldquo;New Post&rdquo; to publish the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((post: any) => {
                    const img = imageUrl(post.cover_image_path);
                    return (
                      <tr key={post.id} className="hover:bg-gray-50 align-top">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                              {img ? (
                                <img src={img} alt={post.title} className="w-full h-full object-cover" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{post.title}</p>
                              <p className="text-xs text-gray-400">/{post.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {post.status === 'published'
                              ? formatDate(post.published_at)
                              : `Updated ${formatDate(post.updated_at)}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFormTarget(post.id)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(post)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && total > PER_PAGE && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Page {page} of {Math.max(1, Math.ceil(total / PER_PAGE))}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {formTarget !== null && (
        <BlogFormModal postId={formTarget === 'new' ? null : formTarget} onClose={() => setFormTarget(null)} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal post={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={deleteBlogPost} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL -- same overlay/card/red-button pattern used by
// company-dashboard/ManageRealtors.tsx's DeleteConfirmModal.
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({
  post,
  onClose,
  onDelete,
}: {
  post: any;
  onClose: () => void;
  onDelete: (id: number | string) => any;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);
    const result: any = await onDelete(post.id);
    setSubmitting(false);
    if (result?.error) {
      setError(result.error?.message || 'Could not delete this post. Please try again.');
      return;
    }
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 text-center">Delete Post</h2>
        <p className="text-sm text-gray-500 text-center">
          Are you sure you want to delete &ldquo;{post.title}&rdquo;? This can&rsquo;t be undone.
        </p>
        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE / EDIT MODAL
// ─────────────────────────────────────────────────────────────────────────────
const BlogFormModal = ({ postId, onClose }: { postId: number | string | null; onClose: () => void }) => {
  const isEdit = postId !== null;

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useGetAdminBlogPostQuery(postId ?? '', { skip: !isEdit });

  const [createBlogPost, { isLoading: creating }] = useCreateBlogPostMutation();
  const [updateBlogPost, { isLoading: updating }] = useUpdateBlogPostMutation();
  const submitting = creating || updating;

  const [initialized, setInitialized] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverPath, setExistingCoverPath] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Populate the form once the full post (including content_html) has
  // loaded for an edit -- create mode has nothing to wait on.
  useEffect(() => {
    if (isEdit && post && !initialized) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setSlugTouched(true);
      setExcerpt(post.excerpt || '');
      setContentHtml(post.content_html || '');
      setStatus(post.status === 'published' ? 'published' : 'draft');
      setExistingCoverPath(post.cover_image_path || null);
      setInitialized(true);
    }
  }, [isEdit, post, initialized]);

  // Local preview for a newly-picked cover file; revoked on change/unmount.
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverFile(e.target.files?.[0] || null);
  };

  const displayedCover = coverPreview || imageUrl(existingCoverPath);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedContent = contentHtml.trim();

    const localErrors: Record<string, string> = {};
    if (!trimmedTitle) localErrors.title = 'Title is required.';
    else if (trimmedTitle.length > 191) localErrors.title = 'Title must be 191 characters or fewer.';
    if (!trimmedSlug) localErrors.slug = 'Slug is required.';
    else if (!SLUG_HINT_PATTERN.test(trimmedSlug)) {
      localErrors.slug = 'Use lowercase letters, numbers and hyphens only.';
    }
    if (!trimmedContent) localErrors.content_html = 'Content is required.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.append('title', trimmedTitle);
    formData.append('slug', trimmedSlug);
    formData.append('excerpt', excerpt.trim());
    formData.append('content_html', contentHtml);
    formData.append('status', status);
    if (coverFile) formData.append('cover', coverFile);

    const result: any =
      postId !== null
        ? await updateBlogPost({ id: postId, body: formData })
        : await createBlogPost(formData);

    if (result?.error) {
      const err = result.error;
      const apiErrors = err?.errors as Record<string, string[]> | undefined;
      if (apiErrors) {
        const flat: Record<string, string> = {};
        Object.keys(apiErrors).forEach((key) => {
          if (apiErrors[key]?.[0]) flat[key] = apiErrors[key][0];
        });
        setFieldErrors(flat);
      } else {
        setFormError(err?.message || 'Could not save this post. Please try again.');
      }
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Post' : 'New Post'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? 'Update this blog post.' : 'Publish a new post to the public blog.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {isEdit && isPostLoading ? (
          <div className="px-6 py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : isEdit && isPostError ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-red-600 mb-4">Couldn&rsquo;t load this post.</p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                maxLength={191}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="post-title"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono"
              />
              <p className="text-xs text-gray-400">
                Lowercase letters, numbers and hyphens only — used in the post&rsquo;s public URL.
              </p>
              {fieldErrors.slug && <p className="text-xs text-red-600">{fieldErrors.slug}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary shown on the blog list and homepage teaser"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
              {fieldErrors.excerpt && <p className="text-xs text-red-600">{fieldErrors.excerpt}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Content (HTML)</label>
              <textarea
                rows={10}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                placeholder="<p>Write the full article here...</p>"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono resize-y"
              />
              {fieldErrors.content_html && <p className="text-xs text-red-600">{fieldErrors.content_html}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Cover Image</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200">
                  {displayedCover ? (
                    <img src={displayedCover} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm hover:file:bg-gray-200"
                />
              </div>
              {fieldErrors.cover && <p className="text-xs text-red-600">{fieldErrors.cover}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value === 'published' ? 'published' : 'draft')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {fieldErrors.status && <p className="text-xs text-red-600">{fieldErrors.status}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (isEdit ? 'Saving…' : 'Publishing…') : isEdit ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
