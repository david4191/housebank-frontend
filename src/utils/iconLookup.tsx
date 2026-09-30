import type { ComponentType } from 'react';
import { Users, Home, Star, Award, TrendingUp, Search, ShieldCheck, Building2 } from 'lucide-react';

/**
 * Maps an icon NAME string (as stored in page_content_items.icon) to an
 * actual Lucide icon component, so admins can pick an icon by name in
 * the Page Content manager without giving them raw SVG/markup access.
 *
 * Deliberately small and closed: only names that currently show up in
 * the seeded content (migration 015) plus a few obvious extras. A name
 * that isn't in this map (or isn't a lucide icon at all -- e.g. the "₦"
 * naira sign used as a literal glyph on the Realtor landing page's stat
 * card) falls back to being rendered as plain text by renderIcon below,
 * which is exactly what the original hardcoded JSX did for that case.
 */
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Users,
  Home,
  Star,
  Award,
  TrendingUp,
  Search,
  ShieldCheck,
  Building2,
};

export function getIconComponent(name?: string | null): ComponentType<{ className?: string }> | null {
  if (!name) return null;
  return ICONS[name] || null;
}

/** Renders a stored icon value as a Lucide icon when recognized, otherwise as plain text (e.g. "₦"). */
export function renderIcon(name: string | null | undefined, className = 'w-8 h-8') {
  const Icon = getIconComponent(name);
  if (Icon) return <Icon className={className} />;
  if (name) return <span className={className.includes('text-') ? className : `${className} inline-flex items-center justify-center font-bold`}>{name}</span>;
  return null;
}
