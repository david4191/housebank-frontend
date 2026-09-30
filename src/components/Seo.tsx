import { useEffect } from 'react';

const SITE_NAME = 'HouseBank';
const DEFAULT_DESCRIPTION =
  'HouseBank is a real estate and property-investment marketplace — browse verified listings, buy, rent, or invest in property, and connect with realtors and companies, all in one place.';
const DEFAULT_IMAGE_PATH = '/og-image.png';

interface SeoProps {
  /** Page-specific title. Rendered as "<title> | HouseBank". Omit to use the site default title. */
  title?: string;
  /** Page-specific meta description (~150-160 chars is ideal). Falls back to a site-wide default. */
  description?: string;
  /** Canonical path for this page, e.g. "/explore" or `/property-details/${id}`. Defaults to the current URL path. */
  path?: string;
  /** Absolute or root-relative OG/Twitter image path. Defaults to the site's shared OG image. */
  image?: string;
  /** Set true for pages that shouldn't be indexed (auth forms, invite-only onboarding links, etc.). */
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-route SEO tags for this Vite SPA (Joan, Sep 2026: "add meta tags
 * and run seo on the pages"). There's no server-side rendering here, so
 * a <head>-manipulating library like react-helmet buys nothing beyond
 * what a plain effect can do -- this just upserts (creates once, then
 * updates in place on navigation) <title>, description, canonical,
 * robots, and the Open Graph / Twitter Card tags every page needs for
 * search results and link-preview cards. index.html carries the
 * site-wide fallback versions of these same tags for crawlers/bots that
 * don't execute JS at all; this overrides them per-route for everyone
 * else (including Google, which does render JS).
 */
export default function Seo({ title, description, path, image, noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Real Estate & Property Investment Marketplace`;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    const origin = window.location.origin;
    const canonicalUrl = `${origin}${path ?? window.location.pathname}`;
    upsertLink('canonical', canonicalUrl);

    const imageUrl = `${origin}${image || DEFAULT_IMAGE_PATH}`;
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, noindex]);

  return null;
}
