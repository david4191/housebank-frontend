// src/components/dashboards/admin-dashboard/AdminSiteContent.tsx
import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  FileEdit,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  MessageSquareQuote,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import CustomerHeader from './CustomerHeader';
import {
  useGetAdminStaticPagesQuery,
  useUpsertStaticPageMutation,
  useGetHelpTopicsQuery,
  useCreateHelpTopicMutation,
  useUpdateHelpTopicMutation,
  useDeleteHelpTopicMutation,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetAdminPageContentQuery,
  useCreatePageContentItemMutation,
  useUpdatePageContentItemMutation,
  useDeletePageContentItemMutation,
} from '../../../redux/housebank.ts';

function imageUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

// Page Content images can be either a relative /uploads path (an admin-
// uploaded override, like avatar_path above) OR an already-absolute URL
// (several seeded items -- e.g. the Services page's four service cards --
// store a full https:// Unsplash URL directly), so this checks first
// instead of always prefixing the backend host like imageUrl() above.
function pageContentImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_APP_BACKEND_HOST}${path}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Matches the "lowercase/digits/hyphens only" constraint the backend
// validates slugs against -- surfaces a friendly inline hint before the
// round trip; the server response's own `errors.slug` still wins if this
// misses an edge case. Mirrors AdminBlog.tsx's SLUG_HINT_PATTERN.
const SLUG_HINT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

type TabKey = 'pages' | 'help' | 'testimonials' | 'pageContent';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pages', label: 'Pages' },
  { key: 'help', label: 'Help Topics' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'pageContent', label: 'Page Content' },
];

/**
 * Admin CMS for everything on the public site besides the blog (Joan,
 * Sep 2026 -- "the website contents are meant to come from the admin,
 * but stored in the DB, make sure its done"): static legal/info pages
 * (Privacy Policy, Anti-Discrimination, HouseBank Cover, ...), Help
 * Center FAQ topics, and homepage/services testimonials. Structured the
 * same way as AdminBlog.tsx -- table + modal create/edit + modal
 * delete-confirm, all in one file -- just with three tabs instead of
 * one list.
 */
