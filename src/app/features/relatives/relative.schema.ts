import { z } from 'zod';

export const RelativeSideSchema = z.enum(['GROOM', 'BRIDE', 'COMMON']);
export type RelativeSide = z.infer<typeof RelativeSideSchema>;

export const RelativeCategorySchema = z.enum([
  'IMMEDIATE_FAMILY',
  'EXTENDED_FAMILY',
  'FRIENDS',
  'COLLEAGUES',
]);
export type RelativeCategory = z.infer<typeof RelativeCategorySchema>;

export const RelativeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Name must have at least 2 characters'),
  relationTitle: z.string().min(1, 'Relation title is required (e.g., Chacha, Maasi, Best Friend)'),
  side: RelativeSideSchema,
  category: RelativeCategorySchema,
  avatarEmoji: z.string().default('👨‍👩‍👦'),
  bio: z.string().max(250, 'Note must not exceed 250 characters').optional(),
  city: z.string().min(1, 'City is required'),
  tableOrRoom: z.string().optional(),
  isVIP: z.boolean().default(false),
});

export const CreateRelativeSchema = RelativeSchema.omit({ id: true });

export type Relative = z.infer<typeof RelativeSchema>;
export type CreateRelativeDto = z.infer<typeof CreateRelativeSchema>;
