let singletonAudio: HTMLAudioElement | null = null;

export function getGlobalAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!singletonAudio) {
    singletonAudio = document.createElement('audio');
  // Avoid implicit network activity; we'll load on demand when user plays
  singletonAudio.preload = 'none';
    singletonAudio.style.display = 'none';
    singletonAudio.setAttribute('data-global-audio', 'true');
    document.body.appendChild(singletonAudio);
  }
  return singletonAudio;
}

export function isGlobalAudio(el: HTMLAudioElement | null | undefined): boolean {
  return !!el && el === singletonAudio;
}
