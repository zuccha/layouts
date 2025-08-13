import z from "zod/v4";
import { normalizedListSchema } from "../utils/normalized-list";

//------------------------------------------------------------------------------
// Utils
//------------------------------------------------------------------------------

const borderRadiusSchema = z.object({
  bl: z.number().default(0),
  br: z.number().default(0),
  tl: z.number().default(0),
  tr: z.number().default(0),
});

const borderSchema = z.object({
  color: z.string().default("rgba(0, 0, 0, 1)"),
  radius: borderRadiusSchema.default(borderRadiusSchema.parse({})),
  width: z.number().default(0),
});

//------------------------------------------------------------------------------
// Pattern
//------------------------------------------------------------------------------

const patternDelimiterSchema = z.object({
  close: z.string().default(""),
  open: z.string().default(""),
});

const patternStylesSchema = z.object({
  fontStyle: z.enum(["normal", "italic"]).default("normal"),
  fontWeight: z.enum(["normal", "bold"]).default("normal"),
  textTransform: z
    .enum(["none", "capitalize", "lowercase", "uppercase"])
    .default("none"),
});

export const patternSchema = z.object({
  delimiter: patternDelimiterSchema.default(patternDelimiterSchema.parse({})),
  delimiterMode: z.enum(["include", "exclude"]).default("exclude"),
  styles: patternStylesSchema.default(patternStylesSchema.parse({})),
  symbolPath: z.string().default(""),
  symbolShadow: z.boolean().default(false),
  type: z.enum(["symbol", "text"]).default("text"),
});

export type Pattern = z.infer<typeof patternSchema>;

//------------------------------------------------------------------------------
// Layout Item Box
//------------------------------------------------------------------------------

export const layoutItemBoxSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().default(""),
  visible: z.boolean().default(true),

  backgroundColor: z.string().default("rgba(255, 255, 255, 0)"),
  border: borderSchema.default(borderSchema.parse({})),

  pb: z.number().default(0),
  pl: z.number().default(0),
  pr: z.number().default(0),
  pt: z.number().default(0),

  x0: z.number().default(0),
  x1: z.number().default(0),
  y0: z.number().default(0),
  y1: z.number().default(0),
});

export type LayoutItemBox = z.infer<typeof layoutItemBoxSchema>;

//------------------------------------------------------------------------------
// Layout Item Image
//------------------------------------------------------------------------------

export const layoutItemImageSchema = z.intersection(
  layoutItemBoxSchema,
  z.object({
    _type: z.literal("image").default("image"),
    source: z.string().default(""),
  }),
);

export type LayoutItemImage = z.infer<typeof layoutItemImageSchema>;

//------------------------------------------------------------------------------
// Layout Item Rectangle
//------------------------------------------------------------------------------

export const layoutItemRectangleSchema = z.intersection(
  layoutItemBoxSchema,
  z.object({
    _type: z.literal("rectangle").default("rectangle"),
    source: z.string().default(""),
  }),
);

export type LayoutItemRectangle = z.infer<typeof layoutItemRectangleSchema>;

//------------------------------------------------------------------------------
// Layout Item - Text
//------------------------------------------------------------------------------

export const layoutItemTextSchema = z.intersection(
  layoutItemBoxSchema,
  z.object({
    _type: z.literal("text").default("text"),
    alignH: z.enum(["left", "center", "right"]).default("left"),
    alignV: z.enum(["top", "middle", "bottom"]).default("middle"),
    fontFamily: z.string().default("Arial"),
    fontSize: z.number().default(16),
    fontStyle: z.enum(["normal", "italic"]).default("normal"),
    fontWeight: z.enum(["normal", "bold"]).default("normal"),
    lineHeight: z.number().default(1.2),
    paragraphGap: z.number().default(4),
    patterns: z.array(patternSchema).default([]),
    text: z.string().default(""),
    textColor: z.string().default("#000000"),
    textTransform: z
      .enum(["none", "capitalize", "lowercase", "uppercase"])
      .default("none"),
  }),
);

export type LayoutItemText = z.infer<typeof layoutItemTextSchema>;

//------------------------------------------------------------------------------
// Layout Item
//------------------------------------------------------------------------------

export const layoutItemSchema = z.union([
  layoutItemImageSchema,
  layoutItemRectangleSchema,
  layoutItemTextSchema,
]);

export type LayoutItem = z.infer<typeof layoutItemSchema>;

//------------------------------------------------------------------------------
// Layout Bleed
//------------------------------------------------------------------------------

export const layoutBleedSchema = z.object({
  color: z.string().default("rgba(0, 0, 0, 1)"),
  h: z.number().default(10),
  visible: z.boolean().default(false),
  w: z.number().default(10),
});

export type LayoutBleed = z.infer<typeof layoutBleedSchema>;

//------------------------------------------------------------------------------
// Layout
//------------------------------------------------------------------------------

const normalizedItemsSchema = normalizedListSchema(layoutItemSchema);

export const layoutSchema = z.object({
  bleed: layoutBleedSchema.default(layoutBleedSchema.parse({})),
  id: z.uuid().default(() => crypto.randomUUID()),
  items: normalizedItemsSchema.default(normalizedItemsSchema.parse({})),
  name: z.string().default("Unnamed"),
  size: z.object({ h: z.number(), w: z.number() }).default({ h: 447, w: 320 }),
});

export type Layout = z.infer<typeof layoutSchema>;
