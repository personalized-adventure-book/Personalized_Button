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

// Simple scroll function
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 64;
    const elementPosition = element.offsetTop - headerHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

// Simple click handler for navigation
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  // Check if it's an anchor link to a section
  if (href.startsWith('/#')) {
    e.preventDefault();
    const sectionId = href.substring(2); // Remove '/#'
    
    // Check if we're on the home page
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === "/" || currentPath === "/Personalized_Button/" || currentPath.endsWith("/Personalized_Button");
    
    if (isHomePage) {
      // We're on home page, just scroll to the section
      scrollToSection(sectionId);
    } else {
      // We're on a different page, navigate to home with hash
      const homeUrl = window.location.pathname.includes('/Personalized_Button') 
        ? `/Personalized_Button/#${sectionId}` 
        : `/#${sectionId}`;
      window.location.href = homeUrl;
    }
  }
  // For non-anchor links, let the Link component handle navigation normally
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

  // Handle URL hash scrolling on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove '#'
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, []);

  // Main navigation items
  const navigation = [
    { name: t("nav.features"), href: "/#features" },
    { name: t("nav.howItWorks"), href: "/#how_it_works" },
    { name: t("nav.gallery"), href: "/#examples" },
    { name: t("nav.pricing"), href: "/#book_options" },
    { name: t("nav.customize"), href: "/customize" },
    { name: t("nav.orders"), href: "/orders" },
  ];

  // Short navigation for tablets
  const shortNavigation = [
    { name: t("nav.features"), href: "/#features" },
    { name: t("nav.how"), href: "/#how_it_works" },
    { name: t("nav.gallery"), href: "/#examples" },
    { name: t("nav.pricing"), href: "/#book_options" },
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
            className="flex items-center space-x-3 group logo-container"
          >
            <Logo />
            <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
              {t("brand.name")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 header-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
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
                onClick={(e) => handleNavClick(e, item.href)}
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
                        setLanguage(code as Language);
                        setIsLanguageOpen(false);
                        updateUrlForLanguage(code as Language);
                        trackLanguageChange(oldLanguage, code);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === code ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                trackThemeChange(theme === 'light' ? 'dark' : 'light');
              }}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200 py-2"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                  <div className="flex space-x-2">
                    {Object.entries(flags).map(([flag, code]) => (
                      <button
                        key={code}
                        onClick={() => {
                          const oldLanguage = language;
                          setLanguage(code as Language);
                          updateUrlForLanguage(code as Language);
                          trackLanguageChange(oldLanguage, code);
                        }}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          language === code 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {flag} {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
