import { useGetPageQuery } from '../redux/housebank.ts';

/**
 * Real Anti-discrimination page (Joan, Sep 2026 -- "the website contents
 * are meant to come from the admin, but stored in the DB"). This used to
 * be 100% hardcoded JSX text with no connection to the CMS at all. Now it
 * fetches the admin-authored page (slug "anti-discrimination") from
 * GET /content/pages/:slug and renders the real title/content_html, with
 * an honest state for when the page hasn't been seeded/published yet
 * instead of crashing or going blank.
 *
 * Note: this file's name has a pre-existing typo ("Discrimniation")
 * that's left as-is since other files reference it by this path.
 */
const AntiDiscriminationPageContent = () => {
  const { data: page, isLoading, isError } = useGetPageQuery('anti-discrimination');

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-500">
          Loading…
        </div>
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Anti Discrimination</h1>
          <p className="text-gray-600">
            This page hasn't been published yet. Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
        </div>

        {/* Admin-authored HTML from the CMS, same trust level as the
            rest of this platform's content_html fields. */}
        <div
          className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content_html || '' }}
        />
      </div>
    </div>
  );
};

export default AntiDiscriminationPageContent;
