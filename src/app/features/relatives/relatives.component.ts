import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '@core/services/confetti.service';
import { CreateRelativeDto, RelativeCategory, RelativeSide } from './relative.schema';
import { RelativesStore } from './relative.store';

@Component({
  selector: 'app-relatives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="text-center mb-10">
        <span class="text-xs uppercase tracking-widest text-gold-700 font-bold"
          >Family & Friends Directory</span
        >
        <h1 class="font-serif text-3xl sm:text-5xl font-bold text-rosewood-900 mt-2 mb-3">
          Our Beloved Relatives
        </h1>
        <p class="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
          A celebration is complete only with the presence, warmth, and blessings of our family.
          Find and connect with relatives from both the Groom and Bride's sides.
        </p>

        <!-- Stats Overview Pills -->
        <div class="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6">
          <div
            class="bg-white/80 border border-gold-200 rounded-full px-5 py-2 text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <span class="font-bold text-rosewood-900">{{ store.totalCount() }}</span> Total Family
            Members
          </div>
          <div
            class="bg-blue-50 border border-blue-200 rounded-full px-5 py-2 text-xs sm:text-sm shadow-sm flex items-center gap-2 text-blue-900"
          >
            <span class="font-bold">{{ store.groomSideCount() }}</span> Groom's Side
          </div>
          <div
            class="bg-rose-50 border border-rose-200 rounded-full px-5 py-2 text-xs sm:text-sm shadow-sm flex items-center gap-2 text-rose-900"
          >
            <span class="font-bold">{{ store.brideSideCount() }}</span> Bride's Side
          </div>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div
        class="bg-white/90 border border-gold-200 rounded-3xl p-6 shadow-sm mb-10 backdrop-blur-sm"
      >
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <!-- Live Debounced Search Input (RxJS) -->
          <div class="relative flex-1">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              [ngModel]="searchInput()"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search by relative name, relation (e.g. Chacha, Nana), or city..."
              class="w-full pl-11 pr-4 py-3 rounded-2xl bg-gold-50/50 border border-gold-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm text-gray-800 placeholder-gray-400 transition-all"
            />
          </div>

          <!-- Side Toggle Tabs -->
          <div
            class="flex items-center gap-1.5 p-1.5 bg-gold-100/70 rounded-2xl border border-gold-200"
          >
            <button
              (click)="store.setSide('ALL')"
              [class.bg-white]="store.selectedSide() === 'ALL'"
              [class.text-rosewood-900]="store.selectedSide() === 'ALL'"
              [class.shadow-sm]="store.selectedSide() === 'ALL'"
              class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-all"
            >
              All Sides
            </button>
            <button
              (click)="store.setSide('GROOM')"
              [class.bg-white]="store.selectedSide() === 'GROOM'"
              [class.text-blue-900]="store.selectedSide() === 'GROOM'"
              [class.shadow-sm]="store.selectedSide() === 'GROOM'"
              class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-all"
            >
              Groom's Side
            </button>
            <button
              (click)="store.setSide('BRIDE')"
              [class.bg-white]="store.selectedSide() === 'BRIDE'"
              [class.text-rose-900]="store.selectedSide() === 'BRIDE'"
              [class.shadow-sm]="store.selectedSide() === 'BRIDE'"
              class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-all"
            >
              Bride's Side
            </button>
          </div>

          <!-- Add Relative Action Button -->
          <button
            (click)="openAddModal()"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rosewood-700 to-rosewood-900 text-white text-sm font-medium shadow-wedding hover:from-rosewood-800 hover:to-rosewood-950 transition-all hover:scale-105"
          >
            <span>+ Add Relative</span>
          </button>
        </div>

        <!-- Category Pills Filter -->
        <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gold-100">
          <span class="text-xs font-semibold text-gold-800 mr-2 uppercase tracking-wider"
            >Category:</span
          >
          @for (cat of categories; track cat.value) {
            <button
              (click)="store.setCategory(cat.value)"
              [class.bg-rosewood-800]="store.selectedCategory() === cat.value"
              [class.text-white]="store.selectedCategory() === cat.value"
              [class.bg-white]="store.selectedCategory() !== cat.value"
              [class.text-gray-700]="store.selectedCategory() !== cat.value"
              class="px-3 py-1 rounded-full text-xs font-medium border border-gold-200 hover:bg-gold-50 transition-colors shadow-2xs"
            >
              {{ cat.label }}
            </button>
          }
        </div>
      </div>

      <!-- Relatives Grid -->
      @if (store.filteredRelatives().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (relative of store.filteredRelatives(); track relative.id) {
            <div
              class="bg-white rounded-3xl border border-gold-200/90 p-6 shadow-sm hover:shadow-wedding transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              <!-- Side Badge Ribbon -->
              <div class="flex items-center justify-between mb-4">
                <span
                  [class.bg-blue-100]="relative.side === 'GROOM'"
                  [class.text-blue-800]="relative.side === 'GROOM'"
                  [class.bg-rose-100]="relative.side === 'BRIDE'"
                  [class.text-rose-800]="relative.side === 'BRIDE'"
                  [class.bg-purple-100]="relative.side === 'COMMON'"
                  [class.text-purple-800]="relative.side === 'COMMON'"
                  class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {{
                    relative.side === 'GROOM'
                      ? "Groom's Side"
                      : relative.side === 'BRIDE'
                        ? "Bride's Side"
                        : 'Mutual / Family'
                  }}
                </span>

                @if (relative.isVIP) {
                  <span
                    class="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200"
                  >
                    ⭐ VIP Guest
                  </span>
                }
              </div>

              <!-- Main Relative Information -->
              <div>
                <div class="flex items-center gap-4 mb-3">
                  <div
                    class="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform"
                  >
                    {{ relative.avatarEmoji }}
                  </div>
                  <div>
                    <h3 class="font-serif text-lg font-bold text-rosewood-900 leading-snug">
                      {{ relative.name }}
                    </h3>
                    <p class="text-xs font-medium text-gold-700 mt-0.5">
                      {{ relative.relationTitle }}
                    </p>
                  </div>
                </div>

                @if (relative.bio) {
                  <p
                    class="text-xs text-gray-600 italic line-clamp-3 my-3 bg-champagne/40 p-3 rounded-xl border border-gold-100"
                  >
                    "{{ relative.bio }}"
                  </p>
                }
              </div>

              <!-- Bottom Meta (City & Room/Table) -->
              <div
                class="mt-4 pt-3 border-t border-gold-100 flex items-center justify-between text-xs text-gray-500"
              >
                <span class="flex items-center gap-1"> 📍 {{ relative.city }} </span>
                @if (relative.tableOrRoom) {
                  <span
                    class="font-medium text-rosewood-800 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200"
                  >
                    🏠 {{ relative.tableOrRoom }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-16 bg-white/70 rounded-3xl border border-gold-200 p-8">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="font-serif text-xl font-bold text-rosewood-900">No Relatives Found</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
            We couldn't find any family members matching your current search query or filter.
          </p>
          <button
            (click)="resetFilters()"
            class="px-5 py-2.5 rounded-xl bg-gold-100 border border-gold-300 text-rosewood-900 text-sm font-medium hover:bg-gold-200 transition-all"
          >
            Clear Filters
          </button>
        </div>
      }

      <!-- Add Relative Modal Dialog (Zod validated) -->
      @if (isModalOpen()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
        >
          <div
            class="bg-white rounded-3xl border-2 border-gold-300 shadow-luxury max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div class="flex items-center justify-between pb-4 border-b border-gold-200">
              <div>
                <h3 class="font-serif text-xl font-bold text-rosewood-900">Add Family Member</h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  Enter details to add to the digital relatives directory
                </p>
              </div>
              <button
                (click)="closeAddModal()"
                class="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            @if (formError()) {
              <div
                class="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium"
              >
                ⚠️ {{ formError() }}
              </div>
            }

            <form (ngSubmit)="submitNewRelative()" class="space-y-4 mt-5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name"
                  name="name"
                  placeholder="e.g., Rajesh Sharma & Family"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1"
                  >Relation Title *</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.relationTitle"
                  name="relationTitle"
                  placeholder="e.g., Chacha Ji (Paternal Uncle), Maasi, Best Friend"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Side *</label>
                  <select
                    [(ngModel)]="formData.side"
                    name="side"
                    class="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                  >
                    <option value="GROOM">Groom's Side</option>
                    <option value="BRIDE">Bride's Side</option>
                    <option value="COMMON">Mutual / Family</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    [(ngModel)]="formData.category"
                    name="category"
                    class="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                  >
                    <option value="IMMEDIATE_FAMILY">Immediate Family</option>
                    <option value="EXTENDED_FAMILY">Extended Family</option>
                    <option value="FRIENDS">Friends</option>
                    <option value="COLLEAGUES">Colleagues</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.city"
                    name="city"
                    placeholder="e.g. Jaipur, Delhi"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Room / Table</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.tableOrRoom"
                    name="tableOrRoom"
                    placeholder="e.g. Villa 204"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1"
                  >Personal Note / Bio</label
                >
                <textarea
                  [(ngModel)]="formData.bio"
                  name="bio"
                  rows="2"
                  placeholder="Share a sweet memory, fun trivia, or wedding role..."
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                ></textarea>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVIP"
                  [(ngModel)]="formData.isVIP"
                  name="isVIP"
                  class="w-4 h-4 text-gold-600 rounded"
                />
                <label for="isVIP" class="text-xs text-gray-700 font-medium"
                  >Mark as VIP Guest / Elder</label
                >
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-gold-200">
                <button
                  type="button"
                  (click)="closeAddModal()"
                  class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2.5 rounded-xl bg-rosewood-800 text-white text-sm font-medium hover:bg-rosewood-900 shadow-md transition-all"
                >
                  Save to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class RelativesComponent implements OnInit {
  readonly store = inject(RelativesStore);
  private readonly confetti = inject(ConfettiService);

  readonly searchInput = signal<string>('');
  readonly isModalOpen = signal<boolean>(false);
  readonly formError = signal<string | null>(null);

  readonly categories: { label: string; value: RelativeCategory | 'ALL' }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Immediate Family', value: 'IMMEDIATE_FAMILY' },
    { label: 'Extended Family', value: 'EXTENDED_FAMILY' },
    { label: 'Friends', value: 'FRIENDS' },
    { label: 'Colleagues', value: 'COLLEAGUES' },
  ];

  formData: CreateRelativeDto = {
    name: '',
    relationTitle: '',
    side: 'GROOM',
    category: 'EXTENDED_FAMILY',
    avatarEmoji: '👨‍👩‍👦',
    bio: '',
    city: '',
    tableOrRoom: '',
    isVIP: false,
  };

  ngOnInit(): void {
    this.store.initialize();
  }

  onSearchChange(query: string): void {
    this.searchInput.set(query);
    this.store.updateSearch(query);
  }

  resetFilters(): void {
    this.searchInput.set('');
    this.store.updateSearch('');
    this.store.setSide('ALL');
    this.store.setCategory('ALL');
  }

  openAddModal(): void {
    this.formError.set(null);
    this.formData = {
      name: '',
      relationTitle: '',
      side: 'GROOM',
      category: 'EXTENDED_FAMILY',
      avatarEmoji: '👨‍👩‍👦',
      bio: '',
      city: '',
      tableOrRoom: '',
      isVIP: false,
    };
    this.isModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isModalOpen.set(false);
  }

  submitNewRelative(): void {
    const result = this.store.addRelative(this.formData);
    if (!result.success) {
      this.formError.set(result.error ?? 'Please check the form fields');
      return;
    }

    this.confetti.celebrate();
    this.closeAddModal();
  }
}
