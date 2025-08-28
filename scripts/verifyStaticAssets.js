#!/usr/bin/env node
/**
 * Verifies that image & audio assets referenced in generated manifests
 * actually exist in the public/content folder before building/exporting.
 *
 * Usage (already wired in package.json):
 *   node scripts/verifyStaticAssets.js
 *
 * Set ASSET_STRICT=1 to fail the build on missing assets.
 */
const fs = require('fs');
const path = require('path');

function readJSON(p) { try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } }
function exists(p) { try { return fs.existsSync(p); } catch { return false; } }

const cwd = process.cwd();
const publicDir = path.join(cwd, 'public');
const imageManifestPath = path.join(publicDir, 'image-manifest.json');
const audioManifestPath = path.join(publicDir, 'audio-manifest.json');

const imageManifest = readJSON(imageManifestPath) || {};
const audioManifest = readJSON(audioManifestPath) || {};

let missing = []; let checked = 0;

// Validate images (gallery only for now)
if (imageManifest.Button && imageManifest.Button.gallery) {
  const langs = Object.entries(imageManifest.Button.gallery);
  for (const [lang, files] of langs) {
    (files || []).forEach(f => {
      const full = path.join(publicDir, 'content', 'Button', 'images', 'gallery', lang.toUpperCase(), f);
      checked++; if (!exists(full)) missing.push(full);
    });
  }
}

// Validate audios
if (audioManifest.Song && audioManifest.Song.gallery) {
  const langs = Object.entries(audioManifest.Song.gallery);
  for (const [lang, files] of langs) {
    (files || []).forEach(f => {
      const full = path.join(publicDir, 'content', 'Song', 'Audios', 'gallery', lang.toUpperCase(), f);
      checked++; if (!exists(full)) missing.push(full);
    });
  }
}

// Summary
if (!checked) {
  console.log('[verifyStaticAssets] No assets referenced in manifests (nothing to check).');
} else {
  console.log(`[verifyStaticAssets] Checked ${checked} asset references.`);
}

if (missing.length) {
  console.warn(`\n[verifyStaticAssets] Missing ${missing.length} assets:`);
  missing.slice(0, 50).forEach(p => console.warn('  -', path.relative(cwd, p)));
  if (missing.length > 50) console.warn(`  ...and ${missing.length - 50} more`);
  const strict = process.env.ASSET_STRICT === '1';
  if (strict) {
    console.error('\n[verifyStaticAssets] Failing build due to missing assets (ASSET_STRICT=1).');
    process.exit(1);
  } else {
    console.warn('\n[verifyStaticAssets] Continuing (set ASSET_STRICT=1 to enforce failure).');
  }
} else {
  console.log('[verifyStaticAssets] ✅ All referenced assets present.');
}
