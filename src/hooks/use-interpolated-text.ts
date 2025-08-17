import { useMemo } from "react";
import { z } from "zod/v4";

type Json = z.infer<ReturnType<typeof z.json>>;

function isJsonLeaf(json: Json): json is string | number | boolean | null {
  return (
    typeof json === "string" ||
    typeof json === "number" ||
    typeof json === "boolean" ||
    json === null ||
    json === undefined
  );
}

function getJsonValue(json: Json, path: string): string {
  path = path.replace(/\[(\w+)\]/g, ".$1");
  const keys = path.split(".");
  let value: Json = json;
  while (keys.length) {
    if (isJsonLeaf(value)) return "";
    const key = keys.shift()!;
    value = Array.isArray(value) ? value[+key] : value[key];
  }
  return value === null || value === undefined ? "" : String(value);
}

export function interpolateText(text: string, json: Json): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\v/g, "\v")
    .replace(/<([^<>]+)>/g, (_, path) => getJsonValue(json, path));
}

export default function useInterpolatedText(text: string, json: Json): string {
  return useMemo(() => interpolateText(text, json), [json, text]);
}
