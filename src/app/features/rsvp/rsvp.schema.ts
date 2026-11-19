import { z } from 'zod';

export const DietaryPreferenceSchema = z.enum(['VEG', 'JAIN_VEG', 'NON_VEG', 'VEGAN']);
export type DietaryPreference = z.infer<typeof DietaryPreferenceSchema>;

export const RsvpSideSchema = z.enum(['GROOM', 'BRIDE', 'FRIEND', 'COLLEAGUE']);
export type RsvpSide = z.infer<typeof RsvpSideSchema>;

export const RsvpSubmissionSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (minimum 2 characters)'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  side: RsvpSideSchema,
  attending: z.boolean(),
  guestCount: z
    .number()
    .int()
    .min(1, 'At least 1 guest required')
    .max(10, 'Maximum 10 guests per entry'),
  eventsAttending: z.array(z.string()).refine((arr) => arr.length > 0, {
    message: 'Please select at least one event you will attend',
  }),
  dietaryPreference: DietaryPreferenceSchema,
  needsAccommodation: z.boolean().default(false),
  arrivalNotes: z.string().max(300).optional(),
  blessingMessage: z
    .string()
    .max(500, 'Blessing message must not exceed 500 characters')
    .optional(),
});

export const StoredRsvpSchema = RsvpSubmissionSchema.extend({
  id: z.string(),
  submittedAt: z.string(),
});

export type RsvpSubmission = z.infer<typeof RsvpSubmissionSchema>;
export type StoredRsvp = z.infer<typeof StoredRsvpSchema>;
