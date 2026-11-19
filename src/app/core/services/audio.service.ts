import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  readonly isPlaying = signal<boolean>(false);
  readonly isMuted = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      // Royalty-free acoustic ambient celebratory music
      this.audio = new Audio(
        'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89e248b64.mp3?filename=indian-wedding-flute-111162.mp3'
      );
      this.audio.loop = true;
      this.audio.volume = 0.4;

      this.audio.addEventListener('play', () => this.isPlaying.set(true));
      this.audio.addEventListener('pause', () => this.isPlaying.set(false));
      this.audio.addEventListener('ended', () => this.isPlaying.set(false));
    }
  }

  togglePlay(): void {
    if (!this.audio) return;
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch((err) => {
        console.warn('Audio playback prevented by browser autoplay policy:', err);
      });
    }
  }

  toggleMute(): void {
    if (!this.audio) return;
    this.audio.muted = !this.audio.muted;
    this.isMuted.set(this.audio.muted);
  }
}
