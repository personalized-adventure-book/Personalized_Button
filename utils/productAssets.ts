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

// ------------------ AUDIO (Song product) ------------------
// Audio files are copied into: /<basePath>/content/Song/Audios/gallery/<LANG_FOLDER>/song_gallery_XX.(wav|mp3)
// We derive basePath at runtime (client) to avoid hard‑coding so deployment under a
// different mount (custom domain vs repo slug) still works. Fallback keeps previous default.
const DEFAULT_BASE_PATH = '/Personalized_Button';
function resolveBasePath(): string {
  try {
    if (typeof window !== 'undefined') {
      const ap = (window as any)?.__NEXT_DATA__?.assetPrefix;
      if (ap) return String(ap).replace(/\/$/, '');
      // If site served at root (custom domain) but code still has old default, allow ''
  // Heuristic: if current location pathname does NOT start with the default base, prefer ''
  if (!window.location.pathname.startsWith(DEFAULT_BASE_PATH + '/')) return '';
    }
  } catch {}
  return DEFAULT_BASE_PATH;
}

// Get gallery audio path (Song only for now)
export function getGalleryAudio(audioName: string, product?: string, language?: string): string {
  const prod = product || getCurrentProduct();
  if (prod !== 'Song') return '';
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang).trim();
  const base = resolveBasePath();
  return `${base}/content/Song/Audios/gallery/${langFolder}/${audioName}`;
}

// Check audio existence (HEAD request)
export async function audioExists(audioPath: string): Promise<boolean> {
  if (!audioPath) return false;
  try {
    const response = await fetch(audioPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export interface DiscoveredAudio { name: string; path: string }

// Discover available gallery audios: probe sequentially; small set so cost is low.
export async function getAvailableGalleryAudios(product?: string, language?: string, max: number = 30): Promise<DiscoveredAudio[]> {
  const prod = product || getCurrentProduct();
  if (prod !== 'Song') return [];
  const lang = language || getCurrentLanguage();
  const langFolder = getLanguageFolderName(lang).trim();

  // 1. Try manifest first (fast, no HEAD requests)
  try {
    const base = resolveBasePath();
    let manifestResp = await fetch(`${base}/audio-manifest.json`, { cache: 'no-store' });
    if (!manifestResp.ok && base && base !== '/' && base !== '') {
      // Retry without base path in case site is now deployed at root (custom domain)
      try { manifestResp = await fetch('/audio-manifest.json', { cache: 'no-store' }); } catch {}
    }
    if (manifestResp.ok) {
      const manifest = await manifestResp.json();
      const list: string[] | undefined = manifest?.Song?.gallery?.[lang];
      if (Array.isArray(list) && list.length) {
        // Probe candidate base paths (resolved + root) to pick a working one
        const candidates = Array.from(new Set([resolveBasePath(), '']));
        const dirCasing = ['Audios','audios','Audio','AUDIO'];
        let chosen = '';
        const attempts: any[] = [];
        outer: for (const cand of candidates) {
          for (const dc of dirCasing) {
            const testUrl = `${cand || ''}/content/Song/${dc}/gallery/${langFolder}/${list[0]}`.replace(/\+/g,'/');
            try {
              const r = await fetch(testUrl, { method: 'HEAD' });
              attempts.push({ testUrl, ok: r.ok });
              if (r.ok) { chosen = cand; (window as any).__AUDIO_DIR_CASING__ = dc; break outer; }
            } catch (e) { attempts.push({ testUrl, ok: false, error: (e as any)?.message }); }
          }
        }
        if (!(window as any).__AUDIO_DIR_CASING__) (window as any).__AUDIO_DIR_CASING__ = 'Audios';
        if (typeof window !== 'undefined') {
          try {
            (window as any).__AUDIO_BASE_CHOSEN__ = chosen;
            (window as any).__AUDIO_DIR_CASING__ = (window as any).__AUDIO_DIR_CASING__ || 'Audios';
            (window as any).__AUDIO_DEBUG__ = attempts;
            // Aliases without underscores for easier console access
            (window as any).AUDIO_BASE_CHOSEN = (window as any).__AUDIO_BASE_CHOSEN__;
            (window as any).AUDIO_DIR_CASING = (window as any).__AUDIO_DIR_CASING__;
            (window as any).AUDIO_DEBUG = (window as any).__AUDIO_DEBUG__;
          } catch {}
        }
        const dirChosen = (window as any).__AUDIO_DIR_CASING__ || 'Audios';
        const resolved: { name: string; path: string }[] = [];
        for (const originalName of list.slice(0, max)) {
          const baseDir = `${chosen || ''}/content/Song/${dirChosen}/gallery/${langFolder}`;
          const primaryPath = `${baseDir}/${originalName}`;
          // If primary extension fails HEAD, try alt (.mp3<->.wav)
          let finalPath = primaryPath;
          try {
            const r = await fetch(primaryPath, { method: 'HEAD' });
            if (!r.ok) {
              const altName = originalName.endsWith('.wav') ? originalName.replace(/\.wav$/, '.mp3') : originalName.replace(/\.mp3$/, '.wav');
              if (altName !== originalName) {
                const altPath = `${baseDir}/${altName}`;
                try { const r2 = await fetch(altPath, { method: 'HEAD' }); if (r2.ok) finalPath = altPath; } catch {}
              }
            }
          } catch {}
          resolved.push({ name: originalName, path: finalPath });
        }
        return resolved;
      }
    }
  } catch (e) {
    // swallow and fallback
  }

  // 2. Fallback probing (only if manifest absent): sequential limited HEADs
  const files: DiscoveredAudio[] = [];
  const limit = Math.min(max, 30);
  for (let i = 1; i <= limit; i++) {
    const num = i.toString().padStart(2, '0');
    for (const ext of ['.mp3', '.wav', '.wov']) {
      const name = `song_gallery_${num}${ext}`;
  const dynamicBase = (typeof window !== 'undefined' && (window as any).__AUDIO_BASE_CHOSEN__) || resolveBasePath();
  const dirChosen = (typeof window !== 'undefined' && (window as any).__AUDIO_DIR_CASING__) || 'Audios';
  const path = `${dynamicBase || ''}/content/Song/${dirChosen}/gallery/${langFolder}/${name}`;
      try { if (await audioExists(path)) { files.push({ name, path }); break; } } catch {}
    }
  }
  return files;
}

export async function getGalleryAudios(count: number = 12, product?: string, language?: string): Promise<string[]> {
  // Slightly overfetch to allow user to scroll without delay
  const available = await getAvailableGalleryAudios(product, language, Math.max(count + 4, count));
  const list = available.slice(0, count).map(a => a.path);
  // Expose for runtime diagnostics (non-breaking)
  if (typeof window !== 'undefined') {
    try { (window as any).AUDIO_SOURCES = list; } catch {}
  }
  return list;
}

