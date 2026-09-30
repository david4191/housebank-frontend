import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.tsx';
import type { HouseBankRole } from '../context/AuthContext.tsx';

/**
 * Layout-style route guard — wrap a GROUP of routes with
 * `<Route element={<RequireAuth roles={['agent']} />}>...child routes.../Route>`
 * rather than wrapping each page individually. Previously this component
 * existed but was never actually used anywhere in App.tsx, which meant every
 * customer/agent/company/admin dashboard route was reachable by anyone who
 * typed the URL, signed in or not.
 *
 * - No `roles` prop: any signed-in user may pass.
 * - `roles` given: only a signed-in user whose account role is in the list
 *   may pass — this is what keeps a customer out of /admin/* and an agent
 *   out of /company/* even if they guess the URL.
 */
export const RequireAuth: React.FC<{ roles?: HouseBankRole[] }> = ({ roles }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(auth.user.role)) {
    // Signed in, just not allowed here — send them to their own dashboard
    // rather than back to sign-in (they don't need to log in again).
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
