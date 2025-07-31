import z from "zod/v4";

//------------------------------------------------------------------------------
// Color
//------------------------------------------------------------------------------

export const scryfallColor = z.enum(["W", "U", "B", "R", "G"]);

//------------------------------------------------------------------------------
// Shop
//------------------------------------------------------------------------------

export const scryfallShopSchema = z.enum([
  "cardmarket",
  "cardhoarder",
  "tcgplayer",
]);

//------------------------------------------------------------------------------
// Card Layout
//------------------------------------------------------------------------------

export const scryfallCardLayoutSchema = z.enum([
  "normal",
  "split",
  "flip",
  "transform",
  "modal_dfc",
  "meld",
  "leveler",
  "saga",
  "adventure",
  "planar",
  "scheme",
  "vanguard",
  "token",
  "double_faced_token",
  "emblem",
  "augment",
  "host",
  "art_series",
  "reversible_card",
  "battle",
  "attraction",
]);

//------------------------------------------------------------------------------
// Card Format
//------------------------------------------------------------------------------

export const scryfallCardFormatSchema = z.enum([
  "standard",
  "future",
  "historic",
  "gladiator",
  "pioneer",
  "explorer",
  "modern",
  "legacy",
  "pauper",
  "vintage",
  "penny",
  "commander",
  "oathbreaker",
  "brawl",
  "alchemy",
  "paupercommander",
  "duel",
  "oldschool",
  "premodern",
  "predh",
  "timeless",
  "standardbrawl",
]);

//------------------------------------------------------------------------------
// Card Related Card Component
//------------------------------------------------------------------------------

export const scryfallCardRelatedCardComponentSchema = z.enum([
  "token",
  "meld_part",
  "meld_result",
  "combo_piece",
]);

//------------------------------------------------------------------------------
// Card Related Card
//------------------------------------------------------------------------------

export const scryfallCardRelatedCardSchema = z.object({
  component: scryfallCardRelatedCardComponentSchema,
  id: z.uuid(),
  name: z.string(),
  object: z.literal("related_card"),
  type_line: z.string(),
  uri: z.url(),
});

//------------------------------------------------------------------------------
// Card Legality
//------------------------------------------------------------------------------

export const scryfallCardLegalitySchema = z.enum([
  "legal",
  "not_legal",
  "restricted",
  "banned",
]);

//------------------------------------------------------------------------------
// Card Border Color
//------------------------------------------------------------------------------

export const scryfallCardBorderColorSchema = z.enum([
  "black",
  "white",
  "borderless",
  "yellow",
  "silver",
  "gold",
]);

//------------------------------------------------------------------------------
// Card Finish
//------------------------------------------------------------------------------

export const scryfallCardFinishSchema = z.enum(["foil", "nonfoil", "etched"]);

//------------------------------------------------------------------------------
// Card Frame
//------------------------------------------------------------------------------

export const scryfallFrameSchema = z.enum([
  "1993",
  "1997",
  "2003",
  "2015",
  "future",
]);

//------------------------------------------------------------------------------
// Card Frame Effect
//------------------------------------------------------------------------------

export const scryfallFrameEffectSchema = z.enum([
  "legendary",
  "miracle",
  "enchantment",
  "draft",
  "devoid",
  "tombstone",
  "colorshifted",
  "inverted",
  "sunmoondfc",
  "compasslanddfc",
  "originpwdfc",
  "mooneldrazidfc",
  "waxingandwaningmoondfc",
  "showcase",
  "extendedart",
  "companion",
  "etched",
  "snow",
  "lesson",
  "shatteredglass",
  "convertdfc",
  "fandfc",
  "upsidedowndfc",
  "spree",
]);

//------------------------------------------------------------------------------
// Card Game
//------------------------------------------------------------------------------

export const scryfallCardGameSchema = z.enum(["paper", "arena", "mtgo"]);

//------------------------------------------------------------------------------
// Card Image Format
//------------------------------------------------------------------------------

export const scryfallCardImageFormatSchema = z.enum([
  "png",
  "border_crop",
  "art_crop",
  "large",
  "normal",
  "small",
]);

//------------------------------------------------------------------------------
// Card Image Status
//------------------------------------------------------------------------------

export const scryfallCardImageStatusSchema = z.enum([
  "missing",
  "placeholder",
  "lowres",
  "highres_scan",
]);

//------------------------------------------------------------------------------
// Card Price
//------------------------------------------------------------------------------

export const scryfallCardPriceSchema = z.enum([
  "usd",
  "usd_foil",
  "usd_etched",
  "eur",
  "eur_foil",
  "tix",
]);

//------------------------------------------------------------------------------
// Card Rarity
//------------------------------------------------------------------------------

export const scryfallCardRaritySchema = z.enum([
  "common",
  "uncommon",
  "rare",
  "special",
  "mythic",
  "bonus",
]);

//------------------------------------------------------------------------------
// Card Online Resource
//------------------------------------------------------------------------------

export const scryfallCardOnlineResourceSchema = z.enum([
  "edhrec",
  "gatherer",
  "tcgplayer_infinite_articles",
  "tcgplayer_infinite_decks",
]);

//------------------------------------------------------------------------------
// Card Security Stamp
//------------------------------------------------------------------------------

export const scryfallCardSecurityStampSchema = z.enum([
  "oval",
  "triangle",
  "acorn",
  "circle",
  "arena",
  "heart",
]);

