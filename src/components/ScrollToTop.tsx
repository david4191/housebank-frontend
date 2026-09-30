import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation the way a
 * real page load does (Joan, Sep 2026 -- "when I click on a menu
 * [link] in the footer it opens the page but it starts from the bottom
 * of the page"). Every footer link is a react-router <Link>, and the
 * footer sits at the bottom of long pages -- clicking one navigates
 * client-side while still scrolled to the bottom, and the browser
 * happily keeps that same scroll position on the new route. Mounted
 * once in App.tsx, inside the Router, so every route change resets to
 * the top like a normal page load would.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
