export function capitalize(text: string): string {
  return text.length === 0 ? "" : text[0].toUpperCase() + text.substring(1);
}
