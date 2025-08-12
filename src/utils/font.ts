const italicBoldRegex = /(?:italic\s+bold|bold\s+italic)\s*$/i;
const italicRegex = /italic\s*$/i;
const boldRegex = /bold\s*$/i;

export function inferFontVariant(name: string): {
  family: string;
  style: "normal" | "italic";
  weight: "normal" | "bold";
} {
  if (italicBoldRegex.test(name))
    return {
      family: name.replace(italicBoldRegex, "").trim(),
      style: "italic",
      weight: "bold",
    };

  if (italicRegex.test(name))
    return {
      family: name.replace(italicRegex, "").trim(),
      style: "italic",
      weight: "normal",
    };

  if (boldRegex.test(name))
    return {
      family: name.replace(boldRegex, "").trim(),
      style: "normal",
      weight: "bold",
    };

  return {
    family: name.replace(boldRegex, "").trim(),
    style: "normal",
    weight: "normal",
  };
}
