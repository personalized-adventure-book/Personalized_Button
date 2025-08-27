"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useUrlId } from "../hooks/useUrlIdStatic";
import { useTracking } from "./TrackingProvider";

// Interface for navigation items
interface NavigationItem {
  name: string;
  href: string;
  section?: string; // Optional section for smart navigation
}

// Smart navigation handler that finds the best available section
const handleSmartNavigation = (
  e: React.MouseEvent<HTMLAnchorElement>,
  targetSection: string,
  autoSaveProgress?: () => void,
) => {
  console.log(`🎯 handleSmartNavigation called for: ${targetSection}`);
  e.preventDefault();

  // Check if we're in the browser (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.log("⚠️ Not in browser environment");
    return;
  }

  // Auto-save if function is provided (but don't wait for it)
  if (autoSaveProgress) {
    try {
      autoSaveProgress();
    } catch (error) {
      console.log('Auto-save failed, but continuing navigation:', error);
    }
  }

  // Define fallback sections for each navigation item
  const sectionFallbacks: { [key: string]: string[] } = {
    'features': ['features', 'about', 'hero'],
    'how-it-works': ['how_it_works', 'how-it-works', 'features', 'about'],
    'examples': ['examples', 'gallery', 'book_examples', 'adventure_possibilities', 'features'],
    'gallery': ['gallery', 'examples', 'book_examples', 'adventure_possibilities', 'features'],
    'pricing': ['pricing', 'book_options', 'features'],
  };

  try {
    // Check if we're already on the home page
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === "/" || currentPath === "/Personalized_Button/" || currentPath.endsWith("/Personalized_Button");
    
    console.log(`📍 Current path: ${currentPath}, isHomePage: ${isHomePage}`);
    
    if (isHomePage) {
      // We're on home page, find the best available section
      const fallbacks = sectionFallbacks[targetSection] || [targetSection];
      let targetElement = null;
      let finalTargetId = targetSection;

      console.log(`🔍 Searching for sections: ${fallbacks.join(', ')}`);

      for (const sectionId of fallbacks) {
        targetElement = document.getElementById(sectionId);
        if (targetElement) {
          finalTargetId = sectionId;
          console.log(`✅ Found section: ${sectionId}`);
          break;
        } else {
          console.log(`❌ Section not found: ${sectionId}`);
        }
      }

      if (targetElement) {
        const headerHeight = 64;
        const elementPosition = targetElement.offsetTop - headerHeight;
        console.log(`🚀 Scrolling to: ${finalTargetId}, position: ${elementPosition}`);
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      } else {
        console.warn(`No fallback section found for ${targetSection}`);
      }
    } else {
      // We're on a different page, navigate to home with the primary target
      console.log(`Navigating from ${currentPath} to home page with section: ${targetSection}`);
      
      // Store the target section for when we arrive at homepage
      sessionStorage.setItem("scrollToSection", targetSection);
      
      // Navigate to home page
      const homeUrl = window.location.pathname.includes('/Personalized_Button') 
        ? `/Personalized_Button/` 
        : `/`;
      
      window.location.href = homeUrl;
    }
  } catch (error) {
    console.error("Error in handleSmartNavigation:", error);
    // Ultimate fallback: navigate to home page
    window.location.href = "/";
  }
};

// Smooth scroll handler for anchor links that works from any page
const handleAnchorClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  autoSaveProgress?: () => void,
) => {
  // Only handle anchor links
  if (!href.startsWith("/#")) return;

  e.preventDefault();

  // Check if we're in the browser (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // Auto-save if function is provided (but don't wait for it)
  if (autoSaveProgress) {
    try {
      autoSaveProgress();
    } catch (error) {
      console.log('Auto-save failed, but continuing navigation:', error);
    }
  }

  const targetId = href.substring(2); // Remove '/#'

  // Validate targetId
  if (!targetId || targetId.length === 0) {
    console.warn("Invalid target ID for anchor link:", href);
    return;
  }

  try {
    // Check if we're already on the home page
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === "/" || currentPath === "/Personalized_Button/" || currentPath.endsWith("/Personalized_Button");
    
    if (isHomePage) {
      // We're on home page, just scroll to the section
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = 64;
        const elementPosition = targetElement.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    } else {
      // We're on a different page, navigate to home with hash immediately
      console.log(`Navigating from ${currentPath} to home page with section: ${targetId}`);
      
      // Navigate immediately to home page with hash
      const homeUrl = window.location.pathname.includes('/Personalized_Button') 
        ? `/Personalized_Button/#${targetId}` 
        : `/#${targetId}`;
      
      // Use window.location.href for immediate navigation
      window.location.href = homeUrl;
    }
  } catch (error) {
    console.error("Error in handleAnchorClick:", error);
    // Ultimate fallback: navigate to home page
    window.location.href = "/";
  }
};

