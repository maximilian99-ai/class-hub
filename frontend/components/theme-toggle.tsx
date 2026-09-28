"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" aria-label="toggle-theme" className="gap-2">
        <Sun className="h-4 w-4" />
        Light
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="toggle-theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="gap-2"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
