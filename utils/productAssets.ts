/**
 * Utility functions for handling product-specific images and assets
 * Images are accessed directly from content folder, same as JSON files
 */

// Get current language code based on the last digit in the URL ID
export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    // Extract the last digit from the URL (works with IDs like BT123, BR4, BK789, etc.)
    const fullUrl = window.location.href;
    
    // Look for product IDs with prefixes and numbers
    // Matches patterns like: id=BT123, #BR4, /BK789
    const idMatches = fullUrl.match(/(?:id=|#|\/|-)([A-Z]{2}\d+)/g);
    
    if (idMatches && idMatches.length > 0) {
      // Get the last ID match
      const lastIdMatch = idMatches[idMatches.length - 1];
      
      // Extract just the number part from the ID (after the 2-letter prefix)
      const numberPart = lastIdMatch.match(/[A-Z]{2}(\d+)/);
      
      if (numberPart && numberPart[1]) {
        const fullNumber = numberPart[1];
        const lastDigit = parseInt(fullNumber) % 10; // Get last digit of the number
        
        // Map last digit to language: 1=en, 2=fr, 3=it, 4=ar
        switch (lastDigit) {
          case 1: return 'en';
          case 2: return 'fr';
          case 3: return 'it';
          case 4: return 'ar';
          default: return 'en'; // Default to English
        }
      }
    }
  }
  
  return 'en'; // Default to English
}

// Get current product from URL ID (BT=Button, BR=Branding, BK=Book)
export function getCurrentProduct(): string {
  if (typeof window !== 'undefined') {
    const fullUrl = window.location.href;
    // First allow explicit query parameter override: ?product=song / branding / book / button
    try {
      const usp = new URL(fullUrl).searchParams;
      const qp = usp.get('product');
      if (qp) {
        const norm = qp.toLowerCase();
        if (norm === 'song') return 'Song';
        if (norm === 'branding') return 'Branding';
        if (norm === 'book') return 'Book';
        if (norm === 'button') return 'Button';
      }
    } catch {}
    
    // Look for product IDs with prefixes
    const idMatches = fullUrl.match(/(?:id=|#|\/|-)([A-Z]{2}\d+)/g);
    
    if (idMatches && idMatches.length > 0) {
      // Get the last ID match
      const lastIdMatch = idMatches[idMatches.length - 1];
      
      // Extract the 2-letter prefix
      const prefixMatch = lastIdMatch.match(/([A-Z]{2})\d+/);
      
      if (prefixMatch && prefixMatch[1]) {
        const prefix = prefixMatch[1];
        
        // Map prefix to product
        switch (prefix) {
          case 'BT': return 'Button';
          case 'BR': return 'Branding';
          case 'BK': return 'Book';
          case 'SG': return 'Song';
          default: return 'Button'; // Default to Button
        }
      }
    }
  }
  
  return 'Button'; // Default to Button
}

// (Removed legacy debugLoadSongAudios; audio handled by utils/songAudio.ts)

// Map language codes to folder names (same as JSON file mapping)
function getLanguageFolderName(langCode: string): string {
  switch (langCode) {
    case 'en': return 'ENGLISH';
    case 'fr': return 'FRENCH';
    case 'it': return 'ITALIAN';
    case 'ar': return 'ARABIC';
    default: return 'ENGLISH';
  }
}

// Get gallery image path - directly from content folder like JSON files
export function getGalleryImage(imageName: string, product?: string, language?: string): string {
  const prod = product || getCurrentProduct();
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang);
  
  // Access images directly from content folder, same pattern as JSON files
  // JSON: @/content/Button/ENGLISH.json
  // Images: /Personalized_Button/content/Button/images/gallery/ENGLISH/gallery_01.png
  return `/Personalized_Button/content/${prod}/images/gallery/${langFolder}/${imageName}`;
}

// Get hero image path
export function getHeroImage(imageName: string, product?: string, language?: string): string {
  const prod = product || getCurrentProduct();
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang);
  
  return `/Personalized_Button/content/${prod}/images/hero/${langFolder}/${imageName}`;
}

// Get feature image path
export function getFeatureImage(imageName: string, product?: string, language?: string): string {
  const prod = product || getCurrentProduct();
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang);
  
  return `/Personalized_Button/content/${prod}/images/features/${langFolder}/${imageName}`;
}

