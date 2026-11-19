import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="bg-gradient-to-b from-champagne to-gold-100 border-t border-gold-200/80 pt-16 pb-12"
    >
      <div class="max-w-6xl mx-auto px-4 text-center">
        <!-- Couple Monogram -->
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold-400 bg-white flex items-center justify-center shadow-wedding"
        >
          <span class="font-display text-3xl text-rosewood-800">A&P</span>
        </div>

        <h3 class="font-serif text-2xl font-bold text-rosewood-900 mb-2">
          {{ config.groomName }} & {{ config.brideName }}
        </h3>

        <p class="font-display text-2xl text-gold-700 italic mb-6">"{{ config.tagline }}"</p>

        <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-700 mb-8">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            December 18, 2026
          </span>

          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ config.venue }}, {{ config.city }}
          </span>

          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {{ config.contactEmail }}
          </span>
        </div>

        <!-- Quick Links -->
        <div class="flex justify-center gap-6 text-sm font-medium text-rosewood-800 mb-8">
          <a routerLink="/card" class="hover:underline">The Card</a>
          <a routerLink="/events" class="hover:underline">Itinerary</a>
          <a routerLink="/relatives" class="hover:underline">Relatives</a>
          <a routerLink="/rsvp" class="hover:underline">RSVP</a>
          <a routerLink="/admin" class="hover:underline">Family Dashboard</a>
        </div>

        <p class="text-xs text-gray-500">
          Crafted with love & blessings for the wedding celebration. Built with Angular 18, NgRx
          Signals, Zod & Tailwind CSS.
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly config = environment.weddingConfig;
}
