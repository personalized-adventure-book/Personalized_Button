"use client";

import { useState, useEffect, useCallback } from 'react';
import { LocalContentData } from './useLocalContent';

// Import all content files
import buttonEnglish from '@/JSONS/Button/ENGLISH.json';
import buttonFrench from '@/JSONS/Button/FRENCH.json';
import buttonItalian from '@/JSONS/Button/ITALIAN.json';
import buttonArabic from '@/JSONS/Button/ARABIC.json';

import bookEnglish from '@/JSONS/Book/ENGLISH.json';
import bookFrench from '@/JSONS/Book/FRENCH.json';
import bookItalian from '@/JSONS/Book/ITALIAN.json';
import bookArabic from '@/JSONS/Book/ARABIC.json';

import brandingEnglish from '@/JSONS/Branding/ENGLISH.json';
import brandingFrench from '@/JSONS/Branding/FRENCH.json';
import brandingItalian from '@/JSONS/Branding/ITALIAN.json';
import brandingArabic from '@/JSONS/Branding/ARABIC.json';
// Song content
import songEnglish from '@/JSONS/Song/ENGLISH.json';
import songFrench from '@/JSONS/Song/FRENCH.json';
import songItalian from '@/JSONS/Song/ITALIAN.json';
import songArabic from '@/JSONS/Song/ARABIC.json';

// All content mapping for static export
const ALL_CONTENT = {
  // Button content
  BT1: buttonEnglish,
  BT2: buttonFrench,
  BT3: buttonItalian,
  BT4: buttonArabic,
  
  // Book content
  BK1: bookEnglish,
  BK2: bookFrench,
  BK3: bookItalian,
  BK4: bookArabic,
  
  // Branding content
  BR1: brandingEnglish,
  BR2: brandingFrench,
  BR3: brandingItalian,
  BR4: brandingArabic,
  // Song content
  SG1: songEnglish,
  SG2: songFrench,
  SG3: songItalian,
  SG4: songArabic,
} as const;

interface UseStaticContentReturn {
  allContent: typeof ALL_CONTENT;
  getContent: (id: string) => LocalContentData | null;
  loading: boolean;
  error: string | null;
}

function normalizeContentStructure(rawContent: any): LocalContentData {
  console.log('🔧 [useStaticContent] Starting normalization with raw content keys:', Object.keys(rawContent || {}));
  
  // If content has a 'homepage' property, use that as the main structure
  if (rawContent?.homepage) {
    // Dynamically extract all properties from homepage, excluding navigation elements
    const homepage = rawContent.homepage;
    console.log('🔧 [useStaticContent] Homepage object found with keys:', Object.keys(homepage));
    
    const normalizedContent: any = {
      ...rawContent,
    };
    
    // Define navigation/UI elements that should NOT be treated as content sections
    const navigationElements = ['menu', 'footer'];
    
    // Copy ALL homepage properties to the root level dynamically, except navigation elements
    Object.keys(homepage).forEach(key => {
      if (!navigationElements.includes(key)) {
        normalizedContent[key] = homepage[key];
        console.log(`🔧 [useStaticContent] Copied ${key} from homepage to root level`);
      } else {
        console.log(`🔧 [useStaticContent] Skipped ${key} (navigation element)`);
      }
    });
    
    console.log('🔧 [useStaticContent] Normalization Debug:', {
      originalKeys: Object.keys(rawContent),
      homepageKeys: Object.keys(homepage),
      normalizedKeys: Object.keys(normalizedContent),
      'adventure_possibilities exists': !!normalizedContent.adventure_possibilities,
      'book_examples exists': !!normalizedContent.book_examples,
      'book_options exists': !!normalizedContent.book_options
    });
    
    return normalizedContent;
  }
  
  console.log('🔧 [useStaticContent] No homepage object found, using content as-is');
  return rawContent || {};
}

function validateContentStructure(content: any): boolean {
  // Check if content is valid JSON object
  if (!content || typeof content !== 'object') {
    return false;
  }

  // Check for essential structure - either direct properties or homepage wrapper
  const hasDirectStructure = content.hero || content.menu || content.features;
  const hasHomepageStructure = content.homepage && (
    content.homepage.hero || content.homepage.menu || content.homepage.features
  );

  return hasDirectStructure || hasHomepageStructure;
}

export function useStaticContent(): UseStaticContentReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all content on mount (client-side only)
  useEffect(() => {
    // Simulate async loading to ensure client-side rendering
    const loadContent = async () => {
      try {
        // Content is already available statically, just validate
        setLoading(false);
      } catch (err) {
        setError('Failed to load content'); // This error is rarely shown to users in this hook
        setLoading(false);
      }
    };

    // Use setTimeout to ensure this runs after hydration
    setTimeout(loadContent, 0);
  }, []);

  // Function to get specific content by ID
  const getContent = useCallback((id: string): LocalContentData | null => {
    const contentKey = id?.toUpperCase() as keyof typeof ALL_CONTENT;
    const content = ALL_CONTENT[contentKey];
    
    if (!content) {
      // Fallback to Button English if ID not found
      return normalizeContentStructure(buttonEnglish);
    }
    
    if (!validateContentStructure(content)) {
      // Try fallback within same product
      const productPrefix = contentKey.substring(0, 2);
      const fallbackOrder = ['1', '2', '3', '4'];
      
      for (const langCode of fallbackOrder) {
        const fallbackKey = `${productPrefix}${langCode}` as keyof typeof ALL_CONTENT;
        const fallbackContent = ALL_CONTENT[fallbackKey];
        
        if (fallbackContent && validateContentStructure(fallbackContent)) {
          return normalizeContentStructure(fallbackContent);
        }
      }
      
      // Ultimate fallback
      return normalizeContentStructure(buttonEnglish);
    }
    
    return normalizeContentStructure(content);
  }, []); // Empty dependencies since ALL_CONTENT is static

  return {
    allContent: ALL_CONTENT,
    getContent,
    loading,
    error,
  };
}
