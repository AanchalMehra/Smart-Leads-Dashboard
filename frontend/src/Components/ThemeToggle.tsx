import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import type { JSX } from "react";

function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-text-muted shadow-lg hover:text-text-main transition-all active:scale-90 cursor-pointer hover:shadow-xl"
      style={{ width: "44px", height: "44px" }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

export default ThemeToggle;