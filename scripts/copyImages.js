#!/usr/bin/env node

/**
 * Script to copy content folder to public folder for static access
 * This allows images to be accessed directly like: /content/Button/images/gallery/ENGLISH/gallery_01.png
 */

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDirectoryRecursive(source, target) {
  // Ensure target directory exists
  ensureDirectoryExists(target);
  
  // Read the source directory
  const items = fs.readdirSync(source);
  
  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function copyImages() {
  if (process.env.SKIP_CONTENT_COPY === '1' || process.env.SKIP_CONTENT_COPY === 'true') {
    console.log('⏭  SKIP_CONTENT_COPY enabled - skipping content folder copy.');
    return;
  }
  // Start from current working directory (Personalized_Button)
  const contentDir = path.join(process.cwd(), 'content');
  const publicDir = path.join(process.cwd(), 'public');
  const targetContentDir = path.join(publicDir, 'content');
  
  if (!fs.existsSync(contentDir)) {
    console.warn('Content directory not found:', contentDir);
    return;
  }
  
  // Remove existing content folder in public
  if (fs.existsSync(targetContentDir)) {
    fs.rmSync(targetContentDir, { recursive: true, force: true });
  }
  
  // Copy entire content folder to public/content
  copyDirectoryRecursive(contentDir, targetContentDir);
  
  console.log('✅ Content folder copied to public/content for static access');
  console.log('📁 Images now accessible at: /content/Button/images/gallery/ENGLISH/gallery_01.png');
}

// Run if called directly
if (require.main === module) {
  copyImages();
}

module.exports = { copyImages };
