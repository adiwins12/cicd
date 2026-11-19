import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  celebrate(): void {
    if (typeof window === 'undefined') return;

    // Royal gold, rosewood, and champagne confetti colors
    const colors = ['#d5a159', '#c58634', '#be415b', '#f7d5db', '#fffff8'];

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }

  continuousFireworks(durationMs = 2500): void {
    if (typeof window === 'undefined') return;

    const animationEnd = Date.now() + durationMs;
    const colors = ['#d5a159', '#e1be88', '#be415b', '#fbe8eb'];

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / durationMs);

      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);
  }
}
