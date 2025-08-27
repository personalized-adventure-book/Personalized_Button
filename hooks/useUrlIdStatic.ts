"use client";

import { useRouter, usePathname } from "next/navigation";

// Client-side URL parsing without useSearchParams
function getClientUrlParams(): URLSearchParams | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search);
}
import { useEffect, useCallback, useState } from "react";

// New ID system mapping
const PRODUCT_CODES = {
  'Button': 'BT',
  'Book': 'BK',
  'Branding': 'BR',
} as const;

const LANGUAGE_CODES = {
  "🇺🇸": "1", // English
  "🇫🇷": "2", // French
  "🇮🇹": "3", // Italian
  "🇸🇦": "4", // Arabic
} as const;

// Reverse mapping: Language code to flag
const CODE_TO_LANGUAGE_MAP = {
  "1": "🇺🇸", // English
  "2": "🇫🇷", // French
  "3": "🇮🇹", // Italian
  "4": "🇸🇦", // Arabic
} as const;

// Valid ID patterns
const ID_PATTERN = /^(BT|BK|BR|SG)[1-4]$/i;

export function useUrlId() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Get search params on client side
  const getSearchParams = useCallback(() => {
    return getClientUrlParams();
  }, []);

  // Get the current ID from URL
  const urlId = mounted ? getSearchParams()?.get('id') : null;

  // State to track the current ID
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize ID from URL or sessionStorage on client side
  useEffect(() => {
    if (!mounted) return;
    
    if (urlId) {
      // Validate the ID format
      if (ID_PATTERN.test(urlId)) {
        sessionStorage.setItem('current-id', urlId.toUpperCase());
        setCurrentId(urlId.toUpperCase());
      } else {
        // Fallback to default Button English
        const defaultId = 'BT1';
        sessionStorage.setItem('current-id', defaultId);
        setCurrentId(defaultId);
      }
    } else {
      const storedId = sessionStorage.getItem('current-id');
      if (storedId && ID_PATTERN.test(storedId)) {
        setCurrentId(storedId);
      } else {
        // Set default if no valid stored ID
        const defaultId = 'BT1';
        sessionStorage.setItem('current-id', defaultId);
        setCurrentId(defaultId);
      }
    }
  }, [urlId, mounted]);

  // Function to navigate with ID preserved
  const navigateWithId = useCallback((path: string) => {
    if (!mounted) return;
    
    const id = getCurrentId();
    if (id && ID_PATTERN.test(id)) {
      router.push(`${path}?id=${id}`);
    } else {
      router.push(path);
    }
  }, [router, mounted]);

  // Function to get current ID (from URL or sessionStorage)
  const getCurrentId = useCallback(() => {
    if (!mounted) return null;
    
    const id = urlId || sessionStorage.getItem('current-id');
    return id && ID_PATTERN.test(id) ? id.toUpperCase() : 'BT1';
  }, [urlId, mounted]);

  // Parse ID into product type and language
  const parseId = useCallback((id: string | null): { productType: string; language: string } => {
    if (!id || !ID_PATTERN.test(id)) {
      return { productType: 'BT', language: '1' };
    }
    
    const upperCaseId = id.toUpperCase();
    const productType = upperCaseId.substring(0, 2);
    const language = upperCaseId.substring(2);
    
    return { productType, language };
  }, []);

  // Create new ID from product type and language
  const createId = useCallback((productType: string, language: string): string => {
    return `${productType.toUpperCase()}${language}`;
  }, []);

  // Get language flag from current ID
  const getLanguageFromId = useCallback((id: string | null): string => {
    if (!id) return "🇺🇸"; // Default to English
    
    const { language } = parseId(id);
    return CODE_TO_LANGUAGE_MAP[language as keyof typeof CODE_TO_LANGUAGE_MAP] || "🇺🇸";
  }, [parseId]);

  // Update URL with new ID based on language selection
  const updateUrlForLanguage = useCallback((languageFlag: string) => {
    if (!mounted) return;
    
    const currentIdStr = getCurrentId();
    
    if (currentIdStr) {
      const { productType } = parseId(currentIdStr);
      const newLanguageCode = LANGUAGE_CODES[languageFlag as keyof typeof LANGUAGE_CODES] || "1";
      const newId = createId(productType, newLanguageCode);
      
      // Only update if the ID actually changes
      if (newId !== currentIdStr) {
        // Update local state immediately for instant UI response
        setCurrentId(newId);
        
        // Update sessionStorage immediately
        sessionStorage.setItem('current-id', newId);
        
        // Preserve the complete current URL structure - only update the id parameter
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('id', newId);
        
        // Use history.replaceState to update URL without triggering navigation
        window.history.replaceState(window.history.state, '', currentUrl.toString());
      }
    }
  }, [mounted, getCurrentId, parseId, createId]);

  // Update URL with new ID based on product type selection
  const updateUrlForProduct = useCallback((productType: 'Button' | 'Book' | 'Branding') => {
    if (!mounted) return;
    
    const currentIdStr = getCurrentId();
    
    if (currentIdStr) {
      const { language } = parseId(currentIdStr);
      const newProductCode = PRODUCT_CODES[productType];
      const newId = createId(newProductCode, language);
      
      // Only update if the ID actually changes
      if (newId !== currentIdStr) {
        // Update local state immediately for instant UI response
        setCurrentId(newId);
        
        // Update sessionStorage immediately
        sessionStorage.setItem('current-id', newId);
        
        // Preserve the complete current URL structure - only update the id parameter
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('id', newId);
        
        // Use history.replaceState to update URL without triggering navigation
        window.history.replaceState(window.history.state, '', currentUrl.toString());
      }
    }
  }, [mounted, getCurrentId, parseId, createId]);

  // Function to update URL with ID if missing but ID exists in sessionStorage
  const ensureIdInUrl = useCallback(() => {
    if (!mounted) return;
    
    const storedId = sessionStorage.getItem('current-id');
    if (storedId && ID_PATTERN.test(storedId) && !urlId) {
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set('id', storedId);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [urlId, getSearchParams, pathname, router, mounted]);

  // Get product type from current ID
  const getProductTypeFromId = useCallback((id: string | null): 'Button' | 'Book' | 'Branding' | 'Song' => {
    if (!id) return 'Button';
    
    const { productType } = parseId(id);
    
    switch (productType) {
      case 'BK': return 'Book';
      case 'BR': return 'Branding';
      case 'SG': return 'Song';
      case 'BT':
      default: return 'Button';
    }
  }, [parseId]);

  return {
    id: currentId,
    mounted,
    navigateWithId,
    ensureIdInUrl,
    updateUrlForLanguage,
    updateUrlForProduct,
    getCurrentId,
    getLanguageFromId,
    getProductTypeFromId,
    parseId,
    createId
  };
}
