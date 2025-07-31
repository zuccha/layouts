import { LuMoon, LuSun } from "react-icons/lu";
import IconButton from "../components/ui/icon-button";
import useTheme from "./use-theme";

export default function ThemeButton() {
  const [theme, _setColorMode, toggleTheme] = useTheme();
  return (
    <IconButton
      Icon={theme === "dark" ? LuMoon : LuSun}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="sm"
      variant="ghost"
    />
  );
}
