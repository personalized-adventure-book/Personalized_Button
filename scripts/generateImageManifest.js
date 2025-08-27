#!/usr/bin/env node

/**
 * Script to generate image manifest from content folders
 * This creates a JSON file listing all available images by product, category, and language
 */

const fs = require('fs');
const path = require('path');

function scanDirectory(dir, includeVideos = false) {
  try {
    return fs.readdirSync(dir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
      
      if (includeVideos) {
        return [...imageExts, ...videoExts].includes(ext);
      }
      return imageExts.includes(ext);
    }).sort();
  } catch (error) {
    console.warn(`Could not read directory: ${dir}`);
    return [];
  }
}

function generateImageManifest() {
  // Start from current working directory (Personalized_Button)
  const contentDir = path.join(process.cwd(), 'content');
  const publicDir = path.join(process.cwd(), 'public');
  const manifest = {};
  
  // Scan each product folder
  const products = ['Button', 'Book', 'Branding'];
  
  products.forEach(product => {
    const productDir = path.join(contentDir, product);
    
    if (!fs.existsSync(productDir)) {
      console.warn(`Product directory not found: ${productDir}`);
      return;
    }
    
    manifest[product] = {
      gallery: {},
      hero: {},
      features: {},
      demo: {}
    };
    
    // Scan demo videos
    const demoDir = path.join(productDir, 'Demo');
    if (fs.existsSync(demoDir)) {
      const demoFiles = scanDirectory(demoDir, true); // Include videos
      if (demoFiles.length > 0) {
        manifest[product].demo.files = demoFiles;
        console.log(`Found ${demoFiles.length} demo files in ${product}/Demo`);
      }
    }
    
    // Scan gallery images
    const galleryDir = path.join(productDir, 'images', 'gallery');
    if (fs.existsSync(galleryDir)) {
      // Get actual folder names (in case of trailing spaces or different naming)
      const actualFolders = fs.readdirSync(galleryDir).filter(item => {
        return fs.statSync(path.join(galleryDir, item)).isDirectory();
      });
      
      // Map actual folder names to language codes
      const folderMapping = {};
      actualFolders.forEach(folder => {
        const cleanName = folder.trim().toUpperCase();
        if (cleanName.includes('ENGLISH')) folderMapping.en = folder;
        else if (cleanName.includes('FRENCH')) folderMapping.fr = folder;
        else if (cleanName.includes('ITALIAN')) folderMapping.it = folder;
        else if (cleanName.includes('ARABIC')) folderMapping.ar = folder;
      });
      
      Object.entries(folderMapping).forEach(([langCode, folderName]) => {
        const langDir = path.join(galleryDir, folderName);
        if (fs.existsSync(langDir)) {
          const images = scanDirectory(langDir);
          manifest[product].gallery[langCode] = images;
          console.log(`Found ${images.length} images in ${product}/gallery/${folderName} (${langCode})`);
        }
      });
    }
    
    // Scan hero images
    const heroDir = path.join(productDir, 'images', 'hero');
    if (fs.existsSync(heroDir)) {
      const heroFolders = fs.readdirSync(heroDir).filter(item => {
        return fs.statSync(path.join(heroDir, item)).isDirectory();
      });
      
      heroFolders.forEach(folder => {
        const cleanName = folder.trim().toUpperCase();
        let langCode;
        if (cleanName.includes('ENGLISH')) langCode = 'en';
        else if (cleanName.includes('FRENCH')) langCode = 'fr';
        else if (cleanName.includes('ITALIAN')) langCode = 'it';
        else if (cleanName.includes('ARABIC')) langCode = 'ar';
        
        if (langCode) {
          const langDir = path.join(heroDir, folder);
          const images = scanDirectory(langDir);
          manifest[product].hero[langCode] = images;
          console.log(`Found ${images.length} hero images in ${product}/hero/${folder} (${langCode})`);
        }
      });
    }
    
    // Scan feature images
    const featuresDir = path.join(productDir, 'images', 'features');
    if (fs.existsSync(featuresDir)) {
      const featureFolders = fs.readdirSync(featuresDir).filter(item => {
        return fs.statSync(path.join(featuresDir, item)).isDirectory();
      });
      
      featureFolders.forEach(folder => {
        const cleanName = folder.trim().toUpperCase();
        let langCode;
        if (cleanName.includes('ENGLISH')) langCode = 'en';
        else if (cleanName.includes('FRENCH')) langCode = 'fr';
        else if (cleanName.includes('ITALIAN')) langCode = 'it';
        else if (cleanName.includes('ARABIC')) langCode = 'ar';
        
        if (langCode) {
          const langDir = path.join(featuresDir, folder);
          const images = scanDirectory(langDir);
          manifest[product].features[langCode] = images;
          console.log(`Found ${images.length} feature images in ${product}/features/${folder} (${langCode})`);
        }
      });
    }
  });
  
  // Write manifest to public folder so it can be accessed at runtime
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const manifestPath = path.join(publicDir, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log('✅ Image manifest generated:', manifestPath);
  console.log('📊 Manifest summary:', JSON.stringify(manifest, null, 2));
  
  return manifest;
}

// Run if called directly
if (require.main === module) {
  generateImageManifest();
}

module.exports = { generateImageManifest };
