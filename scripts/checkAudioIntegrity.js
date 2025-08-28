#!/usr/bin/env node
/**
 * Scans public/content/Song/Audios/gallery/* for WAV/MP3 files
 * Verifies magic headers:
 *   WAV: RIFF....WAVE
 *   MP3: ID3 or 0xFF 0xFB frame sync
 * Prints warnings for files that fail header check or are very small (<1KB).
 */
const fs = require('fs');
const path = require('path');

function isLikelyWav(buf){
  return buf.length >= 12 && buf.toString('ascii',0,4)==='RIFF' && buf.toString('ascii',8,12)==='WAVE';
}
function isLikelyMp3(buf){
  if (buf.length < 3) return false;
  if (buf.toString('ascii',0,3)==='ID3') return true;
  return buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0; // frame sync
}

function scan(){
  const base = path.join(process.cwd(),'public','content','Song','Audios','gallery');
  if (!fs.existsSync(base)) { console.log('[checkAudioIntegrity] No gallery dir:', base); return 0; }
  let checked = 0; let bad=[];
  for (const lang of fs.readdirSync(base)){
    const langDir = path.join(base,lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    for (const file of fs.readdirSync(langDir)){
      const ext = file.toLowerCase().split('.').pop();
      if (!['wav','mp3'].includes(ext)) continue;
      const full = path.join(langDir,file);
      try {
        const stat = fs.statSync(full);
        const buf = fs.readFileSync(full,{encoding:null});
        const head = buf.subarray(0, 16);
        let ok = false;
        if (ext==='wav') ok = isLikelyWav(head);
        if (ext==='mp3') ok = isLikelyMp3(head);
        if (!ok || stat.size < 1024){
          bad.push({file: full, size: stat.size, head: head.toString('hex')});
        }
        checked++;
      } catch(e){
        bad.push({file: full, error: e.message});
      }
    }
  }
  if (!checked) console.log('[checkAudioIntegrity] No audio files found.');
  if (bad.length){
    console.warn(`\n[checkAudioIntegrity] ${bad.length} suspicious audio file(s):`);
    bad.slice(0,50).forEach(b=>console.warn('  -', b.file,'size=',b.size,'head=',b.head||'', b.error||''));
    if (process.env.ASSET_STRICT==='1'){
      console.error('[checkAudioIntegrity] Failing build (ASSET_STRICT=1).');
      process.exit(1);
    }
  } else if (checked){
    console.log('[checkAudioIntegrity] ✅ All',checked,'audio files passed header/size checks.');
  }
  return bad.length;
}

if (require.main === module){ scan(); }
module.exports = { scan };
