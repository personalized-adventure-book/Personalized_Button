// Simplified Song audio utilities (fresh implementation)
// Discovers audio files from audio-manifest.json or falls back to numbered .wav files.

import { getCurrentLanguage } from './productAssets';

const DEFAULT_BASE = '/Personalized_Button';

// More robust base resolution:
// 1. Prefer Next.js assetPrefix if present
// 2. If running at root (custom domain) and path doesn't start with default, use ''
// 3. Allow manual override via global window.__ASSET_BASE_OVERRIDE__ (for debugging)
// 4. Cache the successful base after first working audio fetch to avoid repeated probes
function resolveBase(): string {
  if (typeof window === 'undefined') return DEFAULT_BASE;
  if ((window as any).__AUDIO_BASE_RESOLVED__) return (window as any).__AUDIO_BASE_RESOLVED__;
  let candidate: string | undefined;
  try {
    const ap = (window as any)?.__NEXT_DATA__?.assetPrefix;
    if (ap) candidate = String(ap).replace(/\/$/, '');
  } catch {}
  try {
    const override = (window as any).__ASSET_BASE_OVERRIDE__;
    if (override) candidate = String(override).replace(/\/$/, '');
  } catch {}
  if (!candidate) {
    try {
      if (!window.location.pathname.startsWith(DEFAULT_BASE + '/')) candidate = '';
    } catch {}
  }
  if (!candidate) candidate = DEFAULT_BASE;
  (window as any).__AUDIO_BASE_RESOLVED__ = candidate;
  return candidate;
}

function langFolder(lang: string): string {
  switch (lang) {
    case 'en': return 'ENGLISH';
    case 'fr': return 'FRENCH';
    case 'it': return 'ITALIAN';
    case 'ar': return 'ARABIC';
    default: return 'ENGLISH';
  }
}

export interface SongAudioFile { name: string; url: string }

export async function loadSongAudios(max: number = 12, language?: string): Promise<SongAudioFile[]> {
  const lang = language || getCurrentLanguage();
  const folder = langFolder(lang);

  // We'll probe possible bases & directory casings once if needed
  const basePrimary = resolveBase();
  const baseCandidates = Array.from(new Set([basePrimary, '', DEFAULT_BASE])).filter(Boolean);
  const dirCasings = ['Audios','audios','Audio','AUDIO'];

  // Try manifest with basePrimary first, then root
  let manifestList: string[] = [];
  for (const b of [basePrimary, '']) {
    if (manifestList.length) break;
    try {
      const resp = await fetch(`${b}/audio-manifest.json`.replace(/\/\//g,'/'), { cache: 'no-store' });
      if (resp.ok) {
        const manifest = await resp.json();
        const arr: string[] | undefined = manifest?.Song?.gallery?.[lang];
        if (Array.isArray(arr) && arr.length) manifestList = arr;
      }
    } catch {}
  }

  // If we got a list, determine working base + casing by probing first file
  let workingBase = basePrimary;
  let workingDir = 'Audios';
  const attempts: any[] = [];
  if (manifestList.length) {
    outer: for (const b of baseCandidates) {
      for (const dir of dirCasings) {
        const testUrl = `${b}/content/Song/${dir}/gallery/${folder}/${manifestList[0]}`.replace(/([^:]?)\/\//g,'$1/');
        try {
          const r = await fetch(testUrl, { method: 'HEAD' });
          attempts.push({ testUrl, ok: r.ok });
          if (r.ok) { workingBase = b; workingDir = dir; break outer; }
        } catch (e:any) { attempts.push({ testUrl, ok:false, error:e?.message }); }
      }
    }
  }

  let list = manifestList;

  // Manifest fallback: probe sequential numbers if manifest empty or none resolved
  if (!list.length) {
    const temp: string[] = [];
    let misses = 0;
    for (let i = 1; i <= max && misses < 3; i++) {
      const num = i.toString().padStart(2, '0');
      const name = `song_gallery_${num}.wav`;
      let found = false;
      // Probe across bases & casings until found or all miss
      for (const b of baseCandidates) {
        for (const dir of dirCasings) {
          const url = `${b}/content/Song/${dir}/gallery/${folder}/${name}`.replace(/([^:]?)\/\//g,'$1/');
          try { const r = await fetch(url, { method: 'HEAD' }); if (r.ok) { workingBase = b; workingDir = dir; found = true; break; } } catch {}
        }
        if (found) break;
      }
      if (found) { temp.push(name); misses = 0; } else { misses++; }
    }
    list = temp;
  }

  const buildUrl = (n: string) => `${workingBase}/content/Song/${workingDir}/gallery/${folder}/${n}`.replace(/([^:]?)\/\//g,'$1/');
  const files = list.slice(0, max).map(name => ({ name, url: buildUrl(name) }));
  if (typeof window !== 'undefined') {
    try {
      (window as any).AUDIO_SOURCES = files.map(f => f.url);
      (window as any).AUDIO_ATTEMPTS = attempts;
      (window as any).__AUDIO_BASE_RESOLVED__ = workingBase; // cache
      (window as any).__AUDIO_DIR_CASING__ = workingDir;
    } catch {}
  }
  return files;
}

export function formatAudioLabel(name: string): string {
  return name.replace(/^song_gallery_/,'').replace(/\.wav$/,'').replace(/_/g,' ').replace(/\b(\d)\b/,'$1');
}
