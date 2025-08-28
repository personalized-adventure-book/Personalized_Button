// Simplified Song audio utilities (fresh implementation)
// Discovers audio files from audio-manifest.json or falls back to numbered .wav files.

import { getCurrentLanguage } from './productAssets';

const DEFAULT_BASE = '/Personalized_Button';

function resolveBase(): string {
  if (typeof window === 'undefined') return DEFAULT_BASE;
  try {
    const ap = (window as any)?.__NEXT_DATA__?.assetPrefix;
    if (ap) return String(ap).replace(/\/$/, '');
  } catch {}
  // If pathname does not start with default, allow root ''
  try { if (!window.location.pathname.startsWith(DEFAULT_BASE + '/')) return ''; } catch {}
  return DEFAULT_BASE;
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
  const base = resolveBase();
  const folder = langFolder(lang);
  const buildUrl = (n: string) => `${base}/content/Song/Audios/gallery/${folder}/${n}`;

  let list: string[] = [];
  try {
    const resp = await fetch(`${base}/audio-manifest.json`, { cache: 'no-store' });
    if (resp.ok) {
      const manifest = await resp.json();
      const arr: string[] | undefined = manifest?.Song?.gallery?.[lang];
      if (Array.isArray(arr) && arr.length) list = arr;
    }
  } catch {}

  if (!list.length) {
    // Fallback: probe sequential wav names (light – stop after first miss gap of 3)
    const temp: string[] = [];
    let misses = 0;
    for (let i = 1; i <= max && misses < 3; i++) {
      const num = i.toString().padStart(2, '0');
      const name = `song_gallery_${num}.wav`;
      try {
        const r = await fetch(buildUrl(name), { method: 'HEAD' });
        if (r.ok) temp.push(name); else misses++;
      } catch { misses++; }
    }
    list = temp;
  }

  const files = list.slice(0, max).map(name => ({ name, url: buildUrl(name) }));
  if (typeof window !== 'undefined') { (window as any).AUDIO_SOURCES = files.map(f => f.url); }
  return files;
}

export function formatAudioLabel(name: string): string {
  return name.replace(/^song_gallery_/,'').replace(/\.wav$/,'').replace(/_/g,' ').replace(/\b(\d)\b/,'$1');
}
