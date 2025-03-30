"use client";

import { Button } from "@heroui/react";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      className="rounded-none"
      variant="light"
      size="lg"
      isIconOnly
      onPress={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? <MoonStar size={16} /> : <Sun size={16} />}
    </Button>
  );
}
