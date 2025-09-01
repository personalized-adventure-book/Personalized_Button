#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDirectoryRecursive(source, target) {
  ensureDirectoryExists(target);

  const items = fs.readdirSync(source);
  
  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      // Skip JSON files
      if (path.extname(item).toLowerCase() === '.json') {
        console.log(`⏭ Skipping private JSON: ${sourcePath}`);
        return;
      }
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function copyImages() {
  if (process.env.SKIP_CONTENT_COPY === '1' || process.env.SKIP_CONTENT_COPY === 'true') {
    console.log('⏭  SKIP_CONTENT_COPY enabled - skipping content folder copy.');
    return;
  }

  const contentDir = path.join(process.cwd(), 'content');
  const publicDir = path.join(process.cwd(), 'public');
  const targetContentDir = path.join(publicDir, 'content');
  
  if (!fs.existsSync(contentDir)) {
    console.warn('Content directory not found:', contentDir);
    return;
  }
  
  if (fs.existsSync(targetContentDir)) {
    fs.rmSync(targetContentDir, { recursive: true, force: true });
  }
  
  copyDirectoryRecursive(contentDir, targetContentDir);
  
  console.log('✅ Content folder copied to public/content for static access');
}

if (require.main === module) {
  copyImages();
}

module.exports = { copyImages };