// Removes dynamic song-audio API routes that break static export.
// Safe to run repeatedly.
const fs = require('fs');
const path = require('path');

const targets = [
  'app/api/song-audio/[lang]/[file]/route.ts',
  'app/api/song-audio/list/route.ts',
  'app/api/song-audio/raw/route.ts'
];

for (const rel of targets) {
  const full = path.join(process.cwd(), rel);
  try {
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      console.log('[removeDynamicAudioRoutes] Deleted', rel);
    }
  } catch (e) {
    console.warn('[removeDynamicAudioRoutes] Failed deleting', rel, e.message);
  }
}

// Optionally remove now-empty folders if desired
function cleanEmpty(dir) {
  try {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    if (entries.length === 0) {
      fs.rmdirSync(dir);
      console.log('[removeDynamicAudioRoutes] Removed empty dir', dir);
    }
  } catch {}
}

cleanEmpty(path.join(process.cwd(), 'app/api/song-audio/[lang]/[file]'));
cleanEmpty(path.join(process.cwd(), 'app/api/song-audio/[lang]'));
cleanEmpty(path.join(process.cwd(), 'app/api/song-audio/list'));
cleanEmpty(path.join(process.cwd(), 'app/api/song-audio/raw'));
cleanEmpty(path.join(process.cwd(), 'app/api/song-audio'));
