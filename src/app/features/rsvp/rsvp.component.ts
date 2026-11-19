import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '@core/services/confetti.service';
import { environment } from '@env/environment';
import { DietaryPreference, RsvpSide, RsvpSubmission } from './rsvp.schema';
import { RsvpStore } from './rsvp.store';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <span class="text-xs uppercase tracking-widest text-gold-700 font-bold"
          >Celebrate With Us</span
        >
        <h1 class="font-serif text-3xl sm:text-5xl font-bold text-rosewood-900 mt-2 mb-3">
          RSVP & Blessings Wall
        </h1>
        <p class="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
          Your presence will make our wedding day truly unforgettable. Kindly confirm your
          attendance by December 1, 2026.
        </p>
      </div>

      <!-- Main RSVP Card -->
      <div
        class="bg-white/95 rounded-3xl border-2 border-gold-300 p-6 sm:p-10 shadow-wedding mb-16 backdrop-blur-md"
      >
        @if (store.isSuccess()) {
          <!-- Success State -->
          <div class="text-center py-10 animate-fadeIn">
            <div
              class="w-20 h-20 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              🎉
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-rosewood-900">
              Thank You For Your Response!
            </h2>
            <p class="text-sm sm:text-base text-gray-700 max-w-lg mx-auto mt-2 mb-6">
              Your RSVP has been confirmed. We eagerly await celebrating these cherished moments
              with you and your family in Jaipur.
            </p>
            <button
              (click)="submitAnotherRsvp()"
              class="px-6 py-2.5 rounded-xl bg-gold-100 hover:bg-gold-200 border border-gold-300 text-rosewood-900 font-semibold text-sm transition-all"
            >
              Submit Another Response
            </button>
          </div>
        } @else {
          <!-- RSVP Form -->
          <form (ngSubmit)="handleRsvpSubmit()" class="space-y-8">
            @if (errorMessage()) {
              <div
                class="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-sm font-medium flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <!-- Attendance Choice -->
            <div>
              <label class="block text-sm font-bold text-gray-800 mb-3"
                >Will you be attending the celebrations? *</label
              >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  (click)="model.attending = true"
                  [class.border-rosewood-700]="model.attending"
                  [class.bg-rosewood-50]="model.attending"
                  [class.ring-2]="model.attending"
                  [class.ring-rosewood-600]="model.attending"
                  class="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-gray-200 text-left transition-all hover:border-gold-300"
                >
                  <span class="text-2xl">🌹</span>
                  <div>
                    <div class="font-serif font-bold text-base text-rosewood-900">
                      Joyfully Accept
                    </div>
                    <div class="text-xs text-gray-500">I will celebrate in person with you!</div>
                  </div>
                </button>

                <button
                  type="button"
                  (click)="model.attending = false"
                  [class.border-gray-600]="!model.attending"
                  [class.bg-gray-50]="!model.attending"
                  [class.ring-2]="!model.attending"
                  [class.ring-gray-400]="!model.attending"
                  class="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-gray-200 text-left transition-all hover:border-gold-300"
                >
                  <span class="text-2xl">💌</span>
                  <div>
                    <div class="font-serif font-bold text-base text-gray-700">
                      Regretfully Decline
                    </div>
                    <div class="text-xs text-gray-500">I will celebrate in spirit from afar.</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Primary Contact Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  [(ngModel)]="model.fullName"
                  name="fullName"
                  placeholder="e.g. Ramesh Sharma"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                  >Phone Number *</label
                >
                <input
                  type="tel"
                  [(ngModel)]="model.phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                  >Email Address *</label
                >
                <input
                  type="email"
                  [(ngModel)]="model.email"
                  name="email"
                  placeholder="name@example.com"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>
            </div>

            <!-- Side & Guest Count -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                  >Which side do you belong to? *</label
                >
                <select
                  [(ngModel)]="model.side"
                  name="side"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                >
                  <option value="GROOM">Groom's Side (Sharma Family)</option>
                  <option value="BRIDE">Bride's Side (Verma Family)</option>
                  <option value="FRIEND">Friend of the Couple</option>
                  <option value="COLLEAGUE">Colleague</option>
                </select>
              </div>

              @if (model.attending) {
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                    >Total Guests (Including Yourself) *</label
                  >
                  <input
                    type="number"
                    min="1"
                    max="10"
                    [(ngModel)]="model.guestCount"
                    name="guestCount"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              }
            </div>

            @if (model.attending) {
              <!-- Events Checklist -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-2"
                  >Events You Will Attend *</label
                >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  @for (event of availableEvents; track event) {
                    <label
                      class="flex items-center gap-3 p-3 rounded-xl border border-gold-200 bg-gold-50/40 hover:bg-gold-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        [checked]="isEventSelected(event)"
                        (change)="toggleEventSelection(event)"
                        class="w-4 h-4 text-gold-600 rounded"
                      />
                      <span class="text-sm font-medium text-gray-800">{{ event }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Dietary & Stay Requirements -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                    >Dietary Preference *</label
                  >
                  <select
                    [(ngModel)]="model.dietaryPreference"
                    name="dietaryPreference"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                  >
                    <option value="VEG">Pure Vegetarian</option>
                    <option value="JAIN_VEG">Jain Vegetarian (No Onion/Garlic)</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                  </select>
                </div>

                <div class="flex flex-col justify-center">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                    >Accommodation Support</label
                  >
                  <label
                    class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 cursor-pointer bg-white hover:bg-gold-50/50"
                  >
                    <input
                      type="checkbox"
                      [(ngModel)]="model.needsAccommodation"
                      name="needsAccommodation"
                      class="w-4 h-4 text-gold-600 rounded"
                    />
                    <span class="text-xs text-gray-700 font-medium"
                      >I request room allocation at the resort</span
                    >
                  </label>
                </div>
              </div>

              <!-- Arrival details -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5"
                  >Travel & Arrival Notes (Optional)</label
                >
                <input
                  type="text"
                  [(ngModel)]="model.arrivalNotes"
                  name="arrivalNotes"
                  placeholder="e.g. Flight/Train number, expected arrival time, or special assistance"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            }

            <!-- Blessing / Congratulatory Note -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Blessing & Wishes for the Couple (Displayed on the Wishes Wall)
              </label>
              <textarea
                [(ngModel)]="model.blessingMessage"
                name="blessingMessage"
                rows="3"
                placeholder="Write your heartfelt congratulations, memories, or blessings for Ankit & Priya..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="text-center pt-2">
              <button
                type="submit"
                [disabled]="store.isSubmitting()"
                class="inline-flex items-center justify-center gap-3 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-rosewood-700 to-rosewood-900 text-white font-bold text-base shadow-wedding hover:from-rosewood-800 hover:to-rosewood-950 transition-all hover:scale-105 disabled:opacity-50"
              >
                @if (store.isSubmitting()) {
                  <span class="animate-spin">⏳</span>
                  <span>Submitting RSVP...</span>
                } @else {
                  <span>Confirm RSVP</span>
                  <span>💌</span>
                }
              </button>
            </div>
          </form>
        }
      </div>

      <!-- Public Wishes & Blessings Wall -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <span class="text-xs uppercase tracking-widest text-gold-700 font-bold">Love Notes</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-rosewood-900 mt-1">
            The Blessings Wall
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">
            Heartfelt blessings and congratulations sent by family and dear friends.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (wish of store.wishes(); track wish.author) {
            <div
              class="bg-white/80 rounded-2xl border border-gold-200 p-6 shadow-sm hover:shadow-wedding transition-all backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-serif font-bold text-base text-rosewood-900">
                    {{ wish.author }}
                  </span>
                  <span
                    [class.bg-blue-100]="wish.side === 'GROOM'"
                    [class.text-blue-800]="wish.side === 'GROOM'"
                    [class.bg-rose-100]="wish.side === 'BRIDE'"
                    [class.text-rose-800]="wish.side === 'BRIDE'"
                    [class.bg-purple-100]="wish.side === 'FRIEND' || wish.side === 'COLLEAGUE'"
                    [class.text-purple-800]="wish.side === 'FRIEND' || wish.side === 'COLLEAGUE'"
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  >
                    {{ wish.side }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 italic font-serif leading-relaxed mt-2">
                  "{{ wish.message }}"
                </p>
              </div>
              <div
                class="mt-4 pt-3 border-t border-gold-100 text-[10px] text-gray-400 flex items-center justify-between"
              >
                <span>✨ Shower of Blessings</span>
                <span>{{ wish.date | date: 'mediumDate' }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class RsvpComponent implements OnInit {
  readonly config = environment.weddingConfig;
  readonly store = inject(RsvpStore);
  private readonly confetti = inject(ConfettiService);

  readonly errorMessage = signal<string | null>(null);

  readonly availableEvents = [
    'Haldi Ceremony',
    'Mehendi & High Tea',
    'Sangeet & Musical Night',
    'Sacred Pheras & Wedding Ceremony',
    'Grand Reception Dinner',
  ];

  model: RsvpSubmission = {
    fullName: '',
    phone: '',
    email: '',
    side: 'GROOM',
    attending: true,
    guestCount: 2,
    eventsAttending: [
      'Haldi Ceremony',
      'Mehendi & High Tea',
      'Sangeet & Musical Night',
      'Sacred Pheras & Wedding Ceremony',
      'Grand Reception Dinner',
    ],
    dietaryPreference: 'VEG',
    needsAccommodation: false,
    arrivalNotes: '',
    blessingMessage: '',
  };

  ngOnInit(): void {
    this.store.initialize();
  }

  isEventSelected(eventName: string): boolean {
    return this.model.eventsAttending.includes(eventName);
  }

  toggleEventSelection(eventName: string): void {
    if (this.isEventSelected(eventName)) {
      this.model.eventsAttending = this.model.eventsAttending.filter((e) => e !== eventName);
    } else {
      this.model.eventsAttending = [...this.model.eventsAttending, eventName];
    }
  }

  async handleRsvpSubmit(): Promise<void> {
    this.errorMessage.set(null);
    const result = await this.store.submitRsvp(this.model);

    if (!result.success) {
      this.errorMessage.set(result.error ?? 'Please check the details');
      return;
    }

    this.confetti.continuousFireworks(3000);
  }

  submitAnotherRsvp(): void {
    this.store.resetSubmissionStatus();
    this.model = {
      fullName: '',
      phone: '',
      email: '',
      side: 'GROOM',
      attending: true,
      guestCount: 2,
      eventsAttending: [...this.availableEvents],
      dietaryPreference: 'VEG',
      needsAccommodation: false,
      arrivalNotes: '',
      blessingMessage: '',
    };
  }
}
