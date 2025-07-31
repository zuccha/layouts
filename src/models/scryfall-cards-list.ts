import z from "zod/v4";
import { scryfallCardSchema } from "./scryfall-card";

export const scryfallCardsListSchema = z.object({
  data: z.array(scryfallCardSchema),
  has_more: z.boolean(),
  next_page: z.url(),
  object: z.literal("list"),
  total_cards: z.number(),
});

export type ScryfallCardsList = z.infer<typeof scryfallCardsListSchema>;
