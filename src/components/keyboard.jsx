"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Keyboard({ mode = "auto", className, ...props }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getEffectiveTheme = () => {
    if (mode === "light") return "light";
    if (mode === "dark") return "dark";
    if (mode === "auto") {
      if (!mounted) return "light"; // Default to light during SSR
      return theme === "system" ? systemTheme : theme;
    }
    return "light";
  };

  const effectiveTheme = getEffectiveTheme();
  const isDark = effectiveTheme === "dark";

  const keyboardSrc = isDark ? "/keyboard-d.svg" : "/keyboard-l.svg";

  return (
    <div className={className} {...props}>
      <Image
        src={keyboardSrc}
        alt="Keyboard"
        width={360}
        height={288}
        priority
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}
