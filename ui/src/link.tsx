"use client";

import { createContext, useContext, type ComponentType, type ReactNode } from "react";

type LinkLike = ComponentType<{ href: string; className?: string; children?: ReactNode; [key: string]: unknown }> | "a";

const LinkContext = createContext<LinkLike>("a");

/**
 * Makes every Stylhero link (Link, Breadcrumbs, SideNav, AppBar, ListItem) render your router's link.
 * In Next.js: `<LinkProvider component={NextLink}>` in app/layout.tsx.
 */
export function LinkProvider({ component, children }: { component: LinkLike; children: ReactNode }) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

export const useLinkComponent = () => useContext(LinkContext);