const flags = {
  "🇺🇸": "EN",
  "🇫🇷": "FR", 
  "🇮🇹": "IT",
  "🇸🇦": "AR",
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { handleNavigation, autoSaveProgress } = useNavigationGuard();
  const { updateUrlForLanguage, getLanguageFromId, getCurrentId } = useUrlId();
  const { trackLanguageChange, trackThemeChange } = useTracking();

  // Auto-detect language from URL ID if it doesn't match current language
  useEffect(() => {
    const currentId = getCurrentId();
    if (currentId) {
      const detectedLanguage = getLanguageFromId(currentId);
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage as Language);
      }
    }
  }, [getCurrentId, getLanguageFromId, setLanguage, language]);

  // Handle cross-page navigation scrolling
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const scrollToSection = sessionStorage.getItem("scrollToSection");
    if (scrollToSection) {
      // Clear the stored section ID
      sessionStorage.removeItem("scrollToSection");
      
      // Define the same fallback sections as in smart navigation
      const sectionFallbacks: { [key: string]: string[] } = {
        'features': ['features', 'about', 'hero'],
        'how-it-works': ['how_it_works', 'how-it-works', 'features', 'about'],
        'examples': ['examples', 'gallery', 'book_examples', 'adventure_possibilities', 'features'],
        'gallery': ['gallery', 'examples', 'book_examples', 'adventure_possibilities', 'features'],
        'pricing': ['pricing', 'book_options', 'features'],
      };
      
      // Scroll to the section after a short delay to ensure the page is loaded
      setTimeout(() => {
        const fallbacks = sectionFallbacks[scrollToSection] || [scrollToSection];
        let targetElement = null;

        for (const sectionId of fallbacks) {
          targetElement = document.getElementById(sectionId);
          if (targetElement) {
            break;
          }
        }

        if (targetElement) {
          const headerHeight = 64;
          const elementPosition = targetElement.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  // Smart click handler that uses intelligent section detection
  const smartHandleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetSection?: string,
    additionalAction?: () => void,
  ) => {
    try {
      // For smart navigation (when targetSection is provided)
      if (targetSection) {
        console.log(`Smart navigation: ${targetSection}`);
        handleSmartNavigation(e, targetSection, autoSaveProgress);
      }
      // For anchor links, auto-save and use the anchor handler
      else if (href.startsWith('/#')) {
        console.log(`Anchor navigation: ${href}`);
        handleAnchorClick(e, href, autoSaveProgress);
      } else {
        // For regular navigation, just auto-save and let Link handle it
        console.log(`Regular navigation: ${href}`);
        handleNavigation(href);
        // Don't prevent default for Link navigation
      }
      
      if (additionalAction) {
        additionalAction();
      }
    } catch (error) {
      console.error("Smart click handler caught error:", error);
      // Fallback: allow default navigation
      if (additionalAction) {
        additionalAction();
      }
    }
  };

  const navigation: NavigationItem[] = [
    { name: t("nav.features"), href: "/#features", section: "features" },
    { name: t("nav.howItWorks"), href: "/#how-it-works", section: "how-it-works" },
    { name: t("nav.gallery"), href: "/#examples", section: "examples" },
    { name: t("nav.pricing"), href: "/#pricing", section: "pricing" },
    { name: t("nav.customize"), href: "/customize" },
    { name: t("nav.orders"), href: "/orders" },
  ];

  const shortNavigation: NavigationItem[] = [
    { name: t("nav.features"), href: "/#features", section: "features" },
    { name: t("nav.how"), href: "/#how-it-works", section: "how-it-works" },
    { name: t("nav.gallery"), href: "/#examples", section: "examples" },
    { name: t("nav.pricing"), href: "/#pricing", section: "pricing" },
    { name: t("nav.order"), href: "/customize" },
    { name: t("nav.orders"), href: "/orders" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => smartHandleClick(e, "/")}
            className="flex items-center space-x-3 group logo-container"
          >
            <Logo />
            <span className="font-cal-sans font-semibold text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
              MyMood Button
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 header-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => smartHandleClick(e, item.href, item.section)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation */}
          <nav className="hidden md:flex lg:hidden items-center space-x-6">
            {shortNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => smartHandleClick(e, item.href, item.section)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4 language-controls">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                aria-label="Select language"
              >
                <span className="text-lg">{language}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 py-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  {Object.entries(flags).map(([flag, code]) => (
                    <button
                      key={code}
                      onClick={() => {
                        const oldLanguage = language;
                        // Set the language (this will trigger updateUrlForLanguage via LanguageContext)
                        setLanguage(flag as Language);
                        setIsLanguageOpen(false);
                        // Track language change
                        trackLanguageChange(oldLanguage, flag);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <span className="text-lg mr-2">{flag}</span>
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const oldTheme = theme;
                toggleTheme();
                const newTheme = oldTheme === 'light' ? 'dark' : 'light';
                trackThemeChange(oldTheme, newTheme);
              }}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors duration-200"
                  onClick={(e) =>
                    smartHandleClick(e, item.href, item.section, () => setIsMenuOpen(false))
                  }
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-medium">Language:</span>
                  <div className="flex space-x-2">
                    {Object.entries(flags).map(([flag, code]) => (
                      <button
                        key={code}
                        onClick={() => {
                          const oldLanguage = language;
                          // Set the language (this will trigger updateUrlForLanguage via LanguageContext)
                          setLanguage(flag as Language);
                          // Track language change
                          trackLanguageChange(oldLanguage, flag);
                        }}
                        className={`text-lg p-1 rounded ${language === flag ? "bg-primary/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition-colors duration-200`}
                      >
                        {flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
