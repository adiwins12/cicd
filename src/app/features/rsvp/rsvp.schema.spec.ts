import { RsvpSubmission, RsvpSubmissionSchema } from './rsvp.schema';

describe('RsvpSubmissionSchema (Zod Validation)', () => {
  it('should accept valid RSVP data', () => {
    const valid: RsvpSubmission = {
      fullName: 'Ankit Sharma',
      phone: '+91 98765 43210',
      email: 'ankit@example.com',
      side: 'GROOM',
      attending: true,
      guestCount: 2,
      eventsAttending: ['Haldi Ceremony', 'Grand Reception Dinner'],
      dietaryPreference: 'VEG',
      needsAccommodation: true,
      blessingMessage: 'Hearty congratulations!',
    };

    const result = RsvpSubmissionSchema.safeParse(valid);
    expect(result.success).toBeTrue();
  });

  it('should reject invalid email format', () => {
    const invalid = {
      fullName: 'Ankit Sharma',
      phone: '+91 98765 43210',
      email: 'not-an-email',
      side: 'GROOM',
      attending: true,
      guestCount: 2,
      eventsAttending: ['Haldi Ceremony'],
      dietaryPreference: 'VEG',
    };

    const result = RsvpSubmissionSchema.safeParse(invalid);
    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('email'))).toBeTrue();
    }
  });

  it('should reject RSVP when no events are selected', () => {
    const invalid = {
      fullName: 'Ankit Sharma',
      phone: '+91 98765 43210',
      email: 'valid@example.com',
      side: 'GROOM',
      attending: true,
      guestCount: 2,
      eventsAttending: [],
      dietaryPreference: 'VEG',
    };

    const result = RsvpSubmissionSchema.safeParse(invalid);
    expect(result.success).toBeFalse();
  });
});
