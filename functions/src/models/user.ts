
import { z } from 'zod';

export const UserSchema = z.object({
  fcmTokens: z.array(z.string()),
  notificationPreferences: z.object({
    platforms: z.array(z.string()),
    types: z.array(z.string()),
    genres: z.array(z.string()),
  }),
});

export type User = z.infer<typeof UserSchema>;
