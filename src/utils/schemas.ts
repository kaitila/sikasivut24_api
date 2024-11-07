import * as z from "zod";

export const startGameSchema = z.object({
  telegram: z.string(),
  email: z.string(),
  timestamp: z.coerce.number(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
  score: z.coerce.number(),
  jumpCount: z.coerce.number(),
  timestamp: z.coerce.number(),
  state: z
    .object({
      id: z.coerce.number(),
      ts: z.coerce.number(),
    })
    .array(),
});
