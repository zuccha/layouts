import z from "zod/v4";

export const dataSchema = z.record(z.string(), z.json());
export type Data = z.infer<typeof dataSchema>;

export const dataListSchema = z.array(dataSchema).min(1);
export type DataListRaw = z.infer<typeof dataListSchema>;
export type DataList = [DataListRaw[number], ...DataListRaw];

export const dataResponseSchema = z.union([
  dataSchema,
  z.array(dataSchema).min(1),
]);
