
import { z } from "zod";

export const GiveawaySchema = z.object({
  id: z.number(),
  title: z.string(),
  worth: z.string(),
  thumbnail: z.string(),
  image: z.string(),
  description: z.string(),
  instructions: z.string(),
  open_giveaway_url: z.string().url(),
  published_date: z.string(),
  type: z.string(),
  platforms: z.string(),
  end_date: z.string(),
  users: z.number(),
  status: z.string(),
  gamerpower_url: z.string().url(),
  open_giveaway: z.string().url(),
});

export type Giveaway = z.infer<typeof GiveawaySchema>;
