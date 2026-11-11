"use client";

import { createContext, useContext, type ElementType, type ReactNode } from "react";

/**
 * Any component that renders a link from `href`, `className` and `children` (next/link,
 * react-router's Link, "a"). Typed loosely on purpose: router link types differ across
 * @types/react 18 and 19 (next/link's propTypes fail a stricter ComponentType check).
 */
export type LinkLike = ElementType;

const LinkContext = createContext<LinkLike>("a");

/**
 * Makes every Stylhero link (Link, Breadcrumbs, SideNav, AppBar, ListItem) render your router's link.
 * In Next.js: `<LinkProvider component={NextLink}>` in app/layout.tsx.
 */
export function LinkProvider({ component, children }: { component: LinkLike; children: ReactNode }) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

export const useLinkComponent = () => useContext(LinkContext);
