"use client";

import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

export function ReactColorPicker({ value, onChange, label }) {
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
  // Parse color for display
  const getDisplayColor = () => {
    return color;
  };

  const getDisplayText = () => {
    return color;
  };

  return (
    <div className="relative">
      <div
        className="w-full h-9 border border-input rounded-md cursor-pointer flex items-center px-3 bg-background hover:bg-accent"
        onClick={handleClick}
      >
        <div
          className="w-6 h-6 rounded border mr-2"
          style={{ backgroundColor: getDisplayColor() }}
        />
        <span className="text-sm font-mono">{getDisplayText()}</span>
      </div>
      
      {showPicker && (
        <div className="absolute top-12 left-0 z-50">
          <div
            className="fixed inset-0"
            onClick={handleClose}
          />
          <ChromePicker
            color={color}
            onChange={handleChange}
            disableAlpha={false}
            className="bg-background rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