const AdminSiteContent = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pages');

  return (
    <div className="flex flex-col h-full">
      <CustomerHeader />

      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Site Content</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the static pages, Help Center topics and testimonials shown on the public site.
            </p>
          </div>

          <div className="px-4 sm:px-6 pt-4 flex items-center gap-2 border-b border-gray-200 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'pages' && <PagesPanel />}
          {activeTab === 'help' && <HelpTopicsPanel />}
          {activeTab === 'testimonials' && <TestimonialsPanel />}
          {activeTab === 'pageContent' && <PageContentPanel />}
        </div>
      </main>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGES TAB
// ─────────────────────────────────────────────────────────────────────────────
const PagesPanel = () => {
  const { data, isLoading, isFetching, error } = useGetAdminStaticPagesQuery();
  const [formTarget, setFormTarget] = useState<'new' | any | null>(null);

  const rows = data || [];

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{rows.length} page{rows.length === 1 ? '' : 's'}</span>
          {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <button
          type="button"
          onClick={() => setFormTarget('new')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Page
        </button>
      </div>

      {isLoading ? (
        <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="px-6 py-10 text-sm text-red-600">Couldn&rsquo;t load pages. Please try again.</p>
      ) : rows.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <FileEdit className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No pages yet. Click &ldquo;Add New Page&rdquo; to create the first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-2">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((page: any) => (
                <tr key={page.id ?? page.slug} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-500">/{page.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{page.title}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{formatDate(page.updated_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setFormTarget(page)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formTarget !== null && (
        <PageFormModal page={formTarget === 'new' ? null : formTarget} onClose={() => setFormTarget(null)} />
      )}
    </div>
  );
};

const PageFormModal = ({ page, onClose }: { page: any | null; onClose: () => void }) => {
  const isEdit = page !== null;
  const [upsertStaticPage, { isLoading: submitting }] = useUpsertStaticPageMutation();

  const [slug, setSlug] = useState(page?.slug || '');
  const [title, setTitle] = useState(page?.title || '');
  const [contentHtml, setContentHtml] = useState(page?.content_html || '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSlug = slug.trim();
    const trimmedTitle = title.trim();
    const trimmedContent = contentHtml.trim();

    const localErrors: Record<string, string> = {};
    if (!trimmedSlug) localErrors.slug = 'Slug is required.';
    else if (!SLUG_HINT_PATTERN.test(trimmedSlug)) {
      localErrors.slug = 'Use lowercase letters, numbers and hyphens only.';
    }
    if (!trimmedTitle) localErrors.title = 'Title is required.';
    else if (trimmedTitle.length > 191) localErrors.title = 'Title must be 191 characters or fewer.';
    if (!trimmedContent) localErrors.content_html = 'Content is required.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    const result: any = await upsertStaticPage({
      slug: trimmedSlug,
      title: trimmedTitle,
      content_html: contentHtml,
    });

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
        setFormError(err?.message || 'Could not save this page. Please try again.');
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
            <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Page' : 'New Page'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? 'Update this static page.' : 'Add a new static page to the site.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            {isEdit ? (
              <p className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500 font-mono">
                /{page.slug}
              </p>
            ) : (
              <>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="privacy-policy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono"
                />
                <p className="text-xs text-gray-400">
                  Lowercase letters, numbers and hyphens only. Can&rsquo;t be changed once created.
                </p>
              </>
            )}
            {fieldErrors.slug && <p className="text-xs text-red-600">{fieldErrors.slug}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              maxLength={191}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Content (HTML)</label>
            <textarea
              rows={16}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="<h2>Section heading</h2>&#10;<p>Body copy...</p>"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono resize-y"
            />
            {fieldErrors.content_html && <p className="text-xs text-red-600">{fieldErrors.content_html}</p>}
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
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HELP TOPICS TAB
// ─────────────────────────────────────────────────────────────────────────────
const HelpTopicsPanel = () => {
  const { data, isLoading, isFetching, error } = useGetHelpTopicsQuery();
  const [deleteHelpTopic] = useDeleteHelpTopicMutation();

  const [formTarget, setFormTarget] = useState<'new' | any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const rows = data || [];

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{rows.length} topic{rows.length === 1 ? '' : 's'}</span>
          {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <button
          type="button"
          onClick={() => setFormTarget('new')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {isLoading ? (
        <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="px-6 py-10 text-sm text-red-600">Couldn&rsquo;t load Help Center topics. Please try again.</p>
      ) : rows.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No topics yet. Click &ldquo;Add Topic&rdquo; to create the first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-2">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((topic: any) => (
                <tr key={topic.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {topic.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm font-medium text-gray-900">{topic.question}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{topic.sort_order ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {topic.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-green-300 text-green-600 bg-green-50">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-500 bg-gray-50">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormTarget(topic)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(topic)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formTarget !== null && (
        <HelpTopicFormModal topic={formTarget === 'new' ? null : formTarget} onClose={() => setFormTarget(null)} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Help Topic"
          message={`Are you sure you want to delete "${deleteTarget.question}"? This can't be undone.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteHelpTopic(deleteTarget.id)}
        />
      )}
    </div>
  );
};

const HelpTopicFormModal = ({ topic, onClose }: { topic: any | null; onClose: () => void }) => {
  const isEdit = topic !== null;
  const [createHelpTopic, { isLoading: creating }] = useCreateHelpTopicMutation();
  const [updateHelpTopic, { isLoading: updating }] = useUpdateHelpTopicMutation();
  const submitting = creating || updating;

  const [category, setCategory] = useState(topic?.category || '');
  const [question, setQuestion] = useState(topic?.question || '');
  const [answer, setAnswer] = useState(topic?.answer || '');
  const [sortOrder, setSortOrder] = useState(String(topic?.sort_order ?? 0));
  const [isActive, setIsActive] = useState(topic?.is_active !== 0 && topic?.is_active !== false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCategory = category.trim();
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    const parsedSortOrder = sortOrder.trim() === '' ? 0 : Number(sortOrder);

    const localErrors: Record<string, string> = {};
    if (!trimmedCategory) localErrors.category = 'Category is required.';
    if (!trimmedQuestion) localErrors.question = 'Question is required.';
    if (!trimmedAnswer) localErrors.answer = 'Answer is required.';
    if (Number.isNaN(parsedSortOrder)) localErrors.sort_order = 'Sort order must be a number.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    const result: any = isEdit
      ? await updateHelpTopic({
          id: topic.id,
          body: {
            category: trimmedCategory,
            question: trimmedQuestion,
            answer: trimmedAnswer,
            sort_order: parsedSortOrder,
            is_active: isActive,
          },
        })
      : await createHelpTopic({
          category: trimmedCategory,
          question: trimmedQuestion,
          answer: trimmedAnswer,
          sort_order: parsedSortOrder,
        });

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
        setFormError(err?.message || 'Could not save this topic. Please try again.');
      }
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Topic' : 'New Topic'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? 'Update this Help Center topic.' : 'Add a new topic to the Help Center.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Account, Payments, Listings"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {fieldErrors.category && <p className="text-xs text-red-600">{fieldErrors.category}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="How do I..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {fieldErrors.question && <p className="text-xs text-red-600">{fieldErrors.question}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Answer</label>
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write the answer here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
            />
            {fieldErrors.answer && <p className="text-xs text-red-600">{fieldErrors.answer}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-400">Lower numbers appear first in the Help Center.</p>
            {fieldErrors.sort_order && <p className="text-xs text-red-600">{fieldErrors.sort_order}</p>}
          </div>

          {isEdit && (
            <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Active</p>
                <p className="text-xs text-gray-400">Inactive topics are hidden from the public Help Center.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

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
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS TAB
// ─────────────────────────────────────────────────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
      />
    ))}
  </div>
);

const TestimonialsPanel = () => {
  const { data, isLoading, isFetching, error } = useGetTestimonialsQuery();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const rows = data || [];

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{rows.length} testimonial{rows.length === 1 ? '' : 's'}</span>
          {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="px-6 py-10 text-sm text-red-600">Couldn&rsquo;t load testimonials. Please try again.</p>
      ) : rows.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <MessageSquareQuote className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No testimonials yet. Click &ldquo;Add Testimonial&rdquo; to add the first one.
          </p>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((t: any) => {
            const avatar = imageUrl(t.avatar_path);
            return (
              <div key={t.id} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                      <p className="text-xs text-gray-400 truncate">{t.role || '—'}</p>
                    </div>
                  </div>
                  {!!t.is_featured && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border border-blue-300 text-blue-600 bg-blue-50">
                      Featured
                    </span>
                  )}
                </div>
                <StarRating rating={Number(t.rating) || 0} />
                <p className="text-sm text-gray-600 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-end pt-1 border-t border-gray-50 mt-auto">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && <TestimonialFormModal onClose={() => setFormOpen(false)} />}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Testimonial"
          message={`Are you sure you want to delete the testimonial from "${deleteTarget.name}"? This can't be undone.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTestimonial(deleteTarget.id)}
        />
      )}
    </div>
  );
};

const TestimonialFormModal = ({ onClose }: { onClose: () => void }) => {
  const [createTestimonial, { isLoading: submitting }] = useCreateTestimonialMutation();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState('5');
  const [isFeatured, setIsFeatured] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedQuote = quote.trim();
    const parsedRating = Number(rating);

    const localErrors: Record<string, string> = {};
    if (!trimmedName) localErrors.name = 'Name is required.';
    if (!trimmedQuote) localErrors.quote = 'Quote is required.';
    if (rating.trim() !== '' && (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
      localErrors.rating = 'Rating must be between 1 and 5.';
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('role', role.trim());
    formData.append('quote', trimmedQuote);
    formData.append('rating', String(Number.isNaN(parsedRating) ? 5 : parsedRating));
    formData.append('is_featured', isFeatured ? '1' : '0');
    if (avatarFile) formData.append('avatar', avatarFile);

    const result: any = await createTestimonial(formData);

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
        setFormError(err?.message || 'Could not save this testimonial. Please try again.');
      }
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">New Testimonial</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add a testimonial to the homepage and services page.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm hover:file:bg-gray-200"
              />
            </div>
            {fieldErrors.avatar && <p className="text-xs text-red-600">{fieldErrors.avatar}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Homeowner, Investor"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {fieldErrors.role && <p className="text-xs text-red-600">{fieldErrors.role}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Quote</label>
            <textarea
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What did they say about HouseBank?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
            />
            {fieldErrors.quote && <p className="text-xs text-red-600">{fieldErrors.quote}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {fieldErrors.rating && <p className="text-xs text-red-600">{fieldErrors.rating}</p>}
            </div>

            <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-300"
              />
              <span className="text-sm text-gray-700">Feature on homepage</span>
            </label>
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
              {submitting ? 'Saving…' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CONTENT TAB -- the "whole main website in one push" manager (Joan,
// Sep 2026). Every marketing/landing-page block that used to be hardcoded
// JSX (About, Services, Realtor landing, Property Management landing, the
// two homepage/explore sections) now lives in page_content_items and is
// editable here, grouped by page then by section. Sections vary a lot in
// shape (a hero, a list of steps, stat cards, bullet lists...) so rather
// than building a bespoke form per section, structured fields cover the
// common shape (title/subtitle/description/icon/image) and a raw JSON
// "Advanced fields" box covers whatever a given section needs beyond that
// (bullets, stats, layout hints, social links, etc.) -- the same `extra`
// escape hatch the backend uses.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_OPTIONS: { key: string; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'realtor', label: 'Realtor Landing' },
  { key: 'property-management', label: 'Property Management' },
  { key: 'home', label: 'Homepage' },
  { key: 'explore', label: 'Explore / Investment' },
];

function sectionLabel(section: string) {
  return section
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const PageContentPanel = () => {
  const [selectedPage, setSelectedPage] = useState<string>(PAGE_OPTIONS[0].key);
  const { data, isLoading, isFetching, error } = useGetAdminPageContentQuery(selectedPage);
  const [deletePageContentItem] = useDeletePageContentItemMutation();

  const [formTarget, setFormTarget] = useState<'new' | any | null>(null);
  const [formSection, setFormSection] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const rows = data || [];
  const bySection = new Map<string, any[]>();
  rows.forEach((item: any) => {
    const list = bySection.get(item.section) || [];
    list.push(item);
    bySection.set(item.section, list);
  });
  bySection.forEach((list) => list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
  const sections = Array.from(bySection.keys()).sort();

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {PAGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedPage(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedPage === opt.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
          {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <button
          type="button"
          onClick={() => {
            setFormSection('');
            setFormTarget('new');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <p className="px-4 sm:px-6 pt-3 text-xs text-gray-400">
        These are the copy blocks on the public marketing pages (hero text, feature cards, team bios, stats, and
        so on). Editing an item here updates the live site immediately.
      </p>

      {isLoading ? (
        <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="px-6 py-10 text-sm text-red-600">Couldn&rsquo;t load this page&rsquo;s content. Please try again.</p>
      ) : sections.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <FileEdit className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No content items for this page yet.</p>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-4 space-y-6">
          {sections.map((section) => {
            const items = bySection.get(section) || [];
            return (
              <div key={section} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{sectionLabel(section)}</p>
                    <p className="text-xs text-gray-400 font-mono">{section}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSection(section);
                      setFormTarget('new');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to this section
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((item: any) => {
                    const isHeader = item.extra?.kind === 'header';
                    const image = pageContentImageUrl(item.image_path);
                    return (
                      <div key={item.id} className="px-4 py-3 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {image ? (
                            <img src={image} alt={item.title || ''} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isHeader && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-600 border border-purple-200">
                                Section heading
                              </span>
                            )}
                            {!item.is_active && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                Hidden
                              </span>
                            )}
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title || <em className="text-gray-400">(no title)</em>}</p>
                          </div>
                          {item.subtitle && <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>}
                          {item.description && <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setFormSection(item.section);
                              setFormTarget(item);
                            }}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formTarget && (
        <PageContentFormModal
          page={selectedPage}
          section={formSection}
          target={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Content Item"
          message={`Are you sure you want to delete "${deleteTarget.title || 'this item'}"? This can't be undone.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deletePageContentItem(deleteTarget.id)}
        />
      )}
    </div>
  );
};

const PageContentFormModal = ({
  page,
  section,
  target,
  onClose,
}: {
  page: string;
  section: string;
  target: any | null;
  onClose: () => void;
}) => {
  const [createItem, { isLoading: creating }] = useCreatePageContentItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdatePageContentItemMutation();
  const submitting = creating || updating;

  const [sectionValue, setSectionValue] = useState(target?.section ?? section);
  const [sortOrder, setSortOrder] = useState(String(target?.sort_order ?? 0));
  const [title, setTitle] = useState(target?.title ?? '');
  const [subtitle, setSubtitle] = useState(target?.subtitle ?? '');
  const [description, setDescription] = useState(target?.description ?? '');
  const [icon, setIcon] = useState(target?.icon ?? '');
  const [isActive, setIsActive] = useState(target?.is_active !== 0 && target?.is_active !== false);
  const [extraText, setExtraText] = useState(target?.extra ? JSON.stringify(target.extra, null, 2) : '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const existingImage = pageContentImageUrl(target?.image_path);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSection = sectionValue.trim();
    const localErrors: Record<string, string> = {};
    if (!trimmedSection) localErrors.section = 'Section is required.';

    let parsedExtra: any = null;
    if (extraText.trim()) {
      try {
        parsedExtra = JSON.parse(extraText);
      } catch (err) {
        localErrors.extra = 'Advanced fields must be valid JSON.';
      }
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.append('section', trimmedSection);
    formData.append('sort_order', String(Number(sortOrder) || 0));
    formData.append('title', title.trim());
    formData.append('subtitle', subtitle.trim());
    formData.append('description', description.trim());
    formData.append('icon', icon.trim());
    formData.append('is_active', isActive ? '1' : '0');
    formData.append('extra', parsedExtra !== null ? JSON.stringify(parsedExtra) : '');
    if (imageFile) formData.append('image', imageFile);

    let result: any;
    if (target) {
      result = await updateItem({ id: target.id, body: formData });
    } else {
      formData.append('page', page);
      result = await createItem(formData);
    }

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
        setFormError(err?.message || 'Could not save this item. Please try again.');
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
            <h2 className="text-lg font-bold text-gray-900">{target ? 'Edit Content Item' : 'New Content Item'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {PAGE_OPTIONS.find((p) => p.key === page)?.label || page} page
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                value={sectionValue}
                onChange={(e) => setSectionValue(e.target.value)}
                placeholder="e.g. about-team"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono"
              />
              {fieldErrors.section && <p className="text-xs text-red-600">{fieldErrors.section}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Users, Home, Star…"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <p className="text-[11px] text-gray-400">
                A supported name (Users, Home, Star, Award, TrendingUp, Search, ShieldCheck, Building2), or any short
                text/symbol to show as-is.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Image</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200">
                  {imagePreview || existingImage ? (
                    <img src={imagePreview || existingImage || ''} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-600 file:mr-2 file:px-2.5 file:py-1.5 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:text-xs hover:file:bg-gray-200"
                />
              </div>
              <p className="text-[11px] text-gray-400">Leave blank to keep the current image (or the built-in default).</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Advanced fields (JSON)</label>
            <textarea
              rows={4}
              value={extraText}
              onChange={(e) => setExtraText(e.target.value)}
              placeholder='e.g. { "bullets": ["Point one", "Point two"] }'
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
            />
            <p className="text-[11px] text-gray-400">
              Used for things specific to this block -- bullet lists, stat numbers, layout hints, social links.
              Leave blank if this item doesn&rsquo;t need any. Must be valid JSON.
            </p>
            {fieldErrors.extra && <p className="text-xs text-red-600">{fieldErrors.extra}</p>}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-300"
            />
            <span className="text-sm text-gray-700">Visible on the live site</span>
          </label>

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
              {submitting ? 'Saving…' : target ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED DELETE CONFIRM MODAL -- same overlay/card/red-button pattern used by
// AdminBlog.tsx's DeleteConfirmModal, generalized for both Help Topics and
// Testimonials since both are simple "delete by id" mutations.
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({
  title,
  message,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => any;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);
    const result: any = await onConfirm();
    setSubmitting(false);
    if (result?.error) {
      setError(result.error?.message || 'Could not complete this action. Please try again.');
      return;
    }
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 text-center">{title}</h2>
        <p className="text-sm text-gray-500 text-center">{message}</p>
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

export default AdminSiteContent;
