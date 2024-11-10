import * as z from "zod";

export const startGameSchema = z.object({
  telegram: z.string().max(32),
  nickname: z.string().max(32),
  timestamp: z.coerce.number(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
  score: z.coerce.number(),
  timestamp: z.coerce.number(),
  state: z.coerce.number().array(),
});

export const verifyDrinkTicketSchema = z.object({
  gameId: z.string(),
});
