interface PlaybackState { index: number | null; baseName: string; time: number; ts: number; }

const playbackState: PlaybackState = { index: null, baseName: '', time: 0, ts: 0 };

export function setPlaybackState(partial: Partial<PlaybackState>) {
  Object.assign(playbackState, partial, { ts: Date.now() });
  if (typeof window !== 'undefined') {
    try { sessionStorage.setItem('global_playback_state_v1', JSON.stringify(playbackState)); } catch {}
  }
}

export function getPlaybackState(): PlaybackState {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('global_playback_state_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(playbackState, parsed);
      }
    } catch {}
  }
  return playbackState;
}
