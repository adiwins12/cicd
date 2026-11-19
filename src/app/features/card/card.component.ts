import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AudioService } from '@core/services/audio.service';
import { ConfettiService } from '@core/services/confetti.service';
import { environment } from '@env/environment';
import { CountdownComponent } from '@shared/components/countdown/countdown.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CountdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative min-h-screen overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <!-- Decorative Background Ornaments -->
      <div
        class="absolute -top-32 -left-32 w-96 h-96 bg-gold-200/40 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        class="absolute top-1/3 -right-32 w-96 h-96 bg-rosewood-200/30 rounded-full blur-3xl pointer-events-none"
      ></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <!-- Auspicious Header -->
        <div class="text-center mb-8 animate-fadeIn">
          <p class="font-serif text-gold-700 tracking-widest text-sm uppercase mb-2">
            ॐ श्री गणेशाय नमः
          </p>
          <p class="font-display text-2xl sm:text-3xl text-rosewood-800">
            With the blessings of our ancestors and families
          </p>
        </div>

        <!-- The Interactive Wedding Card Envelope / Box -->
        <div
          class="relative bg-white/95 rounded-3xl border-2 border-gold-300 shadow-wedding p-6 sm:p-12 mb-16 backdrop-blur-md"
        >
          <!-- Ornate Inner Frame -->
          <div class="border border-gold-300/80 rounded-2xl p-6 sm:p-10 relative text-center">
            <!-- Corner Decorative Badges -->
            <div
              class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gold-500"
            ></div>
            <div
              class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gold-500"
            ></div>
            <div
              class="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gold-500"
            ></div>
            <div
              class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gold-500"
            ></div>

            <!-- Invitation Subtitle -->
            <p
              class="font-serif uppercase tracking-[0.25em] text-xs sm:text-sm text-gold-600 font-semibold mb-4"
            >
              We joyfully invite you to celebrate the marriage of
            </p>

            <!-- Couple Names -->
            <div class="my-6">
              <h1
                class="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-rosewood-900 leading-tight"
              >
                {{ config.groomName }}
              </h1>
              <div class="flex items-center justify-center my-3 gap-4">
                <span class="h-px w-12 sm:w-20 bg-gold-400"></span>
                <span class="font-display text-4xl sm:text-5xl text-gold-600">&</span>
                <span class="h-px w-12 sm:w-20 bg-gold-400"></span>
              </div>
              <h1
                class="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-rosewood-900 leading-tight"
              >
                {{ config.brideName }}
              </h1>
            </div>

            <!-- Family Details -->
            <div class="max-w-xl mx-auto my-6 text-sm sm:text-base text-gray-700 space-y-2">
              <p>
                <span class="font-semibold text-rosewood-900">Groom:</span> Son of Smt. Sunita &
                Shri Ramesh Sharma
              </p>
              <p>
                <span class="font-semibold text-rosewood-900">Bride:</span> Daughter of Smt. Kavita
                & Shri Rajesh Verma
              </p>
            </div>

            <div class="w-24 h-px bg-gold-300 mx-auto my-8"></div>

            <!-- Date, Venue & City -->
            <div class="space-y-3">
              <p class="font-serif text-xl sm:text-2xl text-rosewood-800 font-semibold">
                Friday, December 18, 2026
              </p>
              <p class="text-base text-gray-700">
                <span class="font-medium text-gold-800">{{ config.venue }}</span>
                <br />
                <span>{{ config.city }}</span>
              </p>
            </div>

            <!-- Wax Seal / Confetti Trigger Button -->
            <div class="mt-8 flex flex-col items-center">
              <button
                (click)="triggerCelebration()"
                class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium shadow-wedding hover:from-gold-600 hover:to-gold-700 transition-all hover:scale-105 active:scale-95"
              >
                <span class="text-xl">✨</span>
                <span>{{
                  celebrationClicked() ? 'Celebrate Again! 🎉' : 'Shower Blessings (Celebrate)'
                }}</span>
              </button>
              <p class="text-xs text-gray-500 mt-2">
                Click to shower flowers & confetti on the couple
              </p>
            </div>
          </div>
        </div>

        <!-- Live Countdown Section -->
        <div
          class="bg-white/80 rounded-3xl border border-gold-200/80 p-8 shadow-sm text-center mb-16 backdrop-blur-sm"
        >
          <p class="text-xs uppercase tracking-widest text-gold-700 font-bold mb-2">
            Counting Down To The Big Day
          </p>
          <h2 class="font-serif text-2xl sm:text-3xl text-rosewood-900 font-bold">
            The Celebration Awaits
          </h2>

          <app-countdown [targetDate]="config.weddingDate" />

          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <a
              routerLink="/rsvp"
              class="px-6 py-3 rounded-xl bg-rosewood-800 text-white font-medium shadow-wedding hover:bg-rosewood-900 transition-all hover:scale-105"
            >
              Submit RSVP
            </a>
            <a
              routerLink="/events"
              class="px-6 py-3 rounded-xl bg-gold-100 text-rosewood-900 border border-gold-300 font-medium hover:bg-gold-200 transition-all"
            >
              View Itinerary
            </a>
            <a
              routerLink="/relatives"
              class="px-6 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 font-medium hover:bg-gold-50 transition-all"
            >
              Meet The Relatives
            </a>
          </div>
        </div>

        <!-- The Couple's Love Story Timeline -->
        <div
          class="bg-white/80 rounded-3xl border border-gold-200/80 p-8 sm:p-12 shadow-sm backdrop-blur-sm mb-16"
        >
          <div class="text-center mb-12">
            <span class="text-xs uppercase tracking-widest text-gold-600 font-bold"
              >Our Journey</span
            >
            <h2 class="font-serif text-3xl sm:text-4xl text-rosewood-900 font-bold mt-1">
              How Forever Began
            </h2>
          </div>

          <div
            class="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gold-200 hidden md:block"
          >
            <!-- Timeline Item 1 -->
            <div class="relative flex items-center justify-between">
              <div class="w-5/12 text-right pr-8">
                <span class="text-xs font-bold text-gold-600 uppercase">November 2021</span>
                <h4 class="font-serif text-lg font-bold text-rosewood-900 mt-1">
                  The First Coffee & Spark
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  A casual coffee date turned into a four-hour conversation about dreams, music, and
                  travel.
                </p>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-gold-400 border-4 border-white shadow-md z-10 flex items-center justify-center text-xs"
              >
                ☕
              </div>
              <div class="w-5/12"></div>
            </div>

            <!-- Timeline Item 2 -->
            <div class="relative flex items-center justify-between">
              <div class="w-5/12"></div>
              <div
                class="w-8 h-8 rounded-full bg-rosewood-500 border-4 border-white shadow-md z-10 flex items-center justify-center text-xs"
              >
                🏔️
              </div>
              <div class="w-5/12 pl-8">
                <span class="text-xs font-bold text-gold-600 uppercase">March 2024</span>
                <h4 class="font-serif text-lg font-bold text-rosewood-900 mt-1">
                  The Mountain Proposal
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  Surrounded by snow peaks in Himachal, Ankit went down on one knee, and Priya said
                  yes with tears of joy.
                </p>
              </div>
            </div>

            <!-- Timeline Item 3 -->
            <div class="relative flex items-center justify-between">
              <div class="w-5/12 text-right pr-8">
                <span class="text-xs font-bold text-gold-600 uppercase">December 2026</span>
                <h4 class="font-serif text-lg font-bold text-rosewood-900 mt-1">
                  The Royal Wedding
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  Gathering our beloved relatives, friends, and family to take the sacred seven vows
                  together.
                </p>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-gold-500 border-4 border-white shadow-md z-10 flex items-center justify-center text-xs"
              >
                💍
              </div>
              <div class="w-5/12"></div>
            </div>
          </div>

          <!-- Mobile Timeline View -->
          <div class="space-y-6 md:hidden">
            <div class="p-4 rounded-2xl bg-gold-50/50 border border-gold-200">
              <span class="text-xs font-bold text-gold-600 uppercase">November 2021</span>
              <h4 class="font-serif text-base font-bold text-rosewood-900 mt-1">
                ☕ The First Coffee & Spark
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                A casual coffee turned into hours of laughter and conversation.
              </p>
            </div>
            <div class="p-4 rounded-2xl bg-rosewood-50/50 border border-rosewood-200">
              <span class="text-xs font-bold text-rosewood-600 uppercase">March 2024</span>
              <h4 class="font-serif text-base font-bold text-rosewood-900 mt-1">
                🏔️ The Mountain Proposal
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                Surrounded by snow peaks in Himachal, she said yes!
              </p>
            </div>
            <div class="p-4 rounded-2xl bg-gold-50/50 border border-gold-200">
              <span class="text-xs font-bold text-gold-600 uppercase">December 2026</span>
              <h4 class="font-serif text-base font-bold text-rosewood-900 mt-1">
                💍 The Royal Wedding
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                Taking our sacred seven vows surrounded by all our loved ones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CardComponent {
  readonly config = environment.weddingConfig;
  private readonly confetti = inject(ConfettiService);
  private readonly audioService = inject(AudioService);
  readonly celebrationClicked = signal<boolean>(false);

  triggerCelebration(): void {
    this.celebrationClicked.set(true);
    this.confetti.celebrate();
    if (!this.audioService.isPlaying()) {
      this.audioService.togglePlay();
    }
  }
}
