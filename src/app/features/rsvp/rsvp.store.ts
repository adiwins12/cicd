import { computed, inject } from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { z } from 'zod';
import { INITIAL_RSVPS } from './rsvp-mock.data';
import { RsvpSubmission, RsvpSubmissionSchema, StoredRsvp, StoredRsvpSchema } from './rsvp.schema';

interface RsvpState {
  rsvps: StoredRsvp[];
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const RSVP_STORAGE_KEY = 'wedding_portal_rsvps';

const initialState: RsvpState = {
  rsvps: [],
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

export const RsvpStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ rsvps }) => ({
    totalConfirmedAttendees: computed(() =>
      rsvps()
        .filter((r) => r.attending)
        .reduce((sum, r) => sum + r.guestCount, 0)
    ),
    totalRsvpsReceived: computed(() => rsvps().length),
    accommodationRequests: computed(
      () => rsvps().filter((r) => r.attending && r.needsAccommodation).length
    ),
    dietaryBreakdown: computed(() => {
      const records = rsvps().filter((r) => r.attending);
      return {
        veg: records
          .filter((r) => r.dietaryPreference === 'VEG')
          .reduce((s, r) => s + r.guestCount, 0),
        jain: records
          .filter((r) => r.dietaryPreference === 'JAIN_VEG')
          .reduce((s, r) => s + r.guestCount, 0),
        nonVeg: records
          .filter((r) => r.dietaryPreference === 'NON_VEG')
          .reduce((s, r) => s + r.guestCount, 0),
        vegan: records
          .filter((r) => r.dietaryPreference === 'VEGAN')
          .reduce((s, r) => s + r.guestCount, 0),
      };
    }),
    wishes: computed(() =>
      rsvps()
        .filter((r) => !!r.blessingMessage && r.blessingMessage.trim().length > 0)
        .map((r) => ({
          author: r.fullName,
          side: r.side,
          message: r.blessingMessage!,
          date: r.submittedAt,
        }))
    ),
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    initialize() {
      const saved = storage.getItem<StoredRsvp[]>(
        RSVP_STORAGE_KEY,
        z.array(StoredRsvpSchema),
        INITIAL_RSVPS
      );
      patchState(store, { rsvps: saved });
    },

    async submitRsvp(submission: RsvpSubmission): Promise<{ success: boolean; error?: string }> {
      patchState(store, { isSubmitting: true, error: null, isSuccess: false });

      // 1. Zod runtime schema validation
      const validation = RsvpSubmissionSchema.safeParse(submission);
      if (!validation.success) {
        const errorMsg = validation.error.errors[0]?.message ?? 'Invalid form submission';
        patchState(store, { isSubmitting: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      // 2. Simulate network delay (500ms) for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRecord: StoredRsvp = {
        ...validation.data,
        id: `rsvp-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };

      const updated = [newRecord, ...store.rsvps()];
      patchState(store, {
        rsvps: updated,
        isSubmitting: false,
        isSuccess: true,
        error: null,
      });

      storage.setItem(RSVP_STORAGE_KEY, updated, z.array(StoredRsvpSchema));
      return { success: true };
    },

    resetSubmissionStatus() {
      patchState(store, { isSuccess: false, error: null });
    },

    resetToDefault() {
      patchState(store, { rsvps: INITIAL_RSVPS });
      storage.setItem(RSVP_STORAGE_KEY, INITIAL_RSVPS, z.array(StoredRsvpSchema));
    },
  }))
);
