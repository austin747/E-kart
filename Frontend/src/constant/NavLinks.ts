/**
 * Constant Layer – NavLinks.ts
 */

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#" },
  { label: "Shop", href: "#products-section" },
  { label: "Deals", href: "#deals" },
  { label: "About", href: "#about" },
];