import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RelativesStore } from '@features/relatives/relative.store';
import { RsvpStore } from '@features/rsvp/rsvp.store';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span class="text-xs uppercase tracking-widest text-gold-700 font-bold"
            >Family Coordinator Portal</span
          >
          <h1 class="font-serif text-3xl sm:text-4xl font-bold text-rosewood-900 mt-1">
            Host & Guest Management Dashboard
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">
            Real-time headcounts, meal requirements, room accommodations, and guest lists.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="exportGuestListCsv()"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <span>📥 Export to CSV</span>
          </button>
          <button
            (click)="resetDemoData()"
            class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-300 hover:bg-white text-gray-700 text-xs font-medium transition-all"
            title="Reset to default mock dataset"
          >
            <span>🔄 Reset Data</span>
          </button>
        </div>
      </div>

      <!-- KPI Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="bg-white rounded-3xl border border-gold-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >Confirmed Attendees</span
            >
            <span class="w-9 h-9 rounded-xl bg-gold-100 flex items-center justify-center text-lg"
              >👥</span
            >
          </div>
          <div class="text-3xl font-serif font-bold text-rosewood-900">
            {{ rsvpStore.totalConfirmedAttendees() }}
          </div>
          <p class="text-xs text-gold-700 mt-1">
            From {{ rsvpStore.totalRsvpsReceived() }} RSVP responses
          </p>
        </div>

        <div class="bg-white rounded-3xl border border-gold-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >Family Directory</span
            >
            <span
              class="w-9 h-9 rounded-xl bg-rosewood-100 flex items-center justify-center text-lg"
              >👑</span
            >
          </div>
          <div class="text-3xl font-serif font-bold text-rosewood-900">
            {{ relativesStore.totalCount() }}
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Groom: {{ relativesStore.groomSideCount() }} | Bride:
            {{ relativesStore.brideSideCount() }}
          </p>
        </div>

        <div class="bg-white rounded-3xl border border-gold-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >Hotel Rooms Requested</span
            >
            <span class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-lg"
              >🏨</span
            >
          </div>
          <div class="text-3xl font-serif font-bold text-blue-900">
            {{ rsvpStore.accommodationRequests() }}
          </div>
          <p class="text-xs text-blue-700 mt-1">Resort accommodation needed</p>
        </div>

        <div class="bg-white rounded-3xl border border-gold-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >Pure Veg / Jain Meals</span
            >
            <span class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg"
              >🥗</span
            >
          </div>
          <div class="text-3xl font-serif font-bold text-emerald-900">
            {{ rsvpStore.dietaryBreakdown().veg + rsvpStore.dietaryBreakdown().jain }}
          </div>
          <p class="text-xs text-emerald-700 mt-1">
            Veg: {{ rsvpStore.dietaryBreakdown().veg }} | Jain:
            {{ rsvpStore.dietaryBreakdown().jain }}
          </p>
        </div>
      </div>

      <!-- Meal & Catering Breakdown Bar -->
      <div class="bg-white rounded-3xl border border-gold-200 p-6 shadow-sm mb-10">
        <h3 class="font-serif text-lg font-bold text-rosewood-900 mb-4">
          Catering & Dietary Breakdown
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <span class="text-xs font-bold text-emerald-800 uppercase">Pure Veg</span>
            <div class="text-2xl font-bold text-emerald-900 mt-1">
              {{ rsvpStore.dietaryBreakdown().veg }}
            </div>
            <span class="text-[10px] text-emerald-700">Guests</span>
          </div>

          <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <span class="text-xs font-bold text-amber-800 uppercase">Jain Vegetarian</span>
            <div class="text-2xl font-bold text-amber-900 mt-1">
              {{ rsvpStore.dietaryBreakdown().jain }}
            </div>
            <span class="text-[10px] text-amber-700">No onion / garlic</span>
          </div>

          <div class="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
            <span class="text-xs font-bold text-rose-800 uppercase">Non-Veg</span>
            <div class="text-2xl font-bold text-rose-900 mt-1">
              {{ rsvpStore.dietaryBreakdown().nonVeg }}
            </div>
            <span class="text-[10px] text-rose-700">Guests</span>
          </div>

          <div class="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
            <span class="text-xs font-bold text-purple-800 uppercase">Vegan</span>
            <div class="text-2xl font-bold text-purple-900 mt-1">
              {{ rsvpStore.dietaryBreakdown().vegan }}
            </div>
            <span class="text-[10px] text-purple-700">Plant-based</span>
          </div>
        </div>
      </div>

      <!-- Detailed RSVP Responses Table -->
      <div class="bg-white rounded-3xl border border-gold-200 shadow-sm overflow-hidden mb-12">
        <div class="p-6 border-b border-gold-100 flex items-center justify-between">
          <div>
            <h3 class="font-serif text-xl font-bold text-rosewood-900">RSVP Responses Log</h3>
            <p class="text-xs text-gray-500">Live synchronized records from guest submissions</p>
          </div>
          <span class="text-xs font-bold bg-gold-100 text-rosewood-900 px-3 py-1 rounded-full">
            {{ rsvpStore.rsvps().length }} Total Submissions
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gold-50/70 border-b border-gold-200 text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              <tr>
                <th class="py-3.5 px-6">Guest Name</th>
                <th class="py-3.5 px-4">Side</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Headcount</th>
                <th class="py-3.5 px-4">Diet</th>
                <th class="py-3.5 px-4">Room Needed</th>
                <th class="py-3.5 px-6">Phone & Email</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gold-100 text-xs sm:text-sm">
              @for (entry of rsvpStore.rsvps(); track entry.id) {
                <tr class="hover:bg-gold-50/40 transition-colors">
                  <td class="py-4 px-6 font-medium text-gray-900">
                    <div>{{ entry.fullName }}</div>
                    @if (entry.arrivalNotes) {
                      <div class="text-[11px] text-gray-500 italic mt-0.5">
                        Note: {{ entry.arrivalNotes }}
                      </div>
                    }
                  </td>
                  <td class="py-4 px-4">
                    <span
                      [class.bg-blue-100]="entry.side === 'GROOM'"
                      [class.text-blue-800]="entry.side === 'GROOM'"
                      [class.bg-rose-100]="entry.side === 'BRIDE'"
                      [class.text-rose-800]="entry.side === 'BRIDE'"
                      [class.bg-gray-100]="entry.side === 'FRIEND' || entry.side === 'COLLEAGUE'"
                      [class.text-gray-800]="entry.side === 'FRIEND' || entry.side === 'COLLEAGUE'"
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase"
                    >
                      {{ entry.side }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    @if (entry.attending) {
                      <span class="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <span>✓</span> Attending
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-gray-400 font-medium">
                        <span>✗</span> Declined
                      </span>
                    }
                  </td>
                  <td class="py-4 px-4 font-bold text-gray-900">
                    {{ entry.attending ? entry.guestCount : 0 }}
                  </td>
                  <td class="py-4 px-4 text-gray-700">
                    {{ entry.dietaryPreference }}
                  </td>
                  <td class="py-4 px-4">
                    @if (entry.needsAccommodation) {
                      <span
                        class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200"
                      >
                        Yes
                      </span>
                    } @else {
                      <span class="text-gray-400">No</span>
                    }
                  </td>
                  <td class="py-4 px-6 text-gray-600">
                    <div>{{ entry.phone }}</div>
                    <div class="text-xs text-gray-400">{{ entry.email }}</div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  readonly rsvpStore = inject(RsvpStore);
  readonly relativesStore = inject(RelativesStore);

  ngOnInit(): void {
    this.rsvpStore.initialize();
    this.relativesStore.initialize();
  }

  exportGuestListCsv(): void {
    const rsvps = this.rsvpStore.rsvps();
    const headers = [
      'Full Name',
      'Side',
      'Attending',
      'Guests',
      'Diet',
      'Accommodation',
      'Phone',
      'Email',
      'Arrival Notes',
    ];
    const rows = rsvps.map((r) => [
      `"${r.fullName}"`,
      r.side,
      r.attending ? 'Yes' : 'No',
      r.guestCount,
      r.dietaryPreference,
      r.needsAccommodation ? 'Yes' : 'No',
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.arrivalNotes ?? ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding_guest_rsvp_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  resetDemoData(): void {
    if (confirm('Reset RSVPs and Relatives list to original mock values?')) {
      this.rsvpStore.resetToDefault();
      this.relativesStore.resetToDefault();
    }
  }
}
