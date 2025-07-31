import z from "zod/v4";

//------------------------------------------------------------------------------
// Card Image
//------------------------------------------------------------------------------

export const cardImage_schema = z.object({
  format: z.enum(["png", "svg"]),
  path: z.string(),
});

export type CardImage = z.infer<typeof cardImage_schema>;

//------------------------------------------------------------------------------
// Card Mana
//------------------------------------------------------------------------------

// prettier-ignore
const card_mana_schema = z.enum([
  // Tap / Untap / Energy / Paw / Planeswalker / Chaos / Acorn / Ticket
  "{T}", "{Q}", "{E}", "{P}", "{PW}", "{CHAOS}", "{A}", "{TK}",

  // Variable generic
  "{X}", "{Y}", "{Z}",

  // Generic numeric
  "{0}", "{½}", "{1}", "{2}", "{3}", "{4}", "{5}", "{6}",
  "{7}", "{8}", "{9}", "{10}", "{11}", "{12}", "{13}",
  "{14}", "{15}", "{16}", "{17}", "{18}", "{19}", "{20}",
  "{100}", "{1000000}", "{∞}",

  // Color hybrid
  "{W/U}", "{W/B}", "{B/R}", "{B/G}", "{U/B}",
  "{U/R}", "{R/G}", "{R/W}", "{G/W}", "{G/U}",

  // Phyrexian color hybrid
  "{B/G/P}", "{B/R/P}", "{G/U/P}", "{G/W/P}", "{R/G/P}",
  "{R/W/P}", "{U/B/P}", "{U/R/P}", "{W/B/P}", "{W/U/P}",

  // Color-colorless hybrid
  "{C/W}", "{C/U}", "{C/B}", "{C/R}", "{C/G}",

  // Mono-hybrid (two generic or one colored)
  "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}",

  // Phyrexian mana
  "{H}", "{W/P}", "{U/P}", "{B/P}", "{R/P}", "{G/P}", "{C/P}",

  // Half-color Un-set
  "{HW}", "{HR}",

  // Mono-colors, colorless, and snow
  "{W}", "{U}", "{B}", "{R}", "{G}", "{C}", "{S}",

  // Mana from Legendary creature / mana from land drop
  "{L}", "{D}",
]);

export type CardMana = z.infer<typeof card_mana_schema>;

//------------------------------------------------------------------------------
// Regular
//------------------------------------------------------------------------------

export const card_regular_schema = z.object({
  _type: z.literal("regular"),
  art: cardImage_schema,
  artist: z.string(),
  collectorNumber: z.string(),
  flavor: z.string(),
  flavorName: z.string(),
  language: z.string(),
  mana: z.array(card_mana_schema),
  name: z.string(),
  oracle: z.string(),
  rarity: z.string(),
  setCode: z.string(),
  typeLine: z.string(),
  year: z.number(),
});
