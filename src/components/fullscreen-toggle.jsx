"use client";

import { useState, useEffect } from "react";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FullscreenToggle({ isFullscreen, onToggleFullscreen }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (isFullscreen) {
      setShowButton(true);
      const timer = setTimeout(() => {
        setShowButton(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [isFullscreen]);

  if (!isFullscreen) return null;

  return (
    <div className={`absolute top-4 right-4 z-50 transition-opacity duration-300 ${showButton ? "opacity-100" : "opacity-0 hover:opacity-100"}`} onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}>
      <Button onClick={onToggleFullscreen} className="border bg-background hover:bg-accent text-accent-foreground">
        <Minimize2 className="w-4 h-4" />
        <p className="border px-1.5 bg-accent">esc</p>
      </Button>
    </div>
  );
}
