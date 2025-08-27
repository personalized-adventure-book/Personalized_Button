"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";

// Interface for footer links
interface FooterLink {
  name: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Smooth scroll handler for anchor links that works from any page
const handleAnchorClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => {
  // Only handle anchor links
  if (!href.startsWith("/#")) return;

  e.preventDefault();

  // Check if we're in the browser (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const targetId = href.substring(2); // Remove '/#'

  // Validate targetId
  if (!targetId || targetId.length === 0) {
    console.warn("Invalid target ID for anchor link:", href);
    return;
  }

  try {
    // Check if we're already on the home page
    if (window.location.pathname === "/") {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Check if scrollIntoView is supported
          if (typeof targetElement.scrollIntoView === "function") {
            try {
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } catch (scrollError) {
              // Fallback to basic scrollIntoView
              targetElement.scrollIntoView();
            }
          } else {
            // Fallback: scroll to element manually
            const elementTop = targetElement.offsetTop;
            window.scrollTo({
              top: elementTop,
              behavior: "smooth",
            });
          }
        } else {
          console.warn("Target element not found:", targetId);
        }
      });
    } else {
      // We're on a different page, navigate to home with hash
      // Store the target ID in sessionStorage so we can scroll after navigation
      sessionStorage.setItem("scrollToSection", targetId);

      // Navigate to home page
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error in handleAnchorClick:", error);
    // Ultimate fallback: simple navigation
    try {
      const fallbackUrl = href.startsWith("/") ? href : `/${href}`;
      window.location.href = fallbackUrl;
    } catch (fallbackError) {
      console.error("Fallback navigation also failed:", fallbackError);
    }
  }
};

export function Footer() {
  const { t } = useLanguage();

  // Simple click handler for anchor links
  const handleSimpleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/#") && typeof window !== "undefined") {
      e.preventDefault();
      const targetId = href.substring(2); // Remove '/#'

      if (window.location.pathname === "/") {
        // Already on home page, scroll directly
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // Store target and navigate to home
        sessionStorage.setItem("scrollToSection", targetId);
        window.location.href = "/";
      }
    }
  };

  const quickLinks: FooterLink[] = [
    { name: t("nav.customize"), href: "/customize" },
  ];

  const companyLinks: FooterLink[] = [
    { name: t("footer.contactUs"), href: "/contact" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop Layout - 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8 footer-content">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 logo-container">
              <Logo />
              <span className="font-cal-sans font-semibold text-xl text-gray-900 dark:text-white">
                MyMood Button
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("footer.contactLabel")}
              </p>
              <a
                href="mailto:personalizedprintanything@gmail.com"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                personalizedprintanything@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => link.onClick ? link.onClick(e) : handleSimpleClick(e, link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleSimpleClick(e, link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-8 footer-content">
          {/* Brand - Centered */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 logo-container">
              <Logo />
              <span className="font-cal-sans font-semibold text-xl text-gray-900 dark:text-white">
                MyMood Button
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("footer.contactLabel")}
              </p>
              <a
                href="mailto:personalizedprintanything@gmail.com"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                personalizedprintanything@gmail.com
              </a>
            </div>
          </div>

          {/* Links - Single column */}
          <div className="text-center space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t("footer.quickLinks")}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => link.onClick ? link.onClick(e) : handleSimpleClick(e, link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t("footer.company")}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {companyLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
