import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioService } from '@core/services/audio.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-50 bg-champagne/85 backdrop-blur-md border-b border-gold-200/60 shadow-sm transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Monogram / Logo -->
          <a routerLink="/card" class="flex items-center gap-3 group">
            <div
              class="w-11 h-11 rounded-full border-2 border-gold-400 bg-white flex items-center justify-center shadow-wedding group-hover:scale-105 transition-transform"
            >
              <span class="font-display text-2xl text-rosewood-800">A&P</span>
            </div>
            <div class="flex flex-col">
              <span
                class="font-serif font-bold text-lg text-rosewood-900 tracking-wide group-hover:text-gold-700 transition-colors"
              >
                {{ config.groomName }} & {{ config.brideName }}
              </span>
              <span class="text-[10px] tracking-widest uppercase text-gold-600 font-medium"
                >The Wedding Portal</span
              >
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            @for (item of navLinks; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-gold-100/90 text-rosewood-900 border-gold-300 shadow-sm"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-rosewood-800 hover:bg-gold-50/80 border border-transparent transition-all"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <!-- Action Controls (Music + Mobile Menu Button) -->
          <div class="flex items-center gap-3">
            <!-- Music Player Button -->
            <button
              (click)="audioService.togglePlay()"
              [title]="
                audioService.isPlaying()
                  ? 'Pause Ambient Wedding Music'
                  : 'Play Ambient Wedding Music'
              "
              class="relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-gold-300/80 bg-white/80 hover:bg-gold-50 shadow-sm transition-all"
            >
              <div class="flex items-center gap-0.5 h-4">
                <span
                  class="w-1 bg-rosewood-700 rounded-full transition-all duration-300"
                  [class.animate-pulse]="audioService.isPlaying()"
                  [class.h-4]="audioService.isPlaying()"
                  [class.h-2]="!audioService.isPlaying()"
                ></span>
                <span
                  class="w-1 bg-gold-600 rounded-full transition-all duration-300"
                  [class.animate-bounce]="audioService.isPlaying()"
                  [class.h-3]="audioService.isPlaying()"
                  [class.h-1.5]="!audioService.isPlaying()"
                ></span>
                <span
                  class="w-1 bg-rosewood-700 rounded-full transition-all duration-300"
                  [class.animate-pulse]="audioService.isPlaying()"
                  [class.h-4]="audioService.isPlaying()"
                  [class.h-2]="!audioService.isPlaying()"
                ></span>
              </div>
              <span class="text-xs font-medium text-rosewood-900 hidden sm:inline">
                {{ audioService.isPlaying() ? 'Music Playing' : 'Play Music' }}
              </span>
            </button>

            <!-- RSVP Quick Action Button (Desktop) -->
            <a
              routerLink="/rsvp"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rosewood-700 to-rosewood-900 hover:from-rosewood-800 hover:to-rosewood-950 rounded-xl shadow-wedding transition-transform hover:scale-105"
            >
              RSVP Now
            </a>

            <!-- Mobile Hamburger Toggle -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gold-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (isMobileMenuOpen()) {
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                } @else {
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      @if (isMobileMenuOpen()) {
        <div
          class="md:hidden bg-champagne/95 border-b border-gold-200 px-4 pt-2 pb-6 space-y-2 backdrop-blur-lg animate-fadeIn"
        >
          @for (item of navLinks; track item.path) {
            <a
              [routerLink]="item.path"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-gold-100 text-rosewood-900 font-semibold"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="block px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gold-50"
            >
              {{ item.label }}
            </a>
          }
          <div class="pt-2">
            <a
              routerLink="/rsvp"
              (click)="closeMobileMenu()"
              class="block w-full text-center px-4 py-3 text-base font-medium text-white bg-rosewood-800 rounded-xl shadow-md"
            >
              RSVP Now
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly config = environment.weddingConfig;
  readonly audioService = inject(AudioService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  readonly navLinks = [
    { label: 'Wedding Card', path: '/card', exact: true },
    { label: 'Itinerary & Events', path: '/events', exact: false },
    { label: 'Relatives & Guests', path: '/relatives', exact: false },
    { label: 'RSVP & Wishes', path: '/rsvp', exact: false },
    { label: 'Host Dashboard', path: '/admin', exact: false },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
