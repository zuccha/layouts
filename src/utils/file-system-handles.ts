export async function ensurePermission(
  handle: FileSystemHandle,
  mode: "read" | "readwrite",
) {
  const status = await handle.queryPermission({ mode });
  if (status === "granted") return true;
  const requested = await handle.requestPermission({ mode });
  return requested === "granted";
}
