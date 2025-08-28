"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useUrlId } from "../hooks/useUrlIdStatic";
import { useTracking } from "./TrackingProvider";
import { useStaticContent } from "@/hooks/useStaticContent";

// Custom hook for header visibility
const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Minimum scroll threshold to avoid jitter
      if (Math.abs(scrollY - lastScrollY) < 10) {
        return;
      }

      let newVisibility = isVisible;
      
      // Show header when at top (first 100px)
      if (scrollY <= 100) {
        newVisibility = true;
      } 
      // Hide header when scrolling down past 100px
      else if (scrollY > lastScrollY && scrollY > 100) {
        newVisibility = false;
      }
      // Show header when scrolling up
      else if (scrollY < lastScrollY) {
        newVisibility = true;
      }
      
      if (newVisibility !== isVisible) {
        setIsVisible(newVisibility);
      }
      
      setLastScrollY(scrollY);
    };

    // Throttle scroll events
    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollDirection, 10);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateScrollDirection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY, isVisible]);

  return { isVisible };
};

// Simple scroll function
const scrollToSection = (sectionId: string) => {
  // console.debug(`scrollToSection called with: ${sectionId}`);
  
  // Debug: List all available sections
  const allSections = document.querySelectorAll('section[id]');
  // console.debug(`Available sections:`, Array.from(allSections).map(s => s.id));
  
  const element = document.getElementById(sectionId);
  if (element) {
  // console.debug(`Element found: ${sectionId}`);
    const headerHeight = 64; // Fixed header height
    const elementPosition = element.offsetTop - headerHeight;
  // console.debug(`Scrolling to position: ${elementPosition}`);
    
    // Try multiple scroll methods
    try {
      // Use window.scrollTo for more reliable results with fixed header
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
  // console.debug(`scrollTo executed for: ${sectionId}`);
    } catch (error) {
      console.error(`❌ scrollTo failed:`, error);
      // Fallback to scrollIntoView
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  } else {
  // console.warn(`Element not found: ${sectionId}`);
  // console.debug(`Looking for alternative IDs...`);
    
    // Try alternative IDs
    const alternatives = [
      sectionId.replace('-', '_'),
      sectionId.replace('_', '-'),
      sectionId.toLowerCase(),
      sectionId.toUpperCase()
    ];
    
    for (const altId of alternatives) {
      const altElement = document.getElementById(altId);
      if (altElement) {
  // console.debug(`Found alternative: ${altId}`);
        const headerHeight = 64;
        const elementPosition = altElement.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
        return;
      }
    }
    
    console.error(`❌ No element found for: ${sectionId} or alternatives`);
  }
};

// Order-based navigation - scroll to sections based on menu item order
const handleOrderBasedNavigation = (e: React.MouseEvent<HTMLAnchorElement>, itemIndex: number) => {
  // console.debug(`Order-based navigation clicked. Index: ${itemIndex}`);
  e.preventDefault();
  e.stopPropagation();
  
  // Define the order of sections as they appear on the homepage
  const sectionsInOrder = [
    'gallery',       // 1st menu item: Gallery (appears 3rd in homepage)
    'features',      // 2nd menu item: Features (appears 5th in homepage)
    'how-it-works',  // 3rd menu item: How It Works (appears 10th in homepage)
    'pricing'        // 4th menu item: Pricing (appears 12th in homepage)
  ];
  
  // Get the section ID based on the menu item order
  const targetSectionId = sectionsInOrder[itemIndex];
  
  // console.debug(`Target section: ${targetSectionId} for index ${itemIndex}`);
  
  if (!targetSectionId) {
    console.warn(`No section defined for menu item at index ${itemIndex}`);
    return;
  }
  
  // Check if we're on the home page
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === "/" || currentPath === "/Personalized_Button/" || currentPath.endsWith("/Personalized_Button");
  
  // console.debug(`Current path: ${currentPath}, isHomePage: ${isHomePage}`);
  
  if (isHomePage) {
    // We're on home page, scroll to the section
  // console.debug(`Scrolling to section: ${targetSectionId}`);
    // Add a small delay to ensure the page is fully loaded
    setTimeout(() => {
      scrollToSection(targetSectionId);
    }, 100);
  } else {
    // We're on a different page, navigate to home with hash
  // console.debug(`Navigating to home with section: ${targetSectionId}`);
    const homeUrl = window.location.pathname.includes('/Personalized_Button') 
      ? `/Personalized_Button/#${targetSectionId}` 
      : `/#${targetSectionId}`;
    window.location.href = homeUrl;
  }
};

// Simple click handler for non-ordered navigation (customize, orders, etc.)
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

const languageOptions = [
  { flag: "🇺🇸", code: "EN", value: "🇺🇸" },
  { flag: "🇫🇷", code: "FR", value: "🇫🇷" }, 
  { flag: "🇮🇹", code: "IT", value: "🇮🇹" },
  { flag: "🇸🇦", code: "AR", value: "🇸🇦" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { handleNavigation, autoSaveProgress } = useNavigationGuard();
  const { getLanguageFromId, getCurrentId } = useUrlId();
  const { trackLanguageChange, trackThemeChange } = useTracking();
  const { getContent } = useStaticContent();
  const { isVisible } = useScrollDirection();

  // Get current content based on the URL ID
  const currentId = getCurrentId();
  const content = getContent(currentId || '');
  const menu = content?.homepage?.menu || {};

  // Derive brand name with robust fallbacks
  const rawBrandName = content?.homepage?.hero?.title || t("brand.name");
  const brandName = rawBrandName === 'brand.name' ? 'MyMood' : rawBrandName;

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
  setTimeout(() => scrollToSection(sectionId), 50);
    }
  }, []);

  // Main navigation items - order-based navigation for first 4 items
  const navigation = [
    { name: menu.examples || t("nav.gallery"), href: "/#gallery", isOrderBased: true },        // Index 0 → gallery
    { name: menu.features || t("nav.features"), href: "/#features", isOrderBased: true },       // Index 1 → features
    { name: menu.howItWorks || t("nav.howItWorks"), href: "/#how-it-works", isOrderBased: true },        // Index 2 → how-it-works
    { name: menu.pricing || t("nav.pricing"), href: "/#pricing", isOrderBased: true },         // Index 3 → pricing
    { name: menu.order || t("nav.customize"), href: "/customize", isOrderBased: false },     // Regular navigation
    { name: menu.orders || t("nav.orders"), href: "/orders", isOrderBased: false },           // Regular navigation
  ];

  // Short navigation for tablets
  const shortNavigation = [
    { name: menu.examples || t("nav.gallery"), href: "/#gallery", isOrderBased: true },        // Index 0 → gallery
    { name: menu.features || t("nav.features"), href: "/#features", isOrderBased: true },       // Index 1 → features
    { name: menu.howItWorks || t("nav.how"), href: "/#how-it-works", isOrderBased: true },               // Index 2 → how-it-works
    { name: menu.pricing || t("nav.pricing"), href: "/#pricing", isOrderBased: true },         // Index 3 → pricing
    { name: menu.order || t("nav.order"), href: "/customize", isOrderBased: false },         // Regular navigation
    { name: menu.orders || t("nav.orders"), href: "/orders", isOrderBased: false },           // Regular navigation
  ];

  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Auto-close on scroll or outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      // Close if user scrolls more than small threshold
      if (Math.abs(window.scrollY - lastScrollY) > 5) {
        setIsMenuOpen(false);
      }
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (headerRef.current && headerRef.current.contains(target)) {
        // Click inside header/menu -> ignore
        return;
      }
      setIsMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, true);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isMenuOpen]);

  // Close menu if window resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Use currentId we already derived above for product context

  return (
    <header 
      ref={headerRef}
      className={`header-optimized header-backdrop ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${language === '🇸🇦' ? 'arabic-header' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* Logo (preserve current id to keep correct product context on home) */}
          <Link
            href={currentId ? `/?id=${currentId}` : '/'}
            className={`flex items-center group logo-container ${language === '🇸🇦' ? 'gap-6' : 'space-x-3'}`}
            prefetch={false}
            onClick={(e) => {
              // If already on home with same id avoid full navigation
              if (typeof window !== 'undefined') {
                const target = currentId ? `/?id=${currentId}` : '/';
                if (window.location.pathname === '/' && (!currentId || window.location.search.includes(`id=${currentId}`))) {
                  e.preventDefault();
                }
              }
            }}
          >
            <Logo />
            <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
              {brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center justify-center flex-1 max-w-4xl mx-8 header-nav">
            <div className="navigation-container flex items-center justify-between w-full">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => 
                    item.isOrderBased 
                      ? handleOrderBasedNavigation(e, index)
                      : handleNavClick(e, item.href)
                  }
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200 whitespace-nowrap px-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Large Tablet Navigation - All items with smaller text */}
          <nav className="hidden lg:flex xl:hidden items-center justify-center flex-1 max-w-4xl mx-6 header-nav">
            <div className="navigation-container flex items-center justify-between w-full">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => 
                    item.isOrderBased 
                      ? handleOrderBasedNavigation(e, index)
                      : handleNavClick(e, item.href)
                  }
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200 whitespace-nowrap px-1 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Controls */}
          <div className={`flex items-center language-controls ${language === '🇸🇦' ? 'space-x-6' : 'space-x-4'}`}>
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
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        // console.debug('Language change clicked:', option.code, '→', option.value);
                        const oldLanguage = language;
                        // console.debug('Current language before:', oldLanguage);
                        setLanguage(option.value as Language);
                        setIsLanguageOpen(false);
                        trackLanguageChange(oldLanguage, option.code);
                        // console.debug('Language change completed');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === option.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{option.flag}</span>
                      <span>{option.code}</span>
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
                // Auto-close hamburger if open
                setIsMenuOpen(false);
              }}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button (use pointerdown for snappier touch response) */}
            <button
              onPointerDown={(e) => {
                // Prevent potential 300ms click delay on some browsers
                e.preventDefault();
                setIsMenuOpen((v) => !v);
              }}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100 touch-manipulation select-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu (instant mount/unmount for zero lag) */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-3"
          >
            <nav className="flex flex-col space-y-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.isOrderBased) {
                      handleOrderBasedNavigation(e, index);
                    } else {
                      handleNavClick(e, item.href);
                    }
                    // Close immediately to keep UI responsive
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-150 py-2"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-start">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("header.language")}</span>
                  <div
                    className={`flex items-center ${language === '🇸🇦' ? 'flex-row-reverse mr-4' : 'ml-4'} gap-1 overflow-x-auto scrollbar-none max-w-full`}
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          const oldLanguage = language;
                          setLanguage(option.value as Language);
                          trackLanguageChange(oldLanguage, option.code);
                          setIsMenuOpen(false);
                        }}
                        className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 whitespace-nowrap ${
                          language === option.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-pressed={language === option.value}
                        aria-label={`Switch language to ${option.code}`}
                      >
                        <span>{option.flag}</span>
                        <span className="font-medium tracking-wide">{option.code}</span>
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
