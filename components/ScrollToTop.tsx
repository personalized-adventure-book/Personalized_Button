"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
  // Scroll to top on route changes, except for home where we restore saved scroll
  if (typeof window === 'undefined') return;
  const p = pathname || '/';
  const isHome = p === '/' || p === '/Personalized_Button' || p === '/Personalized_Button/';
  if (isHome) return; // allow homepage to restore its own scroll position
  window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
