"use client";
import React from 'react';
import { loadSongAudios, formatAudioLabel, SongAudioFile } from '@/utils/songAudio';

export default function SongGallery({ title = 'Audio Samples', subtitle = 'Tap to play / pause' }: { title?: string; subtitle?: string }) {
  const [files, setFiles] = React.useState<SongAudioFile[]>([]);
  const [current, setCurrent] = React.useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    loadSongAudios(24).then(setFiles).catch(()=>{});
  }, []);

  const play = (idx: number) => {
    let el = audioRef.current;
    if (!el) {
      el = document.createElement('audio');
      el.preload = 'metadata';
      el.style.display = 'none';
      document.body.appendChild(el);
      audioRef.current = el;
    }
    if (current === idx && el && !el.paused) {
      el.pause();
      setCurrent(null);
      return;
    }
    const file = files[idx];
    if (!file) return;
    el.src = file.url;
    el.play().then(()=> setCurrent(idx)).catch(()=>{});
  };

  return (
    <div className="py-10">
      <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>
      {files.length === 0 && <p className="text-center text-sm text-gray-500">Loading audios...</p>}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-5xl mx-auto">
        {files.map((f, i) => (
          <button key={f.name} onClick={() => play(i)} className={`border rounded p-4 flex flex-col items-center gap-2 hover:bg-primary/5 transition ${current===i ? 'ring-2 ring-primary' : 'bg-white dark:bg-gray-900'}`}> 
            <span className="text-sm font-medium">Sample {i+1}</span>
            <span className="text-xs text-gray-500">{formatAudioLabel(f.name)}</span>
            <span className="text-xs text-primary font-semibold">{current===i ? 'Playing…' : 'Play'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
