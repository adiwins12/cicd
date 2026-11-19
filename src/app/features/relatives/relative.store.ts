import { computed, inject } from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, tap } from 'rxjs';
import { z } from 'zod';
import {
  CreateRelativeDto,
  CreateRelativeSchema,
  Relative,
  RelativeCategory,
  RelativeSchema,
  RelativeSide,
} from './relative.schema';
import { INITIAL_RELATIVES } from './relatives-mock.data';

interface RelativesState {
  relatives: Relative[];
  selectedSide: RelativeSide | 'ALL';
  selectedCategory: RelativeCategory | 'ALL';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'wedding_portal_relatives';

const initialState: RelativesState = {
  relatives: [],
  selectedSide: 'ALL',
  selectedCategory: 'ALL',
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const RelativesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ relatives, selectedSide, selectedCategory, searchQuery }) => ({
    filteredRelatives: computed(() => {
      const side = selectedSide();
      const category = selectedCategory();
      const query = searchQuery().toLowerCase().trim();

      return relatives().filter((rel) => {
        const matchesSide = side === 'ALL' || rel.side === side || rel.side === 'COMMON';
        const matchesCategory = category === 'ALL' || rel.category === category;
        const matchesQuery =
          !query ||
          rel.name.toLowerCase().includes(query) ||
          rel.relationTitle.toLowerCase().includes(query) ||
          rel.city.toLowerCase().includes(query) ||
          (rel.bio && rel.bio.toLowerCase().includes(query));

        return matchesSide && matchesCategory && matchesQuery;
      });
    }),
    totalCount: computed(() => relatives().length),
    groomSideCount: computed(() => relatives().filter((r) => r.side === 'GROOM').length),
    brideSideCount: computed(() => relatives().filter((r) => r.side === 'BRIDE').length),
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    initialize() {
      const stored = storage.getItem<Relative[]>(
        STORAGE_KEY,
        z.array(RelativeSchema),
        INITIAL_RELATIVES
      );
      patchState(store, { relatives: stored });
    },

    setSide(side: RelativeSide | 'ALL') {
      patchState(store, { selectedSide: side });
    },

    setCategory(category: RelativeCategory | 'ALL') {
      patchState(store, { selectedCategory: category });
    },

    // RxJS method for debounced typeahead search
    updateSearch: rxMethod<string>(
      pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query }))
      )
    ),

    addRelative(dto: CreateRelativeDto): { success: boolean; error?: string } {
      const validation = CreateRelativeSchema.safeParse(dto);
      if (!validation.success) {
        return { success: false, error: validation.error.errors[0]?.message };
      }

      const newRelative: Relative = {
        ...validation.data,
        id: `rel-${Date.now()}`,
      };

      const updated = [newRelative, ...store.relatives()];
      patchState(store, { relatives: updated });
      storage.setItem(STORAGE_KEY, updated, z.array(RelativeSchema));
      return { success: true };
    },

    deleteRelative(id: string) {
      const updated = store.relatives().filter((r) => r.id !== id);
      patchState(store, { relatives: updated });
      storage.setItem(STORAGE_KEY, updated, z.array(RelativeSchema));
    },

    resetToDefault() {
      patchState(store, { relatives: INITIAL_RELATIVES });
      storage.setItem(STORAGE_KEY, INITIAL_RELATIVES, z.array(RelativeSchema));
    },
  }))
);
