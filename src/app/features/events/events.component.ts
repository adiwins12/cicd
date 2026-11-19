import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface WeddingEvent {
  id: string;
  name: string;
  hindiName: string;
  date: string;
  time: string;
  venue: string;
  dressCode: string;
  colorTheme: string;
  description: string;
  icon: string;
  mapsUrl: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <span class="text-xs uppercase tracking-widest text-gold-700 font-bold"
          >Two Days Of Joy & Celebrations</span
        >
        <h1 class="font-serif text-3xl sm:text-5xl font-bold text-rosewood-900 mt-2 mb-3">
          Wedding Itinerary & Events
        </h1>
        <p class="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
          Join us for each auspicious ceremony, joyful celebration, and delicious feast. Please note
          the timings and suggested attire for each function.
        </p>
      </div>

      <!-- Events Timeline List -->
      <div class="space-y-8 relative">
        @for (event of events(); track event.id; let idx = $index) {
          <div
            class="bg-white/90 rounded-3xl border border-gold-200 p-6 sm:p-8 shadow-sm hover:shadow-wedding transition-all duration-300 backdrop-blur-sm group hover:-translate-y-0.5"
          >
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <!-- Left: Icon & Title -->
              <div class="flex items-start gap-4 sm:gap-6 flex-1">
                <div
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold-50 border border-gold-200 flex flex-col items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform"
                >
                  <span>{{ event.icon }}</span>
                  <span class="text-[10px] font-bold text-gold-700 uppercase mt-0.5"
                    >Step {{ idx + 1 }}</span
                  >
                </div>

                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      class="font-serif text-xs sm:text-sm text-gold-700 font-semibold uppercase tracking-wider"
                    >
                      {{ event.hindiName }}
                    </span>
                    <span
                      class="text-xs px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 font-medium"
                    >
                      {{ event.colorTheme }}
                    </span>
                  </div>

                  <h3 class="font-serif text-xl sm:text-2xl font-bold text-rosewood-900">
                    {{ event.name }}
                  </h3>

                  <p class="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl">
                    {{ event.description }}
                  </p>
                </div>
              </div>

              <!-- Right: Timing, Venue, and Actions -->
              <div
                class="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gold-100"
              >
                <div class="text-left md:text-right space-y-1">
                  <div
                    class="flex items-center md:justify-end gap-1.5 text-rosewood-900 font-bold text-sm sm:text-base"
                  >
                    <span>📅</span>
                    <span>{{ event.date }}</span>
                  </div>
                  <div
                    class="flex items-center md:justify-end gap-1.5 text-gold-800 font-medium text-xs sm:text-sm"
                  >
                    <span>⏰</span>
                    <span>{{ event.time }}</span>
                  </div>
                  <div class="text-xs text-gray-600">
                    📍 <span class="font-medium text-gray-800">{{ event.venue }}</span>
                  </div>
                  <div class="text-xs text-rosewood-700 font-medium">
                    👔 Attire: {{ event.dressCode }}
                  </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    [href]="event.mapsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-100 hover:bg-gold-200 text-rosewood-900 text-xs font-semibold transition-colors"
                  >
                    <span>🧭 Directions</span>
                  </a>
                  <button
                    (click)="downloadCalendarInvite(event)"
                    class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gold-300 hover:bg-gold-50 text-gray-800 text-xs font-semibold transition-colors"
                  >
                    <span>🗓️ Add to Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Bottom Banner -->
      <div
        class="mt-12 bg-gradient-to-r from-rosewood-900 to-rosewood-800 text-white rounded-3xl p-8 sm:p-10 shadow-wedding text-center"
      >
        <h3 class="font-serif text-2xl sm:text-3xl font-bold mb-2">
          We Can't Wait To Celebrate With You
        </h3>
        <p class="text-sm text-gold-200 max-w-xl mx-auto mb-6">
          Please confirm your attendance in advance so we can ensure the finest hospitality,
          arrangements, and seating for you and your family.
        </p>
        <a
          routerLink="/rsvp"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-rosewood-950 font-bold shadow-lg hover:from-gold-300 hover:to-gold-400 transition-all hover:scale-105"
        >
          <span>Fill Out RSVP Form</span>
          <span>→</span>
        </a>
      </div>
    </div>
  `,
})
export class EventsComponent {
  readonly events = signal<WeddingEvent[]>([
    {
      id: 'evt-1',
      name: 'Haldi Ceremony',
      hindiName: 'मंगल हल्दी',
      date: 'Thursday, Dec 17, 2026',
      time: '10:00 AM - 1:00 PM',
      venue: 'Suryavanshi Poolside Courtyard',
      dressCode: 'Shades of Yellow, Mustard & Floral Prints',
      colorTheme: 'Golden Yellow',
      description:
        'An auspicious morning of auspicious turmeric paste, marigold showers, traditional dholak, and blessings.',
      icon: '🌼',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+Resort+Jaipur',
    },
    {
      id: 'evt-2',
      name: 'Mehendi & High Tea',
      hindiName: 'रंग-बिरंगी मेहंदी',
      date: 'Thursday, Dec 17, 2026',
      time: '3:30 PM - 6:30 PM',
      venue: 'The Royal Verandah & Gulab Garden',
      dressCode: 'Indo-Western, Mint Green & Pastel Florals',
      colorTheme: 'Pastel Green & Coral',
      description:
        'Intricate henna art, refreshing artisanal coolers, Rajasthani chaat stalls, and live sitar fusion.',
      icon: '🌿',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+Resort+Jaipur',
    },
    {
      id: 'evt-3',
      name: 'Sangeet & Musical Night',
      hindiName: 'सुरमई संगीत एवं कॉकटेल',
      date: 'Thursday, Dec 17, 2026',
      time: '7:30 PM Onwards',
      venue: 'Grand Durbar Ballroom',
      dressCode: 'Sparkling Lehengas, Tuxedos & Bandhgalas',
      colorTheme: 'Midnight Blue & Gold',
      description:
        'Dance face-offs between Groom and Bride families, family skits, DJ beats, and a royal cocktail feast.',
      icon: '🪩',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+Resort+Jaipur',
    },
    {
      id: 'evt-4',
      name: 'The Baarat, Varmala & Sacred Pheras',
      hindiName: 'शुभ विवाह एवं फेरे',
      date: 'Friday, Dec 18, 2026',
      time: '4:30 PM (Baarat) | 7:00 PM (Pheras)',
      venue: 'Central Heritage Mandap Lawn',
      dressCode: 'Traditional Royal Indian Attire',
      colorTheme: 'Royal Red, Rose & Gold',
      description:
        'Grand royal Baarat procession with elephant heralds, Varmala on the lotus stage, and the sacred seven vows around the holy fire.',
      icon: '🔥',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+Resort+Jaipur',
    },
    {
      id: 'evt-5',
      name: 'Grand Reception Dinner',
      hindiName: 'शाही रिसेप्शन एवं भोज',
      date: 'Friday, Dec 18, 2026',
      time: '8:30 PM Onwards',
      venue: 'Sheesh Mahal Grand Lawns',
      dressCode: 'Black Tie / Royal Ethnic Elegance',
      colorTheme: 'Champagne & Emerald',
      description:
        'A lavish gourmet feast featuring royal Rajasthani, Awadhi, and international delicacies, family toasts, and celebration.',
      icon: '👑',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+Resort+Jaipur',
    },
  ]);

  downloadCalendarInvite(event: WeddingEvent): void {
    // Generate .ics calendar invite content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Portal//Event//EN
BEGIN:VEVENT
SUMMARY:${event.name} - Ankit & Priya's Wedding
DESCRIPTION:${event.description}\\nDress Code: ${event.dressCode}
LOCATION:${event.venue}, Jaipur
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.name.replace(/\\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
