import { z } from 'zod';

export const WeddingConfigSchema = z.object({
  groomName: z.string().min(1, 'Groom name is required'),
  brideName: z.string().min(1, 'Bride name is required'),
  weddingDate: z.string().datetime({ offset: true }),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  tagline: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
});

export const EnvironmentSchema = z.object({
  production: z.boolean(),
  weddingConfig: WeddingConfigSchema,
});

export type Environment = z.infer<typeof EnvironmentSchema>;
export type WeddingConfig = z.infer<typeof WeddingConfigSchema>;

export function validateEnvironment(rawEnv: unknown): Environment {
  const result = EnvironmentSchema.safeParse(rawEnv);
  if (!result.success) {
    console.error('Environment validation failed:', result.error.format());
    throw new Error('Invalid environment configuration');
  }
  return result.data;
}