// Dynamically get available gallery images from the actual folder
export async function getAvailableGalleryImages(product?: string, language?: string): Promise<string[]> {
  const prod = product || getCurrentProduct();
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang);
  
  try {
    // Try to fetch the list of files from the server
    const folderPath = `/Personalized_Button/content/${prod}/images/gallery/${encodeURIComponent(langFolder)}/`;
    
    // In a real app, we'd need an API endpoint to list files
    // For now, let's use a manifest approach or check common files
    // But since we're in a static environment, let's check what's been copied
    
    // Use the manifest if available
    try {
      const manifestResponse = await fetch('/Personalized_Button/image-manifest.json');
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        const images = manifest?.[prod]?.gallery?.[lang] || [];
        if (images.length > 0) {
          return images;
        }
      }
    } catch (error) {
      console.warn('Could not load image manifest:', error);
    }
    
    // Fallback: dynamically check for existing images
    const availableImages: string[] = [];
    
    // Check for gallery images up to 20 (reasonable limit)
    for (let i = 1; i <= 20; i++) {
      const num = i.toString().padStart(2, '0');
      
      // Check both .png and .jpg extensions
      for (const ext of ['.png', '.jpg']) {
        const imageName = `gallery_${num}${ext}`;
        const imagePath = `/Personalized_Button/content/${prod}/images/gallery/${encodeURIComponent(langFolder)}/${imageName}`;
        
        try {
          const exists = await imageExists(imagePath);
          if (exists) {
            availableImages.push(imageName);
            break; // Found one extension, don't check the other
          }
        } catch (error) {
          // Continue checking
        }
      }
    }
    
    return availableImages;
  } catch (error) {
    console.warn('Error getting available gallery images:', error);
    return [];
  }
}

// Get multiple gallery images for current product and language
export async function getGalleryImages(count: number = 10, product?: string, language?: string): Promise<string[]> {
  const availableImages = await getAvailableGalleryImages(product, language);
  const prod = product || getCurrentProduct();
  const lang = language || getCurrentLanguage();
  
  // Return up to 'count' images, using the full paths
  return availableImages.slice(0, count).map((imageName: string) => 
    getGalleryImage(imageName, prod, lang)
  );
}

// Check if image exists (basic implementation)
export async function imageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get product logo/icon
export function getProductLogo(product?: string): string {
  const prod = product || getCurrentProduct();
  return `/icons/${prod.toLowerCase()}-logo.png`;
}

// Get default placeholder image
export function getPlaceholderImage(category: string = 'gallery'): string {
  return `/placeholders/${category}-placeholder.jpg`;
}

// Legacy functions for compatibility
export function getFallbackImagePath(imageName: string, category: string, product?: string): string {
  const prod = product || getCurrentProduct();
  return `/Personalized_Button/content/${prod}/images/${category}/${imageName}`;
}

export async function imageExistsWithFallback(imageName: string, category: string, product?: string, language?: string): Promise<{ exists: boolean; path: string }> {
  // Check if imageName is already a full path (starts with /Personalized_Button/content/)
  let imagePath: string;
  if (imageName.startsWith('/Personalized_Button/content/')) {
    // Already a full path, use as-is
    imagePath = imageName;
  } else {
    // Just an image name, construct the full path
    imagePath = category === 'gallery' ? getGalleryImage(imageName, product, language) :
                category === 'hero' ? getHeroImage(imageName, product, language) :
                getFeatureImage(imageName, product, language);
  }
  
  const exists = await imageExists(imagePath);
  return { exists, path: imagePath };
}

export async function getAllImagesInFolder(category: string, product?: string, language?: string): Promise<string[]> {
  if (category === 'gallery') {
    const availableImages = await getAvailableGalleryImages(product, language);
    return availableImages.map((imageName: string) => 
      getGalleryImage(imageName, product, language)
    );
  } else {
    // For hero and features, use the old approach for now
    const imageNames: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const num = i.toString().padStart(2, '0');
      imageNames.push(`${category}_${num}.png`);
      imageNames.push(`${category}_${num}.jpg`);
    }
    
    return imageNames.map((imageName: string) => 
      category === 'hero' ? getHeroImage(imageName, product, language) :
      getFeatureImage(imageName, product, language)
    );
  }
}

export function getRecommendedImageCounts(category?: string): { gallery: number; hero: number; features: number; description: string; count?: number } {
  const counts = {
    gallery: 15,
    hero: 3,
    features: 6,
    description: 'Recommended image counts for optimal display'
  };
  
  if (category) {
    const count = counts[category as keyof typeof counts];
    return {
      ...counts,
      count: typeof count === 'number' ? count : 10
    };
  }
  
  return counts;
}

// (Legacy audio utilities removed; audio loading now handled by utils/songAudio.ts)

