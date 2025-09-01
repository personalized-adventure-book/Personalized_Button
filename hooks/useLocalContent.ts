import { useState, useEffect } from 'react';

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
// Song product content
import songEnglish from '@/JSONS/Song/ENGLISH.json';
import songFrench from '@/JSONS/Song/FRENCH.json';
import songItalian from '@/JSONS/Song/ITALIAN.json';
import songArabic from '@/JSONS/Song/ARABIC.json';

// Type definitions
interface HeroData {
  badge?: string;
  headline?: string;
  title?: string;
  subtitle?: string;
  subheadline?: string;
  start_button?: string;
  cta_text?: string;
}

interface FeatureData {
  icon: string;
  title: string;
  description?: string;
  text?: string;
}

interface FaqData {
  q: string;
  a: string;
}

interface AdventureCard {
  icon: string;
  title: string;
  description: string;
}

interface AdventurePossibilities {
  title: string;
  subtitle: string;
  cards: AdventureCard[];
}

interface BookExample {
  title: string;
  child: string;
  adventure: string;
  preview: string;
}

interface BookExamples {
  title: string;
  subtitle: string;
  examples: BookExample[];
  items?: string[];
}

interface HowItWorksStep {
  title: string;
  description: string;
}

interface HowItWorks {
  title: string;
  steps: HowItWorksStep[];
}

interface BookOption {
  title: string;
  subtitle: string;
  price: string;
  popular_badge?: string;
  features: string[];
}

interface BookOptions {
  title: string;
  description: string;
  digital: BookOption;
  printed: BookOption;
}

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

interface PricingData {
  title: string;
  plans: PricingPlan[];
}

interface CtaData {
  title: string;
  description: string;
  button: string;
}

interface FooterData {
  product: string[];
  support: string[];
  company: string[];
  copyright: string;
}

interface MenuData {
  features?: string;
  order?: string;
  contact?: string;
  adventures?: string;
  examples?: string;
}

interface AboutData {
  title: string;
  text: string;
}

export interface LocalContentData {
  // Core sections that might exist
  menu?: MenuData;
  hero?: HeroData;
  about?: AboutData;
  features?: FeatureData[];
  faq?: FaqData[];
  adventure_possibilities?: AdventurePossibilities;
  book_examples?: BookExamples;
  examples?: BookExamples;
  how_it_works?: HowItWorks;
  book_options?: BookOptions;
  pricing?: PricingData;
  cta?: CtaData;
  footer?: FooterData;
  homepage?: {
    [key: string]: any;
  };
  // Allow any additional dynamic properties
  [key: string]: any;
}

interface UseLocalContentReturn {
  data: LocalContentData | null;
  loading: boolean;
  error: string | null;
  productType: 'Button' | 'Book' | 'Branding' | 'Song' | null;
  language: 'English' | 'French' | 'Italian' | 'Arabic' | null;
}