//------------------------------------------------------------------------------
// Card Face
//------------------------------------------------------------------------------

export const scryfallCardFaceSchema = z.object({
  artist: z.string().optional(),
  artist_ids: z.array(z.string()).optional(),
  cmc: z.number().optional(),
  color_indicator: z.array(scryfallColor).optional(),
  colors: z.array(scryfallColor).optional(),
  defense: z.string().optional(),
  flavor_text: z.string().optional(),
  illustration_id: z.uuid().optional(),
  image_uris: z.record(scryfallCardImageFormatSchema, z.url()).optional(),
  layout: scryfallCardLayoutSchema.optional(),
  loyalty: z.string().optional(),
  mana_cost: z.string(),
  name: z.string(),
  object: z.literal("card_face"),
  oracle_id: z.uuid().optional(),
  oracle_text: z.string().optional(),
  power: z.string().optional(),
  printed_name: z.string().optional(),
  printed_text: z.string().optional(),
  printed_type_line: z.string().optional(),
  toughness: z.string().optional(),
  type_line: z.string().optional(),
  watermark: z.string().optional(),
});

//------------------------------------------------------------------------------
// Card
//------------------------------------------------------------------------------

export const scryfallCardSchema = z.object({
  // Basic
  id: z.uuid(),
  lang: z.string(),
  layout: scryfallCardLayoutSchema,
  object: z.literal("card"),

  // Other ids
  arena_id: z.number().optional(),
  cardmarket_id: z.number().optional(),
  mtgo_foil_id: z.number().optional(),
  mtgo_id: z.number().optional(),
  multiverse_ids: z.array(z.number()).optional(),
  oracle_id: z.uuid().optional(),
  tcgplayer_etched_id: z.number().optional(),
  tcgplayer_id: z.number().optional(),

  // URIs
  prints_search_uri: z.string().url(),
  rulings_uri: z.string().url(),
  scryfall_uri: z.string().url(),
  uri: z.string().url(),

  // Gameplay
  all_parts: z.array(scryfallCardRelatedCardSchema).nullable(),
  card_faces: z.array(scryfallCardFaceSchema).optional(),
  cmc: z.number(),
  color_identity: z.array(scryfallColor),
  color_indicator: z.array(scryfallColor).optional(),
  colors: z.array(scryfallColor).optional(),
  defense: z.string().optional(),
  edhrec_rank: z.number().optional(),
  game_changer: z.boolean().optional(),
  hand_modifier: z.number().optional(),
  keywords: z.array(z.string()),
  legalities: z.record(scryfallCardFormatSchema, scryfallCardLegalitySchema),
  life_modifier: z.string().optional(),
  loyalty: z.string().optional(),
  mana_cost: z.string().optional(),
  name: z.string(),
  oracle_text: z.string().optional(),
  penny_rank: z.number().optional(),
  power: z.string().optional(),
  produced_mana: z.array(scryfallColor).optional(),
  reserved: z.boolean(),
  toughness: z.string().optional(),
  type_line: z.string(),

  // Print
  artist: z.string().optional(),
  artist_ids: z.array(z.string()).optional(),
  attraction_lights: z.array(z.number()).optional(),
  booster: z.boolean(),
  border_color: scryfallCardBorderColorSchema,
  card_back_id: z.uuid(),
  collector_number: z.string(),
  content_warning: z.boolean().optional(),
  digital: z.boolean(),
  finishes: z.array(scryfallCardFinishSchema),
  flavor_name: z.string().optional(),
  flavor_text: z.string().optional(),
  foil: z.boolean(),
  frame: scryfallFrameSchema,
  frame_effects: z.array(scryfallFrameEffectSchema).optional(),
  full_art: z.boolean(),
  games: z.array(scryfallCardGameSchema),
  highres_image: z.boolean(),
  illustration_id: z.uuid().optional(),
  image_status: scryfallCardImageStatusSchema,
  image_uris: z.record(scryfallCardImageFormatSchema, z.url()).optional(),
  nonfoil: z.boolean(),
  oversized: z.boolean(),
  preview: z
    .object({
      previewed_at: z.string().optional(),
      source: z.string().optional(),
      source_uri: z.url().optional(),
    })
    .optional(),
  prices: z.record(scryfallCardPriceSchema, z.string().nullable()),
  printed_name: z.string().optional(),
  printed_text: z.string().optional(),
  printed_type_line: z.string().optional(),
  promo: z.boolean(),
  promo_types: z.array(z.string()).optional(),
  purchase_uris: z.record(scryfallShopSchema, z.string()).optional(),
  rarity: scryfallCardRaritySchema,
  related_uris: z.record(scryfallCardOnlineResourceSchema, z.url()),
  released_at: z.string(),
  reprint: z.boolean(),
  scryfall_set_uri: z.url(),
  security_stamp: scryfallCardSecurityStampSchema.optional(),
  set: z.string(),
  set_id: z.uuid(),
  set_name: z.string(),
  set_search_uri: z.url(),
  set_type: z.string(),
  set_uri: z.url(),
  story_spotlight: z.boolean(),
  textless: z.boolean(),
  variation: z.boolean(),
  variation_of: z.uuid().optional(),
  watermark: z.string().optional(),
});

export type ScryfallCard = z.infer<typeof scryfallCardSchema>;
