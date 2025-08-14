"use client";

import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { cn } from "@/lib/utils";

export function ReactColorPicker({ value, onChange, className }) {
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState(value || "rgba(255, 255, 255, 1)");

  useEffect(() => {
    if (value) {
      setColor(value);
    }
  }, [value]);

  const handleChange = (color) => {
    // Always use rgba format as default
    const colorValue = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

    setColor(colorValue);
    if (onChange) {
      onChange(colorValue);
    }
  };

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleClose = () => {
    setShowPicker(false);
  };

  const getDisplayColor = () => {
    return color;
  };

  const getDisplayText = () => {
    return color;
  };

  return (
    <div className="relative">
      <div
        className={
          cn(
            "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", 
            "h-9 px-4 py-2 has-[>svg]:px-3", 
            "cursor-default border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50", 
            className,
          )
        }
        onClick={handleClick}
      >
        <div className="w-6 h-6 rounded border mr-2" style={{ backgroundColor: getDisplayColor() }} />
        <span className="text-xs font-mono">{getDisplayText()}</span>
      </div>

      {showPicker && (
        <div className="absolute top-12 left-0 z-50">
          <div className="fixed inset-0" onClick={handleClose} />
          <ChromePicker color={color} onChange={handleChange} disableAlpha={false} className="bg-background rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