// Content mapping
const contentMap = {
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

// Helper functions
function parseProductId(id: string | null): {
  productType: 'Button' | 'Book' | 'Branding' | 'Song' | null;
  language: 'English' | 'French' | 'Italian' | 'Arabic' | null;
  isValid: boolean;
} {
  if (!id || id.length !== 3) {
    return { productType: null, language: null, isValid: false };
  }

  const prefix = id.substring(0, 2).toUpperCase();
  const langNumber = id.substring(2);

  let productType: 'Button' | 'Book' | 'Branding' | 'Song' | null = null;
  let language: 'English' | 'French' | 'Italian' | 'Arabic' | null = null;

  // Parse product type
  switch (prefix) {
    case 'BT':
      productType = 'Button';
      break;
    case 'BK':
      productType = 'Book';
      break;
    case 'BR':
      productType = 'Branding';
      break;
    case 'SG':
      productType = 'Song';
      break;
    default:
      return { productType: null, language: null, isValid: false };
  }

  // Parse language
  switch (langNumber) {
    case '1':
      language = 'English';
      break;
    case '2':
      language = 'French';
      break;
    case '3':
      language = 'Italian';
      break;
    case '4':
      language = 'Arabic';
      break;
    default:
      return { productType, language: null, isValid: false };
  }

  return { productType, language, isValid: true };
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

function normalizeContentStructure(rawContent: any): LocalContentData {
  console.log('🔧 Starting normalization with raw content keys:', Object.keys(rawContent));
  
  // If content has a 'homepage' property, use that as the main structure
  if (rawContent.homepage) {
    // Dynamically extract all properties from homepage, excluding navigation elements
    const homepage = rawContent.homepage;
    console.log('🔧 Homepage object found with keys:', Object.keys(homepage));
    
    const normalizedContent: any = {
      ...rawContent,
    };
    
    // Define navigation/UI elements that should NOT be treated as content sections
    const navigationElements = ['menu', 'footer'];
    
    // Copy ALL homepage properties to the root level dynamically, except navigation elements
    Object.keys(homepage).forEach(key => {
      if (!navigationElements.includes(key)) {
        normalizedContent[key] = homepage[key];
        console.log(`🔧 Copied ${key} from homepage to root level`);
      } else {
        console.log(`🔧 Skipped ${key} (navigation element)`);
      }
    });
    
    console.log('🔧 Normalization Debug:', {
      originalKeys: Object.keys(rawContent),
      homepageKeys: Object.keys(homepage),
      normalizedKeys: Object.keys(normalizedContent),
      'adventure_possibilities exists': !!normalizedContent.adventure_possibilities,
      'book_examples exists': !!normalizedContent.book_examples,
      'book_options exists': !!normalizedContent.book_options
    });
    
    return normalizedContent;
  }
  
  console.log('🔧 No homepage object found, using content as-is');
  return rawContent;
}

function getFallbackContent(productType: 'Button' | 'Book' | 'Branding' | 'Song', requestedLanguage: string): {
  content: any;
  fallbackId: string;
  fallbackLanguage: string;
} | null {
  // Language fallback order: 1 (English), 2 (French), 3 (Italian), 4 (Arabic)
  const languageOrder = ['1', '2', '3', '4'];
  const productPrefix = productType === 'Button' ? 'BT' : productType === 'Book' ? 'BK' : productType === 'Branding' ? 'BR' : 'SG';
  
  // Try each language in order, skipping the originally requested one
  for (const langNumber of languageOrder) {
    if (langNumber === requestedLanguage) continue; // Skip the corrupted one
    
    const fallbackId = `${productPrefix}${langNumber}`;
    const fallbackContent = contentMap[fallbackId as keyof typeof contentMap];
    
    if (fallbackContent && validateContentStructure(fallbackContent)) {
      const languageName = langNumber === '1' ? 'English' : 
                          langNumber === '2' ? 'French' : 
                          langNumber === '3' ? 'Italian' : 'Arabic';
      
      return {
        content: fallbackContent,
        fallbackId,
        fallbackLanguage: languageName
      };
    }
  }
  
  return null;
}

export function useLocalContent(id: string | null): UseLocalContentReturn {
  const [data, setData] = useState<LocalContentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Parse the product ID
    const { productType, language, isValid } = parseProductId(id);

    if (!isValid || !id) {
      const fallbackContent = normalizeContentStructure(buttonEnglish);
      setData(fallbackContent);
      setLoading(false);
      return;
    }

    // Get content from mapping
    const contentKey = id.toUpperCase() as keyof typeof contentMap;
    const selectedContent = contentMap[contentKey];

    if (!selectedContent) {
      setError(`No content available for ID: ${id}`);
      setLoading(false);
      return;
    }

    // Validate content structure
    if (!validateContentStructure(selectedContent)) {
      const requestedLanguageNumber = id.substring(2);
      const fallbackResult = getFallbackContent(productType!, requestedLanguageNumber);
      
      if (fallbackResult) {
        const normalizedContent = normalizeContentStructure(fallbackResult.content);
        setData(normalizedContent);
        setError(`Content for ${language} was corrupted. Displaying ${fallbackResult.fallbackLanguage} version instead.`);
        setLoading(false);
        return;
      } else {
        setError(`All content files appear to be corrupted for ${productType}. Please contact support.`);
        setLoading(false);
        return;
      }
    }

    // Normalize and set the content
    let normalizedContent = normalizeContentStructure(selectedContent);

    // --- Fallback enhancement for incomplete localized Song content ---
    try {
      if (productType === 'Song') {
        // If form steps missing or empty in non-English versions, merge from English
        const isNonEnglish = id.substring(2) !== '1';
        const englishSong = contentMap['SG1' as keyof typeof contentMap] as any;
        if (englishSong && typeof englishSong === 'object') {
          // Ensure form exists
            if (
              (!normalizedContent.form ||
               !Array.isArray(normalizedContent.form.steps) ||
               normalizedContent.form.steps.length === 0) &&
              englishSong.form?.steps?.length
            ) {
              normalizedContent = {
                ...normalizedContent,
                form: { ...englishSong.form },
              };
            }
            // Ensure pricing_config fields exist
            if (
              (!normalizedContent.pricing_config ||
               !normalizedContent.pricing_config.fields ||
               Object.keys(normalizedContent.pricing_config.fields || {}).length === 0) &&
              englishSong.pricing_config?.fields &&
              Object.keys(englishSong.pricing_config.fields).length > 0
            ) {
              normalizedContent = {
                ...normalizedContent,
                pricing_config: { ...englishSong.pricing_config },
              };
            }
            // Optionally merge empty structured sections (features/examples/how_it_works etc.) if arrays empty
            const sectionKeys: Array<keyof typeof englishSong.homepage> = ['features','examples','how_it_works','why_people_love_it','pricing','testimonials','faq'];
            if (normalizedContent.homepage && englishSong.homepage) {
              const mergedHomepage = { ...normalizedContent.homepage };
              sectionKeys.forEach(k => {
                const localizedSection: any = (normalizedContent.homepage as any)[k];
                const englishSection: any = (englishSong.homepage as any)[k];
                // If section exists but is effectively empty (no items/steps/points/plans) then copy English
                if (englishSection && localizedSection) {
                  const isEmpty = (() => {
                    if (Array.isArray(localizedSection)) return localizedSection.length === 0;
                    if (localizedSection?.items && Array.isArray(localizedSection.items)) return localizedSection.items.length === 0;
                    if (localizedSection?.steps && Array.isArray(localizedSection.steps)) return localizedSection.steps.length === 0;
                    if (localizedSection?.points && Array.isArray(localizedSection.points)) return localizedSection.points.length === 0;
                    if (localizedSection?.plans && Array.isArray(localizedSection.plans)) return localizedSection.plans.length === 0;
                    return false;
                  })();
                  if (isEmpty) {
                    (mergedHomepage as any)[k] = englishSection;
                  }
                }
              });
              normalizedContent = { ...normalizedContent, homepage: mergedHomepage };
            }
        }
        if (isNonEnglish) {
          // log once for debugging visibility in browser console
          console.info('[useLocalContent] Applied English fallback sections for incomplete Song localization', { id });
        }
      }
    } catch (fallbackErr) {
      console.warn('[useLocalContent] Fallback merge failed', fallbackErr);
    }

    setData(normalizedContent);
    setLoading(false);
  }, [id]);

  const { productType, language } = parseProductId(id);

  return { 
    data, 
    loading, 
    error, 
    productType, 
    language 
  };
}
