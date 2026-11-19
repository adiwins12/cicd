import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-6">
      <div
        class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border border-gold-200/80 rounded-2xl w-20 h-24 sm:w-28 sm:h-32 shadow-wedding transition-transform hover:-translate-y-1"
      >
        <span class="text-2xl sm:text-4xl font-serif font-bold text-rosewood-800">{{
          timeLeft().days
        }}</span>
        <span class="text-xs uppercase tracking-widest text-gold-700 font-medium mt-1">Days</span>
      </div>

      <div class="text-2xl sm:text-3xl font-serif text-gold-400 self-center hidden sm:block">:</div>

      <div
        class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border border-gold-200/80 rounded-2xl w-20 h-24 sm:w-28 sm:h-32 shadow-wedding transition-transform hover:-translate-y-1"
      >
        <span class="text-2xl sm:text-4xl font-serif font-bold text-rosewood-800">{{
          timeLeft().hours
        }}</span>
        <span class="text-xs uppercase tracking-widest text-gold-700 font-medium mt-1">Hours</span>
      </div>

      <div class="text-2xl sm:text-3xl font-serif text-gold-400 self-center hidden sm:block">:</div>

      <div
        class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border border-gold-200/80 rounded-2xl w-20 h-24 sm:w-28 sm:h-32 shadow-wedding transition-transform hover:-translate-y-1"
      >
        <span class="text-2xl sm:text-4xl font-serif font-bold text-rosewood-800">{{
          timeLeft().minutes
        }}</span>
        <span class="text-xs uppercase tracking-widest text-gold-700 font-medium mt-1">Mins</span>
      </div>

      <div class="text-2xl sm:text-3xl font-serif text-gold-400 self-center hidden sm:block">:</div>

      <div
        class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border border-gold-200/80 rounded-2xl w-20 h-24 sm:w-28 sm:h-32 shadow-wedding transition-transform hover:-translate-y-1"
      >
        <span class="text-2xl sm:text-4xl font-serif font-bold text-gold-600 animate-pulse">{{
          timeLeft().seconds
        }}</span>
        <span class="text-xs uppercase tracking-widest text-gold-700 font-medium mt-1">Secs</span>
      </div>
    </div>
  `,
})
export class CountdownComponent implements OnInit {
  readonly targetDate = input.required<string>();
  private readonly destroyRef = inject(DestroyRef);

  readonly timeLeft = signal<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  ngOnInit(): void {
    this.calculateTimeLeft();

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calculateTimeLeft();
      });
  }

  private calculateTimeLeft(): void {
    const target = new Date(this.targetDate()).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.timeLeft.set({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    this.timeLeft.set({
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
    });
  }
}
