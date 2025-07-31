import { useCallback } from "react";
import { useStorePersistent } from "../utils/store-persistent";
import { type Theme, themeSchema } from "./theme";

export default function useTheme(): [
  Theme,
  React.Dispatch<React.SetStateAction<Theme>>,
  () => void,
] {
  const [theme, setTheme] = useStorePersistent<Theme>(
    "theme",
    "light",
    themeSchema.parse,
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return [theme, setTheme, toggleTheme];
}
