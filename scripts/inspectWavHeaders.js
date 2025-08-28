#!/usr/bin/env node
/**
 * Inspect WAV headers under public/content/Song/Audios/gallery/**
 * Reports audioFormat, channels, sampleRate, bitsPerSample, and flags formats that may cause Safari issues.
 */
const fs = require('fs');
const path = require('path');

function readUInt16LE(buf,o){return buf[o] | (buf[o+1]<<8);} 
function readUInt32LE(buf,o){return (buf[o]) | (buf[o+1]<<8) | (buf[o+2]<<16) | (buf[o+3]<<24);} 

function inspectWav(file){
  const buf = fs.readFileSync(file);
  if (buf.length < 44) return { file, error: 'Too small (<44 bytes)' };
  if (buf.toString('ascii',0,4) !== 'RIFF' || buf.toString('ascii',8,12) !== 'WAVE') return { file, error: 'Missing RIFF/WAVE' };
  // find 'fmt ' chunk then 'data'
  let offset = 12;
  let fmt;
  while (offset + 8 <= buf.length){
    const chunkId = buf.toString('ascii', offset, offset+4);
    const chunkSize = readUInt32LE(buf, offset+4);
    const chunkDataStart = offset+8;
    if (chunkId === 'fmt '){
      fmt = { audioFormat: readUInt16LE(buf,chunkDataStart), channels: readUInt16LE(buf,chunkDataStart+2), sampleRate: readUInt32LE(buf,chunkDataStart+4), byteRate: readUInt32LE(buf,chunkDataStart+8), blockAlign: readUInt16LE(buf,chunkDataStart+12), bitsPerSample: readUInt16LE(buf,chunkDataStart+14) };
      break;
    }
    offset = chunkDataStart + chunkSize;
  }
  if (!fmt) return { file, error: 'fmt chunk not found' };
  let warnings=[];
  if (![1,3].includes(fmt.audioFormat)) warnings.push('Non-PCM/Float format code '+fmt.audioFormat);
  if (fmt.bitsPerSample && ![8,16,24,32].includes(fmt.bitsPerSample)) warnings.push('Unusual bitsPerSample '+fmt.bitsPerSample);
  if (fmt.bitsPerSample === 24) warnings.push('24-bit WAV may fail on some Safari versions');
  if (fmt.audioFormat === 3 && fmt.bitsPerSample === 32) warnings.push('32-bit float may fail on some mobile browsers');
  return { file, ...fmt, warnings };
}

function run(){
  const base = path.join(process.cwd(),'public','content','Song','Audios','gallery');
  if (!fs.existsSync(base)){ console.error('No gallery dir', base); process.exit(1);} 
  const rows=[];
  for (const lang of fs.readdirSync(base)){
    const langDir = path.join(base,lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    for (const f of fs.readdirSync(langDir)){
      if (!f.toLowerCase().endsWith('.wav')) continue;
      rows.push(inspectWav(path.join(langDir,f)));
    }
  }
  for (const r of rows){
    if (r.error){
      console.warn('[inspectWav] ERROR', r.file, '-', r.error);
    } else {
      console.log('[inspectWav]', path.basename(r.file), `fmt=${r.audioFormat} ch=${r.channels} rate=${r.sampleRate} bits=${r.bitsPerSample}`,(r.warnings.length?(' WARN: '+r.warnings.join('; ')):'') );
    }
  }
  const problematic = rows.filter(r=>r.error || (r.warnings && r.warnings.length));
  if (problematic.length){
    console.warn(`\n[inspectWav] ${problematic.length} file(s) with potential issues.`);
  } else {
    console.log('\n[inspectWav] All WAV headers look standard (PCM/Float).');
  }
}

if (require.main === module){ run(); }
